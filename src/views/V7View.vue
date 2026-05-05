<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CkmhConnectionsV7 from '../components/ckmh-connections-v7.vue'
import { ckmhData } from '../data/ckmh-connections.js'

gsap.registerPlugin(ScrollTrigger)

let lenis = null
const tickerFn = (time) => {
  lenis?.raf(time * 1000)
}

onMounted(() => {
  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches
  if (reducedMotion) return // native scroll for reduced-motion users

  lenis = new Lenis({
    duration: 1.1,
    smoothWheel: true,
  })

  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add(tickerFn)
})

onBeforeUnmount(() => {
  ScrollTrigger.getAll().forEach((st) => st.kill())
  if (lenis) {
    gsap.ticker.remove(tickerFn)
    lenis.destroy()
    lenis = null
  }
})
</script>

<template>
  <main>
    <CkmhConnectionsV7 :ckmh-data="ckmhData" />
  </main>
</template>
