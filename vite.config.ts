import { defineConfig } from "vite";
import { voidPlugin } from "void";
import { voidVue } from "@void/vue/plugin";
import { voidMarkdown } from "@void/md/plugin";

export default defineConfig({
  plugins: [voidPlugin(), voidVue(), voidMarkdown()],
});
