<script setup>
import CkmhConnectionsV4 from '../components/ckmh-connections-v4.vue'
import { ckmhData } from '../data/ckmh-connections.js'
</script>

<template>
  <main>
    <CkmhConnectionsV4 :ckmh-data="ckmhData" />
  </main>
</template>
