<script setup>
import CkmhConnectionsV3 from '../components/ckmh-connections-v3.vue'
import { ckmhData } from '../data/ckmh-connections.js'
</script>

<template>
  <main>
    <CkmhConnectionsV3 :ckmh-data="ckmhData" />
  </main>
</template>
