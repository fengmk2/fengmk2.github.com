# Windows CLI Testing from macOS: Cross-Compilation + QEMU VM

How I set up a local Windows development and testing workflow on macOS for [Vite+](https://viteplus.dev), using Rust cross-compilation and a QEMU-based Windows VM.

## The Problem

Vite+ is a monorepo task runner with a Rust CLI (`vp`) and a Node.js NAPI binding. It supports Windows, macOS, and Linux. The CI runs snap tests (CLI output snapshot tests) and ecosystem-ci (real-world project migration + build tests) on all three platforms using GitHub Actions.

But when a Windows-specific bug is reported, the development cycle is painful:

1. Make a code change on macOS
2. Push to GitHub
3. Wait for Windows CI to build from scratch (~15 min)
4. Read the CI logs to see if the fix works
5. Repeat

I wanted to **run Windows tests locally from macOS** -- no dual-boot, no remote desktop, no waiting for CI.

## The Solution: cargo-xwin + qwin

Two tools make this possible:

- [**cargo-xwin**](https://github.com/rust-cross/cargo-xwin): Cross-compile Rust to Windows MSVC targets from macOS/Linux. It downloads the Windows SDK and CRT headers automatically and uses `clang-cl` as the linker.
- [**qwin**](https://github.com/pi0/qwin): A zero-touch Windows Server Core VM setup using QEMU. Unattended install, SSH access, qcow2 snapshots for instant revert.

The workflow: cross-compile on macOS, boot a Windows VM via QEMU, transfer binaries, run tests over SSH.

## Setting Up Cross-Compilation

### Prerequisites

```bash
brew install llvm
cargo install cargo-xwin
rustup target add x86_64-pc-windows-msvc
```

`cargo-xwin` auto-downloads the Windows SDK (~500 MB) on first use and caches it in `~/.cache/cargo-xwin/`.

### The First Build

```bash
export PATH="$(brew --prefix llvm)/bin:$PATH"

# CLI binary
cargo xwin build --release --target x86_64-pc-windows-msvc -p vite_global_cli

# Windows console trampoline
cargo xwin build --release --target x86_64-pc-windows-msvc -p vite_trampoline

# NAPI binding (set CARGO env so @napi-rs/cli uses cargo-xwin internally)
CARGO=cargo-xwin pnpm --filter=vite-plus build-native --target x86_64-pc-windows-msvc
```

All three produce valid PE32+ Windows x86-64 binaries. The `file` command confirms:

```
vp.exe:                          PE32+ executable (console) x86-64, for MS Windows
vp-shim.exe:                     PE32+ executable (console) x86-64, for MS Windows
vite-plus.win32-x64-msvc.node:   PE32+ executable (DLL) (GUI) x86-64, for MS Windows
```

Build time: ~40 seconds each on Apple Silicon. Subsequent incremental builds are faster.

### Blocker: native-tls-vendored

The Windows builds originally used `native-tls-vendored` for the `reqwest` HTTP client, which compiles OpenSSL from C source. This is problematic for cross-compilation -- it needs a Windows-compatible C compiler for OpenSSL.

The fix was simple: switch to `rustls` (pure Rust TLS) on all platforms. I changed three `Cargo.toml` files:

```toml
# Before (platform-specific)
[target.'cfg(target_os = "windows")'.dependencies]
reqwest = { workspace = true, features = ["stream", "native-tls-vendored"] }

[target.'cfg(not(target_os = "windows"))'.dependencies]
reqwest = { workspace = true, features = ["stream", "rustls-no-provider"] }

# After (unified)
[dependencies.reqwest]
workspace = true
features = ["stream", "rustls-no-provider"]
```

### Blocker: LLVM Not in PATH

`cargo-xwin` sets `AR_x86_64_pc_windows_msvc=llvm-lib`, but on macOS, Homebrew's LLVM is keg-only (not in PATH by default). The fix:

```bash
export PATH="$(brew --prefix llvm)/bin:$PATH"
```

Without this, the build fails with `failed to find tool "llvm-lib"`.

## Setting Up the Windows VM

### Building qwin

```bash
git submodule add https://github.com/pi0/qwin.git tools/qwin
cd tools/qwin
cp .env.example .env  # set WIN_ISO_URL
./build.sh --host
```

The first build downloads a Windows Server evaluation ISO (~5 GB) and runs an unattended install. On macOS without KVM (using QEMU's TCG software emulation), this takes 60+ minutes. But it's a one-time cost -- the resulting qcow2 disk image is persistent.

### Installing Development Tools

qwin's default setup includes OpenSSH, but I need more for running Node.js projects. Rather than waiting for the slow Chocolatey install inside the VM, I download installers on the fast macOS host and SCP them in:

```bash
# Node.js -- download MSI on macOS (1 second), SCP to VM, install silently
curl -fSL -o /tmp/node-setup.msi "https://nodejs.org/dist/v22.18.0/node-v22.18.0-x64.msi"
scp -P 2222 /tmp/node-setup.msi administrator@localhost:
ssh -p 2222 administrator@localhost 'cmd /c "msiexec /i node-setup.msi /qn /norestart"'

# Git -- use MinGit (portable, just extract)
curl -fSL -o /tmp/MinGit.zip "https://github.com/git-for-windows/git/releases/.../MinGit-2.50.1-64-bit.zip"
scp -P 2222 /tmp/MinGit.zip administrator@localhost:
ssh -p 2222 administrator@localhost 'cmd /c "tar xf MinGit.zip -C C:\Git"'

# VC++ Redistributable -- required for MSVC-compiled Rust binaries
curl -fSL -o /tmp/vc_redist.x64.exe "https://aka.ms/vs/17/release/vc_redist.x64.exe"
scp -P 2222 /tmp/vc_redist.x64.exe administrator@localhost:
ssh -p 2222 administrator@localhost 'cmd /c "vc_redist.x64.exe /install /quiet /norestart"'

# Enable long paths (required for node_modules deep nesting)
ssh -p 2222 administrator@localhost 'cmd /c "reg add HKLM\SYSTEM\CurrentControlSet\Control\FileSystem /v LongPathsEnabled /t REG_DWORD /d 1 /f"'
```

This "download on host, SCP, install" pattern is much faster than downloading inside the VM (which runs at TCG speed).

## Lesson Learned: Don't Transfer node_modules

My first attempt was to tar the project (including `node_modules`) on macOS and extract it on Windows. This failed in multiple ways:

**Problem 1: pnpm symlinks don't work cross-platform.** pnpm's node_modules layout relies heavily on symlinks. macOS symlinks don't translate to Windows junctions in a tar archive.

**Problem 2: Dereferencing inflates the archive.** Using `tar -h` (follow symlinks) turns 790 MB of deduplicated pnpm store into 1.4 GB of duplicated files.

**Problem 3: `--exclude` gotcha.** `--exclude='tools'` was meant to exclude `tools/qwin` (the QEMU VM) but also excluded `packages/tools/` (the snap test runner). Must use `--exclude='tools/qwin'` instead.

**The solution: clone the repo on the VM.**

```bash
# Push branch from macOS
git push origin my-branch

# Clone on the VM
ssh -p 2222 administrator@localhost
git clone --depth 1 --branch my-branch https://github.com/org/repo.git
cd repo && git submodule update --init --depth 1

# Clone upstream dependencies at pinned hashes
git clone --depth 1 https://github.com/rolldown/rolldown.git rolldown
cd rolldown && git fetch --depth 1 origin <hash> && git checkout <hash> && cd ..

# pnpm install works perfectly with the full workspace intact
pnpm install --frozen-lockfile
```

Then SCP only the cross-compiled binaries (~23 MB) and TypeScript dist (~9 MB) -- two orders of magnitude smaller than transferring node_modules.

## Running Snap Tests

Snap tests capture CLI output and compare against expected snapshots:

```bash
# On the VM
pnpm snap-test-local command-helper

# Output:
# Running 1 test cases (0 serial + 1 parallel, concurrency limit 4)
# command-helper started
# command-helper finished in 1484ms
```

To check for differences:

```bash
git diff --stat -- 'packages/cli/snap-tests*/*/snap.txt'
```

I scripted the full workflow:

```bash
./scripts/qwin-snap-test.sh --local command-helper
```

This does: sync branch to VM, SCP binaries, run snap test, show diff. One command.

## Running Ecosystem-CI

Ecosystem-ci tests real-world projects. It clones an open source project, migrates it to Vite+, installs dependencies, and runs the project's build/test commands.

```bash
./scripts/qwin-ecosystem-ci.sh tanstack-start-helloworld
```

This does everything:

1. Cross-compiles Windows binaries on macOS
2. Creates tgz packages (`pnpm pack`)
3. Downloads the rolldown Windows native binding from npm
4. Transfers everything to the VM
5. Installs `vp` CLI on the VM
6. Clones the ecosystem project
7. Runs `vp migrate` to patch the project for local Vite+
8. Runs the project's test commands (`vp run test`, `vp run build`)

The `tanstack-start-helloworld` project passes all commands on Windows:

```
vp run test   ->  8 tests passed (chromium, 19.82s)
vp run build  ->  built in 17.21s
```

## The Batch Script Trick

Running individual SSH commands for each project command loses output due to SSH buffering. The fix: write all commands to a `.bat` file, SCP it to the VM, execute it in a single SSH session:

```bash
# Generate .bat file from e2e-test.yml commands
{
  echo '@echo off'
  echo 'set PATH=%USERPROFILE%\.vite-plus\bin;C:\Git\cmd;%PATH%'
  echo 'cd /d %TEMP%\vite-plus-ecosystem-ci\project-name'
  echo 'echo :: Running: vp run test'
  echo 'vp run test'
  echo 'echo :: Running: vp run build'
  echo 'vp run build'
} > /tmp/run-commands.bat

scp -P 2222 /tmp/run-commands.bat administrator@localhost:
ssh -p 2222 administrator@localhost 'cmd /c "run-commands.bat & del run-commands.bat"'
```

This gives full, real-time output for every command.

## Performance

| Operation                      | Time                    |
| ------------------------------ | ----------------------- |
| First-time VM build            | ~60 min (one-time, TCG) |
| VM boot from snapshot          | 2-5 min                 |
| Cross-compilation (3 targets)  | ~2 min                  |
| Transfer (SCP binaries + dist) | ~30 sec                 |
| Single snap test               | 1-9 sec                 |
| Ecosystem-ci (tanstack-start)  | ~2 min                  |

The VM is ~3-5x slower than native Windows due to TCG software emulation (macOS doesn't support KVM). But for debugging and verifying fixes, it's vastly faster than pushing to CI and waiting.

## VM Persistence

The qcow2 overlay disk preserves all state across macOS restarts. After rebooting:

```bash
cd tools/qwin && ./run.sh --host  # boots in 2-5 min, everything intact
```

For a clean slate: `./run.sh --host --reset` reverts to the post-install state instantly.

## What CC Built

Two scripts for one-command workflows:

```bash
# Snap tests: cross-compile + transfer + run + show diff
./scripts/qwin-snap-test.sh --local cli-helper-message

# Ecosystem-ci: full E2E test of real-world projects on Windows
./scripts/qwin-ecosystem-ci.sh tanstack-start-helloworld

# List available ecosystem projects
./scripts/qwin-ecosystem-ci.sh --list
```

Two skills (Claude Code prompts) documenting the setup and workflow:

- `/qwin-snap-test` -- snap test reference
- `/qwin-ecosystem-ci` -- ecosystem-ci reference

## Takeaways

1. **cargo-xwin makes Rust cross-compilation to Windows surprisingly easy.** The main hurdle is ensuring all C dependencies are either pure Rust or compatible with clang-cl. Switching from `native-tls` to `rustls` was the key change.

2. **QEMU on macOS works, but TCG is slow.** If you're on Linux with KVM, the VM boots in 30 seconds and runs at near-native speed. On macOS, budget 2-5 minutes for boot and 3-5x slowdown for execution.

3. **Don't transfer node_modules across platforms.** pnpm's symlink-based layout is not portable. Clone the repo and `pnpm install` on the target instead.

4. **Download on host, SCP to VM.** The VM's network through QEMU TCG is slow. Downloading large files on the fast macOS host and SCP-ing them in is 10-100x faster.

5. **Batch scripts solve SSH output issues.** Running commands via individual SSH calls can lose output. Writing a `.bat` file and executing it in a single session gives reliable, complete output.

6. **One-time setup cost, ongoing time savings.** The ~60 minute VM build is a one-time investment. After that, the full cross-compile + test cycle takes about 5 minutes -- compared to 15+ minutes waiting for CI.
