<script setup lang="ts">
import { useShared } from "void/vue";
</script>

<template>
  <div id="wrapper" class="container typo">
    <div id="header"></div>

    <div id="content">
      <slot />
    </div>

    <div id="footer"></div>
  </div>

  <a href="https://github.com/fengmk2/" id="fork">
    <img alt="Fork me on GitHub" src="/images/forkme_right_green.png">
  </a>
</template>

<style>
@import "https://registry.npmmirror.com/typo.css/1/files/typo.css";
@import "https://registry.npmmirror.com/bootstrap/3/files/dist/css/bootstrap.min.css";
@import "https://registry.npmmirror.com/bootstrap/3/files/dist/css/bootstrap-theme.min.css";
@import "/css/mk2.css";
</style>
