<script setup lang="ts">
import { useShared } from "void/vue";
</script>

<template>
  <link rel="stylesheet" href="https://registry.npmmirror.com/typo.css/1/files/typo.css">
  <link rel="stylesheet" href="https://registry.npmmirror.com/bootstrap/3/files/dist/css/bootstrap.min.css">
  <link rel="stylesheet" href="https://registry.npmmirror.com/bootstrap/3/files/dist/css/bootstrap-theme.min.css">
  <link rel="stylesheet" href="/css/mk2.css">

  <div id="wrapper" class="container typo">
    <div id="header"></div>

    <div id="content">
      <slot />
    </div>

    <div id="footer"></div>
  </div>

  <div id="fork" class="void-ribbon">
    <span><a href="https://void.cloud">Deploy on Void</a></span>
  </div>

  <component is="style">
    .void-ribbon {
      position: fixed;
      top: 0;
      right: 0;
      z-index: 1000;
      overflow: hidden;
      width: 150px;
      height: 150px;
      text-decoration: none;
    }
    .void-ribbon span {
      display: block;
      position: absolute;
      right: -35px;
      top: 30px;
      width: 210px;
      padding: 8px 0;
      background: #000;
      color: #fff;
      font-size: 13px;
      font-weight: 600;
      text-align: center;
      text-decoration: none;
      letter-spacing: 0.5px;
      transform: rotate(45deg);
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    }
    .void-ribbon:hover span {
      background: #333;
    }
  </component>
</template>
