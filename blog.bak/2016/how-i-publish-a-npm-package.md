# 我是如何发布一个 npm 包的

- 先安装 [git-extras](https://github.com/tj/git-extras)
- 接着在 git 代码库中添加一个本地 hook: `.git/hooks/post-release.sh`
    - 如果是 发布 tnpm 包（内部私有包），只需要添加一行

        ```bash
        tnpm publish
        ```

    - 如果是发布 npm 包（外部公开包），需要添加一个 publish 和 tnpm sync

        ```bash
        npm publish
        tnpm sync
        # 如果你访问不来内网，可以改成
        # cnpm sync
        ```

- 最后通过2个 `git-extras` 命令生成 changelog 和 release 自动打 tag & push & trigger hook

    ```bash
    $ git changelog
    # 需要修改 Histroy.md 和 package.json 的版本号，如需要发布 1.0.0
    $ git release 1.0.0
    ```
