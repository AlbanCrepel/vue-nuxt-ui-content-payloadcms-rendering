<script setup lang="ts">
import payloadApiResult from '../data/example.json'
</script>

<template>
  <div>
    <PayloadRichText :content="payloadApiResult.content" />
  </div>
</template>
