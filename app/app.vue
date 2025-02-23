<script setup lang="ts">
import payloadApiResult from '../data/example.json'
</script>

<template>
  <article class="prose">
    <PayloadRichText :content="payloadApiResult.content"/>
  </article>
</template>
