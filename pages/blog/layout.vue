<script setup lang="ts">
import { onMounted } from "vue";

onMounted(() => {
  // Load Disqus comments
  const d = document;
  const s = d.createElement("script");
  s.src = "https://fengmk2github.disqus.com/embed.js";
  s.setAttribute("data-timestamp", String(+new Date()));
  (d.head || d.body).appendChild(s);

  const countScript = d.createElement("script");
  countScript.id = "dsq-count-scr";
  countScript.src = "//fengmk2github.disqus.com/count.js";
  countScript.async = true;
  (d.head || d.body).appendChild(countScript);
});
</script>

<template>
  <div id="header">
    <h3><a href="/">Home</a></h3>
  </div>

  <slot />

  <h2>Comments</h2>
  <div id="disqus_thread"></div>
  <noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript>
</template>
