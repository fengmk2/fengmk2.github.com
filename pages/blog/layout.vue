<template>
  <div id="header">
    <h3><a href="/">Home</a></h3>
  </div>

  <slot />

  <h2>Comments</h2>
  <div id="disqus_thread"></div>
  <noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript>

  <component is="script" src="https://fengmk2github.disqus.com/embed.js"></component>
  <component is="script" id="dsq-count-scr" src="//fengmk2github.disqus.com/count.js" async></component>
</template>
