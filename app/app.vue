<script lang="ts" setup>
import payloadApiResult from '../data/example.json'
</script>

<template>
  <div class="max-w-xl mx-auto">
    <div class="pt-6 bg-white px-4">
      <article class="prose" style="padding-bottom: 800px;">
        <PayloadRichText :content="payloadApiResult.content"/>
      </article>
    </div>
  </div>
</template>

<style>
body {
  @apply bg-gray-200;
}
</style>