<script setup>
import CkmhConnectionsV5 from '../components/ckmh-connections-v5.vue'
import { ckmhData } from '../data/ckmh-connections.js'
</script>

<template>
  <main>
    <CkmhConnectionsV5 :ckmh-data="ckmhData" />
  </main>
</template>
