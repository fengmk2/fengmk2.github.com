import { defineConfig } from "vite";
import { voidPlugin } from "void";
import { voidVue } from "@void-x/vue";
import { voidMarkdown } from "@void-x/md";

export default defineConfig({
  plugins: [voidPlugin(), voidVue(), voidMarkdown()],
});
