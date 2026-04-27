<script setup>
import CkmhConnections from '../components/ckmh-connections.vue'
import { ckmhData } from '../data/ckmh-connections.js'
</script>

<template>
  <main>
    <CkmhConnections :ckmh-data="ckmhData" />
  </main>
</template>
