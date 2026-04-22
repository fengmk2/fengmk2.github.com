<script setup lang="ts">
import type { Props } from "./[...slug].server";
defineProps<Props>();
</script>

<template>
  <h1>404 Not Found</h1>
  <p>
    The page <code>{{ path }}</code> does not exist.
  </p>
  <p><a href="/">Back to home</a></p>
</template>
