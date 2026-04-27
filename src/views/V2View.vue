<script setup>
import CkmhConnectionsV2 from '../components/ckmh-connections-v2.vue'
import { ckmhData } from '../data/ckmh-connections.js'
</script>

<template>
  <main>
    <CkmhConnectionsV2 :ckmh-data="ckmhData" />
  </main>
</template>
