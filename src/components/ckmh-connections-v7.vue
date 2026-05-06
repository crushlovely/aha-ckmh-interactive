<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { gsap } from 'gsap'
import {
  PERSONAS,
  PERSONA_ORDER,
  v7Content,
  readPersonaCookie,
  writePersonaCookie,
} from '../data/ckmh-v7-content.js'

defineProps({
  ckmhData: { type: Object, required: false, default: null },
})

const content = v7Content

// ── Persona state ──
const persona = ref(null)
const personaIsSet = computed(() => persona.value !== null)

function selectPersona(id) {
  if (!PERSONA_ORDER.includes(id)) return
  persona.value = id
  writePersonaCookie(id)
}

function openPersonaSwitcher() {
  persona.value = null
}

const welcomeForPersona = computed(
  () => content.oneBody.welcome[persona.value] || content.oneBody.welcome.curious,
)

const ctaForPersona = computed(
  () => content.cta.byPersona[persona.value] || content.cta.byPersona.curious,
)

// ── Scene 9: Take Action ──
const expandedHabit = ref(null)
function toggleHabit(id) {
  expandedHabit.value = expandedHabit.value === id ? null : id
}

// ── Scene 4: stat guess ──
const guessed = ref(null)
const guessIsCorrect = computed(
  () => guessed.value && guessed.value === content.guess.answer,
)

function selectGuess(option) {
  if (guessed.value) return
  guessed.value = option
}

// ── Scene 3: tap-to-explore teammates ──
const openTeammate = ref(null)
const exploredTeammates = ref(new Set())
const hasExplored = computed(() => exploredTeammates.value.size > 0)

function toggleTeammate(id) {
  if (openTeammate.value === id) {
    openTeammate.value = null
  } else {
    openTeammate.value = id
    exploredTeammates.value = new Set([...exploredTeammates.value, id])
    // Brighten the corresponding circle in the Venn
    brightenRegion(id)
  }
}

// ── Persistent Venn refs ──
const vennEl = ref(null)
const heartFill = ref(null)
const kidneyFill = ref(null)
const metabolicFill = ref(null)
const heartG = ref(null)
const kidneyG = ref(null)
const metabolicG = ref(null)
const threadHK = ref(null)
const threadHM = ref(null)
const threadKM = ref(null)
const heartLabel = ref(null)
const kidneyLabel = ref(null)
const metabolicLabel = ref(null)

// Connection scene refs
const guessScene = ref(null)
const vennIntroScene = ref(null)
const hkScene = ref(null)
const hmScene = ref(null)
const kmScene = ref(null)
const shiftScene = ref(null)
const shiftMessageWarn = ref(null)
const shiftMessageHope = ref(null)
const takeActionScene = ref(null)
const ctaScene = ref(null)

const FILL_BRIGHT = 0.55
const FILL_DIM = 0.18
const FILL_FAINT = 0.1

// ── Scene progress dots (visual flair / wayfinding) ────
// Order of beats the reader walks through. Drives the persistent
// dot indicator at the bottom of the viewport.
const SCENE_ORDER = [
  'oneBody', 'teammates', 'guess', 'vennIntro',
  'hk', 'hm', 'km', 'shift', 'takeAction', 'cta',
]
const sceneIndex = computed(() => {
  const idx = SCENE_ORDER.indexOf(activeSceneKey.value)
  return idx === -1 ? 0 : idx
})


// ── Scene refs (for ScrollTrigger) ──
const oneBodyScene = ref(null)
const teammatesScene = ref(null)
const stubScene = ref(null)

// ── Per-scene Venn states ──
// scale: overall Venn size; x/y: viewport-relative position offsets
// fills: { heart, kidney, metabolic } opacities; threads: { hk, hm, km } opacities
const THREAD_FOCUS = 0.85
const THREAD_BG = 0.4

// Venn lives in the top stage zone (top 55vh of viewport, fixed). All
// transforms here are relative to the pane's natural center — y/x offsets
// only used for the takeAction "corner badge" state. Hero scales are
// tuned to fit within the pane.
const VENN_STATES = {
  oneBody: {
    // Hero-scale preview of the diagram-to-come, breathing with life.
    // Full size makes it feel like the centerpiece while the breath
    // animation provides the storytelling motion.
    scale: 1.1, x: 0, y: 0,
    fills: { heart: FILL_DIM, kidney: FILL_DIM, metabolic: FILL_DIM },
    threads: { hk: 0.3, hm: 0.3, km: 0.3 },
    labels: { heart: 0, kidney: 0, metabolic: 0 },
  },
  teammates: {
    // Diagram is the interactive surface — the user taps a teammate name and
    // its circle (and label) lights up. Big enough to be the focal element of
    // the right pane. Default fills DIM so any region can stand out on tap.
    scale: 0.9, x: 0, y: 0,
    fills: { heart: FILL_DIM, kidney: FILL_DIM, metabolic: FILL_DIM },
    threads: { hk: 0, hm: 0, km: 0 },
    labels: { heart: 0, kidney: 0, metabolic: 0 },
  },
  guess: {
    // Venn ducks out entirely — the question and the stat reveal own the
    // stage. Fills, threads, and labels all fade to 0; the diagram returns
    // for the introduction beat after the reveal.
    scale: 0.6, x: 0, y: 0,
    fills: { heart: 0, kidney: 0, metabolic: 0 },
    threads: { hk: 0, hm: 0, km: 0 },
    labels: { heart: 0, kidney: 0, metabolic: 0 },
  },
  vennIntro: {
    // Hero moment — fills the upper stage, all threads bright, all labels on
    scale: 1.0, x: 0, y: 0,
    fills: { heart: FILL_BRIGHT, kidney: FILL_BRIGHT, metabolic: FILL_BRIGHT },
    threads: { hk: THREAD_FOCUS, hm: THREAD_FOCUS, km: THREAD_FOCUS },
    labels: { heart: 1, kidney: 1, metabolic: 1 },
  },
  hk: {
    scale: 0.88, x: 0, y: 0,
    fills: { heart: FILL_BRIGHT, kidney: FILL_BRIGHT, metabolic: FILL_DIM },
    threads: { hk: THREAD_FOCUS, hm: 0, km: 0 },
    labels: { heart: 1, kidney: 1, metabolic: 0 },
  },
  hm: {
    scale: 0.88, x: 0, y: 0,
    fills: { heart: FILL_BRIGHT, kidney: FILL_DIM, metabolic: FILL_BRIGHT },
    threads: { hk: THREAD_BG, hm: THREAD_FOCUS, km: 0 },
    labels: { heart: 1, kidney: 0, metabolic: 1 },
  },
  km: {
    scale: 0.88, x: 0, y: 0,
    fills: { heart: FILL_DIM, kidney: FILL_BRIGHT, metabolic: FILL_BRIGHT },
    threads: { hk: THREAD_BG, hm: THREAD_BG, km: THREAD_FOCUS },
    labels: { heart: 0, kidney: 1, metabolic: 1 },
  },
  shift: {
    // Full Venn presence — sub-timeline runs the dim/recover separately
    scale: 0.85, x: 0, y: 0,
    fills: { heart: FILL_BRIGHT, kidney: FILL_BRIGHT, metabolic: FILL_BRIGHT },
    threads: { hk: THREAD_FOCUS, hm: THREAD_FOCUS, km: THREAD_FOCUS },
    labels: { heart: 0, kidney: 0, metabolic: 0 },
  },
  takeAction: {
    // Venn ducks out — the eight habits are the entire focus of this beat.
    // Returns at full strength on the closing CTA scene.
    scale: 0.5, x: 0, y: 0,
    fills: { heart: 0, kidney: 0, metabolic: 0 },
    threads: { hk: 0, hm: 0, km: 0 },
    labels: { heart: 0, kidney: 0, metabolic: 0 },
  },
  cta: {
    // Earned closing — the Venn returns to full hero presence with all
    // three regions saturated, threads bright, and labels on. The whole
    // diagram is the "you've made the connection" payoff for the reader.
    scale: 1.0, x: 0, y: 0,
    fills: { heart: FILL_BRIGHT, kidney: FILL_BRIGHT, metabolic: FILL_BRIGHT },
    threads: { hk: THREAD_FOCUS, hm: THREAD_FOCUS, km: THREAD_FOCUS },
    labels: { heart: 1, kidney: 1, metabolic: 1 },
  },
  stub: {
    scale: 0.45, x: 0, y: 0,
    fills: { heart: FILL_DIM, kidney: FILL_DIM, metabolic: FILL_DIM },
    threads: { hk: 0, hm: 0, km: 0 },
    labels: { heart: 0, kidney: 0, metabolic: 0 },
  },
}

function applyVennState(stateKey, animate = true) {
  const s = VENN_STATES[stateKey]
  if (!s || !vennEl.value) return
  const dur = animate ? 0.9 : 0
  const ease = 'power2.inOut'
  gsap.to(vennEl.value, {
    scale: s.scale,
    x: s.x,
    y: s.y,
    duration: dur,
    ease,
  })
  // Scene-driven fills always win on scene change. (The teammates scene's
  // per-tap brightenRegion still works within that scene because it doesn't
  // trigger a scene change — applyVennState only fires when activeSceneKey
  // changes, not on every tap.)
  gsap.to(heartFill.value, { fillOpacity: s.fills.heart, duration: dur, ease })
  gsap.to(kidneyFill.value, { fillOpacity: s.fills.kidney, duration: dur, ease })
  gsap.to(metabolicFill.value, { fillOpacity: s.fills.metabolic, duration: dur, ease })
  gsap.to(threadHK.value, { opacity: s.threads.hk, duration: dur, ease })
  gsap.to(threadHM.value, { opacity: s.threads.hm, duration: dur, ease })
  gsap.to(threadKM.value, { opacity: s.threads.km, duration: dur, ease })
  // Region labels — only visible during the Venn intro and the three connection
  // beats (and only the labels for the regions being discussed in each beat)
  gsap.to(heartLabel.value, { opacity: s.labels.heart, duration: dur, ease })
  gsap.to(kidneyLabel.value, { opacity: s.labels.kidney, duration: dur, ease })
  gsap.to(metabolicLabel.value, { opacity: s.labels.metabolic, duration: dur, ease })
}


function brightenRegion(regionId) {
  const fillRefs = {
    heart: heartFill.value,
    kidney: kidneyFill.value,
    metabolic: metabolicFill.value,
  }
  const labelRefs = {
    heart: heartLabel.value,
    kidney: kidneyLabel.value,
    metabolic: metabolicLabel.value,
  }
  const others = Object.keys(fillRefs).filter((k) => k !== regionId)

  const target = fillRefs[regionId]
  if (!target) return
  gsap.to(target, { fillOpacity: FILL_BRIGHT, duration: 0.6, ease: 'power2.out' })
  gsap.to(labelRefs[regionId], { opacity: 1, duration: 0.6, ease: 'power2.out' })
  others.forEach((k) => {
    gsap.to(fillRefs[k], { fillOpacity: FILL_DIM, duration: 0.6, ease: 'power2.out' })
    gsap.to(labelRefs[k], { opacity: 0, duration: 0.6, ease: 'power2.out' })
  })
}

function resetRegions() {
  ;[heartFill.value, kidneyFill.value, metabolicFill.value].forEach((el) => {
    if (el) gsap.to(el, { fillOpacity: FILL_DIM, duration: 0.6, ease: 'power2.out' })
  })
  ;[heartLabel.value, kidneyLabel.value, metabolicLabel.value].forEach((el) => {
    if (el) gsap.to(el, { opacity: 0, duration: 0.6, ease: 'power2.out' })
  })
}

// When a teammate is closed (no openTeammate), reset to faint baseline
watch(openTeammate, (newVal) => {
  if (newVal === null) resetRegions()
})

// ── oneBody breathing animation ─────────────────
// A 3-phase looping timeline for the opening Venn:
//   1. Each circle cycles independently, in offset stagger.
//   2. All three saturate together to a stronger peak.
//   3. All three desaturate back down together.
//   ↻ Loop.
// Total cycle ≈ 11s. Stops when the scene changes; per-scene fills
// are restored by the next applyVennState call.
let breathTimeline = null
const BREATH_PEAK_INDIVIDUAL = 0.5
const BREATH_PEAK_ALL = 0.65 // higher peak when all three saturate together
const BREATH_INDIVIDUAL_DUR = 1.6 // half-cycle of each individual swell
const BREATH_INDIVIDUAL_STAGGER = 1.1 // delay between each circle's start
const BREATH_SYNTH_DUR = 2.2 // duration of the all-rise / all-dim phases

function startOneBodyBreath() {
  stopOneBodyBreath()
  if (!heartFill.value) return

  const fills = [heartFill.value, kidneyFill.value, metabolicFill.value]
  const tl = gsap.timeline({ repeat: -1 })

  // Phase 1: each circle does one full swell (dim → peak → dim), staggered.
  fills.forEach((el, j) => {
    tl.fromTo(
      el,
      { fillOpacity: FILL_DIM },
      {
        fillOpacity: BREATH_PEAK_INDIVIDUAL,
        duration: BREATH_INDIVIDUAL_DUR,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: 1, // up + down = one full swell
      },
      j * BREATH_INDIVIDUAL_STAGGER,
    )
  })

  // Phase 2: all three rise together to a stronger collective peak.
  // Anchored to start after the last individual swell finishes.
  const phase2Start = (fills.length - 1) * BREATH_INDIVIDUAL_STAGGER + BREATH_INDIVIDUAL_DUR * 2
  tl.to(
    fills,
    {
      fillOpacity: BREATH_PEAK_ALL,
      duration: BREATH_SYNTH_DUR,
      ease: 'sine.inOut',
    },
    phase2Start + 0.4, // small held-breath pause before the collective rise
  )

  // Phase 3: all three desaturate together back to dim.
  tl.to(fills, {
    fillOpacity: FILL_DIM,
    duration: BREATH_SYNTH_DUR,
    ease: 'sine.inOut',
  })

  breathTimeline = tl
}

function stopOneBodyBreath() {
  if (breathTimeline) {
    breathTimeline.kill()
    breathTimeline = null
  }
}

// ── Shift scene: dim/recover sub-timeline ──
const shiftPlayed = ref(false)

function playShift() {
  if (shiftPlayed.value) return
  shiftPlayed.value = true

  const fills = [heartFill.value, kidneyFill.value, metabolicFill.value]
  const threads = [threadHK.value, threadHM.value, threadKM.value]
  if (!vennEl.value || !fills[0]) return

  const tl = gsap.timeline()
  // Phase A: dim — fade fills + threads, but DO NOT desaturate (keeps the
  // AHA red/blue/gold recognizable; just less present)
  tl.to(fills, { fillOpacity: FILL_FAINT, duration: 1.8, ease: 'power2.in' }, 0)
    .to(threads, { opacity: 0.18, duration: 1.8, ease: 'power2.in' }, 0)
    .to(
      shiftMessageWarn.value,
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      0.4,
    )
    // Pause
    .to({}, { duration: 0.5 })
    // Phase B: recover
    .to(
      shiftMessageWarn.value,
      { opacity: 0, y: -8, duration: 0.4, ease: 'power2.in' },
      '>',
    )
    .to(fills, { fillOpacity: FILL_BRIGHT, duration: 1.6, ease: 'power3.out' }, '>')
    .to(threads, { opacity: THREAD_FOCUS, duration: 1.6, ease: 'power3.out' }, '<')
    .to(
      shiftMessageHope.value,
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      '<+0.3',
    )
}

// Simple scroll-position-to-scene-key mapping. Each scene is 100vh tall.
// Scroll handler reads window.scrollY, divides by viewport height, maps to scene key.
const activeSceneKey = ref(null)
let scrollHandler = null

function getCurrentSceneKey() {
  const scenes = [
    { el: oneBodyScene.value, key: 'oneBody' },
    { el: teammatesScene.value, key: 'teammates' },
    { el: guessScene.value, key: 'guess' },
    { el: vennIntroScene.value, key: 'vennIntro' },
    { el: hkScene.value, key: 'hk' },
    { el: hmScene.value, key: 'hm' },
    { el: kmScene.value, key: 'km' },
    { el: shiftScene.value, key: 'shift' },
    { el: takeActionScene.value, key: 'takeAction' },
    { el: ctaScene.value, key: 'cta' },
    { el: stubScene.value, key: 'stub' },
  ]
  // Find which scene's center is closest to viewport center
  const viewportCenter = window.scrollY + window.innerHeight / 2
  let best = null
  let bestDist = Infinity
  scenes.forEach((s) => {
    if (!s.el) return
    const top = s.el.offsetTop
    const center = top + s.el.offsetHeight / 2
    const dist = Math.abs(center - viewportCenter)
    if (dist < bestDist) {
      bestDist = dist
      best = s.key
    }
  })
  return best || 'oneBody'
}

function onScroll() {
  const key = getCurrentSceneKey()
  if (key !== activeSceneKey.value) {
    const prevKey = activeSceneKey.value
    activeSceneKey.value = key
    // Stop the breath BEFORE applying the new state so its tweens don't
    // race against applyVennState's fillOpacity tweens for the next scene.
    if (prevKey === 'oneBody' && key !== 'oneBody') stopOneBodyBreath()
    applyVennState(key)
    if (key === 'shift') playShift()
    if (key === 'oneBody') startOneBodyBreath()
  }
}

function setupSceneObserver() {
  if (!oneBodyScene.value) return

  // Initial Venn state
  activeSceneKey.value = getCurrentSceneKey()
  applyVennState(activeSceneKey.value, false)
  if (activeSceneKey.value === 'oneBody') startOneBodyBreath()
  else stopOneBodyBreath()

  // Attach scroll listener
  if (scrollHandler) window.removeEventListener('scroll', scrollHandler)
  scrollHandler = onScroll
  window.addEventListener('scroll', scrollHandler, { passive: true })
}

onMounted(() => {
  const saved = readPersonaCookie()
  if (saved) persona.value = saved

  // Initial Venn baseline (in case ScrollTriggers are not set up yet, e.g.,
  // user hasn't completed the persona selector)
  ;[heartFill.value, kidneyFill.value, metabolicFill.value].forEach((el) => {
    if (el) gsap.set(el, { fillOpacity: FILL_DIM })
  })
  ;[heartLabel.value, kidneyLabel.value, metabolicLabel.value].forEach((el) => {
    if (el) gsap.set(el, { opacity: 0 })
  })


  // Defer setup to nextTick + RAF so Vue has rendered and layout has settled
  nextTick(() => {
    requestAnimationFrame(() => setupSceneObserver())
  })
})

onBeforeUnmount(() => {
  if (scrollHandler) {
    window.removeEventListener('scroll', scrollHandler)
    scrollHandler = null
  }
  stopOneBodyBreath()
})

// Re-run setup when persona is set (the experience div becomes visible only then)
watch(personaIsSet, (isSet) => {
  if (isSet) {
    nextTick(() => {
      requestAnimationFrame(() => setupSceneObserver())
    })
  }
})
</script>

<template>
  <div class="v7" :data-persona="persona">
    <!-- ─── Scene 1: Audience selector overlay ─── -->
    <Transition name="v7-selector-fade">
      <div
        v-if="!personaIsSet"
        class="v7-selector"
        role="dialog"
        aria-labelledby="v7-selector-headline"
        aria-modal="true"
      >
        <div class="v7-selector__inner">
          <p class="v7-overline">{{ content.whoAreYou.overline }}</p>
          <h1 id="v7-selector-headline" class="v7-selector__headline">
            {{ content.whoAreYou.headline }}
          </h1>
          <p class="v7-selector__body">{{ content.whoAreYou.body }}</p>
          <ul class="v7-selector__options">
            <li v-for="(id, j) in PERSONA_ORDER" :key="id" :style="{ '--i': j }">
              <button
                type="button"
                class="v7-selector__option"
                @click="selectPersona(id)"
              >
                <span class="v7-selector__option-letter">
                  {{ String.fromCharCode(65 + j) }}
                </span>
                <span class="v7-selector__option-label">
                  {{ PERSONAS[id].label }}
                </span>
                <span class="v7-selector__option-arrow" aria-hidden="true">→</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </Transition>

    <!-- ─── Scrollytelling experience ─── -->
    <div v-show="personaIsSet" class="v7-experience">
      <!-- DEBUG: Persona switcher chip (will be removed before launch) -->
      <button
        v-if="personaIsSet"
        type="button"
        class="v7-persona-switch"
        @click="openPersonaSwitcher"
      >
        <span class="v7-persona-switch__short">
          {{ persona ? PERSONAS[persona].short : '' }}
        </span>
        <span class="v7-persona-switch__change">change</span>
      </button>

      <!-- Scene progress dots — wayfinding indicator at bottom of viewport.
           Echoes the AHA flyer's dotted-pattern motif. -->
      <nav class="v7-progress" aria-label="Progress through the experience">
        <ol class="v7-progress__list">
          <li
            v-for="(key, j) in SCENE_ORDER"
            :key="key"
            class="v7-progress__dot"
            :class="{
              'is-current': j === sceneIndex,
              'is-visited': j < sceneIndex,
            }"
          ></li>
        </ol>
      </nav>

      <!-- Color backdrop — soft multi-toned wash using all three brand
           colors at very low saturation. Fades in only on the opening
           scene to give it a distinct, warm atmosphere before the journey
           transitions to clean white for the rest of the experience. -->
      <div
        class="v7-bg-tint"
        :class="{ 'is-shown': activeSceneKey === 'oneBody' }"
        aria-hidden="true"
      ></div>

      <!-- Persistent Venn (fixed in viewport, behind scene content) -->
      <div ref="vennEl" class="v7-venn" aria-hidden="true">
        <svg
          viewBox="0 0 500 500"
          class="v7-venn__svg"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <radialGradient id="v7-wash-heart" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#c10e21" stop-opacity="0.85" />
              <stop offset="55%" stop-color="#c10e21" stop-opacity="0.55" />
              <stop offset="85%" stop-color="#c10e21" stop-opacity="0.2" />
              <stop offset="100%" stop-color="#c10e21" stop-opacity="0" />
            </radialGradient>
            <radialGradient id="v7-wash-kidney" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#0a5c8a" stop-opacity="0.85" />
              <stop offset="55%" stop-color="#0a5c8a" stop-opacity="0.55" />
              <stop offset="85%" stop-color="#0a5c8a" stop-opacity="0.2" />
              <stop offset="100%" stop-color="#0a5c8a" stop-opacity="0" />
            </radialGradient>
            <radialGradient id="v7-wash-metabolic" cx="50%" cy="50%" r="50%">
              <!-- Deeper amber and higher opacity stops than the default
                   so the gold reads as saturated as the heart and kidney. -->
              <stop offset="0%" stop-color="#c98014" stop-opacity="1" />
              <stop offset="55%" stop-color="#c98014" stop-opacity="0.7" />
              <stop offset="85%" stop-color="#c98014" stop-opacity="0.25" />
              <stop offset="100%" stop-color="#c98014" stop-opacity="0" />
            </radialGradient>
            <filter id="v7-bleed" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
              <feTurbulence
                type="fractalNoise"
                baseFrequency="1.4"
                numOctaves="2"
                seed="3"
                result="noise"
              />
              <feDisplacementMap
                in="blur"
                in2="noise"
                scale="6"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>

          <!-- Threads (drawn between circle centers; opacity managed per scene) -->
          <g class="v7-venn__threads">
            <line
              ref="threadHK"
              x1="200"
              y1="225"
              x2="300"
              y2="225"
              class="v7-venn__thread"
            />
            <line
              ref="threadHM"
              x1="200"
              y1="225"
              x2="250"
              y2="320"
              class="v7-venn__thread"
            />
            <line
              ref="threadKM"
              x1="300"
              y1="225"
              x2="250"
              y2="320"
              class="v7-venn__thread"
            />
          </g>

          <g ref="heartG">
            <circle
              ref="heartFill"
              cx="200"
              cy="225"
              r="120"
              fill="url(#v7-wash-heart)"
              filter="url(#v7-bleed)"
            />
          </g>
          <g ref="kidneyG">
            <circle
              ref="kidneyFill"
              cx="300"
              cy="225"
              r="120"
              fill="url(#v7-wash-kidney)"
              filter="url(#v7-bleed)"
            />
          </g>
          <g ref="metabolicG">
            <circle
              ref="metabolicFill"
              cx="250"
              cy="320"
              r="120"
              fill="url(#v7-wash-metabolic)"
              filter="url(#v7-bleed)"
            />
          </g>

          <!-- Region labels — sit outside each circle, color-matched.
               Visibility is scene-driven via gsap (see VENN_STATES.labels). -->
          <g class="v7-venn__labels">
            <text
              ref="heartLabel"
              x="125"
              y="78"
              text-anchor="middle"
              class="v7-venn__label v7-venn__label--heart"
            >
              Heart
            </text>
            <text
              ref="kidneyLabel"
              x="375"
              y="78"
              text-anchor="middle"
              class="v7-venn__label v7-venn__label--kidney"
            >
              Kidneys
            </text>
            <text
              ref="metabolicLabel"
              x="250"
              y="475"
              text-anchor="middle"
              class="v7-venn__label v7-venn__label--metabolic"
            >
              Metabolism
            </text>
          </g>
        </svg>
      </div>

      <!-- ─── Scene 2: One body. One system. ─── -->
      <section
        ref="oneBodyScene"
        class="v7-scene v7-scene--one-body"
        :class="{ 'is-active': activeSceneKey === 'oneBody' }"
      >
        <div class="v7-scene__inner">
          <p class="v7-overline">{{ content.oneBody.overline }}</p>
          <h2 class="v7-headline">{{ content.oneBody.headline }}</h2>
          <p class="v7-welcome">{{ welcomeForPersona }}</p>
          <p class="v7-body">{{ content.oneBody.body }}</p>
          <p class="v7-cue" aria-hidden="true">Continue ↓</p>
        </div>
      </section>

      <!-- ─── Scene 3: Three teammates (tap-to-explore) ─── -->
      <section
        ref="teammatesScene"
        class="v7-scene v7-scene--three-teammates"
        :class="{ 'is-active': activeSceneKey === 'teammates' }"
      >
        <div class="v7-scene__inner">
          <p class="v7-overline">{{ content.threeTeammates.overline }}</p>
          <h2 class="v7-headline">{{ content.threeTeammates.headline }}</h2>
          <p class="v7-body">{{ content.threeTeammates.body }}</p>

          <ul class="v7-teammates">
            <li
              v-for="t in content.threeTeammates.teammates"
              :key="t.id"
              class="v7-teammates__item"
              :data-region="t.region"
              :class="{ 'is-open': openTeammate === t.id }"
            >
              <button
                type="button"
                class="v7-teammates__button"
                :aria-expanded="openTeammate === t.id"
                @click="toggleTeammate(t.id)"
              >
                <span class="v7-teammates__dot" :data-region="t.region"></span>
                <span class="v7-teammates__name">{{ t.name }}</span>
                <span class="v7-teammates__chevron" aria-hidden="true">
                  {{ openTeammate === t.id ? '−' : '+' }}
                </span>
              </button>
              <Transition name="v7-teammates-expand">
                <p v-if="openTeammate === t.id" class="v7-teammates__what">
                  {{ t.what }}
                </p>
              </Transition>
            </li>
          </ul>

          <p class="v7-cue" :class="{ 'is-ready': hasExplored }" aria-hidden="true">
            <span v-if="hasExplored">{{ content.threeTeammates.continueCue }} ↓</span>
            <span v-else>Tap each to learn more</span>
          </p>
        </div>
      </section>

      <!-- ─── Scene 4: Stat guess + cascading reveal ─── -->
      <section
        ref="guessScene"
        class="v7-scene v7-scene--guess"
        :class="{
          'is-revealed': !!guessed,
          'is-active': activeSceneKey === 'guess',
        }"
      >
        <div class="v7-scene__inner v7-scene__inner--guess">
          <p class="v7-overline">{{ content.guess.overline }}</p>
          <p class="v7-guess__framing">
            {{ content.guess.framing[persona] || content.guess.framing.curious }}
          </p>

          <Transition name="v7-guess-swap" mode="out-in">
            <!-- Pre-guess: question + options -->
            <div v-if="!guessed" key="ask" class="v7-guess">
              <h2 class="v7-headline v7-headline--question">
                {{ content.guess.question }}
              </h2>
              <ul class="v7-guess__options">
                <li
                  v-for="(opt, j) in content.guess.options"
                  :key="opt"
                  :style="{ '--i': j }"
                >
                  <button
                    type="button"
                    class="v7-guess__option"
                    @click="selectGuess(opt)"
                  >
                    <span class="v7-guess__option-letter">
                      {{ String.fromCharCode(65 + j) }}
                    </span>
                    <span>{{ opt }}</span>
                  </button>
                </li>
              </ul>
              <p class="v7-cue v7-cue--guess">Take a guess</p>
            </div>

            <!-- Post-guess: reveal cascade -->
            <div v-else key="reveal" class="v7-guess v7-guess--reveal">
              <p class="v7-guess__verdict">
                <span v-if="guessIsCorrect">
                  {{ content.guess.correctVerdict }}
                </span>
                <span v-else>
                  {{ content.guess.incorrectVerdict }}
                </span>
              </p>
              <!-- Stat visualization: 10 dots, 9 filled. Reinforces the
                   "9 in 10" stat using the same dot-motif as the AHA flyer. -->
              <ol class="v7-stat-dots" aria-hidden="true">
                <li
                  v-for="n in 10"
                  :key="n"
                  class="v7-stat-dots__dot"
                  :class="{ 'is-filled': n <= 9 }"
                ></li>
              </ol>
              <p class="v7-guess__big-stat">{{ content.guess.answer }}</p>
              <p class="v7-guess__answer-line">
                {{ content.guess.answerLine }}
              </p>
              <p class="v7-guess__answer-sub">
                {{ content.guess.answerSubLine }}
              </p>
              <ul class="v7-guess__more-stats">
                <li
                  v-for="(s, j) in content.guess.moreStats"
                  :key="s.qual"
                  class="v7-guess__more-stat"
                  :style="{ '--i': j }"
                >
                  <span class="v7-guess__more-big">{{ s.big }}</span>
                  <span class="v7-guess__more-qual">{{ s.qual }}</span>
                </li>
              </ul>
              <p class="v7-guess__closing">{{ content.guess.closing }}</p>
            </div>
          </Transition>
        </div>
      </section>

      <!-- ─── Scene 4.5: Introducing the CKM Venn diagram ─── -->
      <section
        ref="vennIntroScene"
        class="v7-scene v7-scene--venn-intro"
        :class="{ 'is-active': activeSceneKey === 'vennIntro' }"
      >
        <div class="v7-scene__inner v7-scene__inner--venn-intro">
          <p class="v7-overline">{{ content.vennIntro.overline }}</p>
          <h2 class="v7-headline">{{ content.vennIntro.headline }}</h2>
          <p class="v7-body">{{ content.vennIntro.body }}</p>
          <p class="v7-cue" aria-hidden="true">Continue ↓</p>
        </div>
      </section>

      <!-- ─── Scenes 5–7: Three connections ─── -->
      <section
        ref="hkScene"
        class="v7-scene v7-scene--connection"
        data-region="hk"
        :class="{ 'is-active': activeSceneKey === 'hk' }"
      >
        <div class="v7-scene__inner v7-scene__inner--connection">
          <p class="v7-overline">{{ content.connections[0].overline }}</p>
          <h2 class="v7-headline">{{ content.connections[0].headline }}</h2>
          <p class="v7-body">{{ content.connections[0].body }}</p>
          <p class="v7-cue" aria-hidden="true">Continue ↓</p>
        </div>
      </section>

      <section
        ref="hmScene"
        class="v7-scene v7-scene--connection"
        data-region="hm"
        :class="{ 'is-active': activeSceneKey === 'hm' }"
      >
        <div class="v7-scene__inner v7-scene__inner--connection">
          <p class="v7-overline">{{ content.connections[1].overline }}</p>
          <h2 class="v7-headline">{{ content.connections[1].headline }}</h2>
          <p class="v7-body">{{ content.connections[1].body }}</p>
          <p class="v7-cue" aria-hidden="true">Continue ↓</p>
        </div>
      </section>

      <section
        ref="kmScene"
        class="v7-scene v7-scene--connection"
        data-region="km"
        :class="{ 'is-active': activeSceneKey === 'km' }"
      >
        <div class="v7-scene__inner v7-scene__inner--connection">
          <p class="v7-overline">{{ content.connections[2].overline }}</p>
          <h2 class="v7-headline">{{ content.connections[2].headline }}</h2>
          <p class="v7-body">{{ content.connections[2].body }}</p>
          <p class="v7-cue" aria-hidden="true">Continue ↓</p>
        </div>
      </section>

      <!-- ─── Scene 8: The shift ─── -->
      <section
        ref="shiftScene"
        class="v7-scene v7-scene--shift"
        :class="{ 'is-active': activeSceneKey === 'shift' }"
      >
        <div class="v7-scene__inner v7-scene__inner--shift">
          <p class="v7-overline">{{ content.shift.overline }}</p>
          <h2 class="v7-headline">{{ content.shift.headline }}</h2>
          <div class="v7-shift__messages" aria-live="polite">
            <p ref="shiftMessageWarn" class="v7-shift__message v7-shift__message--warn">
              {{ content.shift.bodyWarn }}
            </p>
            <p ref="shiftMessageHope" class="v7-shift__message v7-shift__message--hope">
              {{ content.shift.bodyHope }}
            </p>
          </div>
          <p class="v7-cue" aria-hidden="true">Continue ↓</p>
        </div>
      </section>

      <!-- ─── Scene 9: Take Action with interactive habit tiles ─── -->
      <section
        ref="takeActionScene"
        class="v7-scene v7-scene--take-action"
        :class="{ 'is-active': activeSceneKey === 'takeAction' }"
      >
        <div class="v7-scene__inner v7-scene__inner--take-action">
          <p class="v7-overline">{{ content.takeAction.overline }}</p>
          <h2 class="v7-headline">{{ content.takeAction.headline }}</h2>
          <p class="v7-body">{{ content.takeAction.body }}</p>
          <ul class="v7-habits">
            <li
              v-for="(habit, j) in content.takeAction.habits"
              :key="habit.id"
              class="v7-habits__item"
              :class="{ 'is-open': expandedHabit === habit.id }"
              :style="{ '--i': j }"
            >
              <button
                type="button"
                class="v7-habits__button"
                :aria-expanded="expandedHabit === habit.id"
                @click="toggleHabit(habit.id)"
              >
                <span class="v7-habits__num">{{
                  String(j + 1).padStart(2, '0')
                }}</span>
                <span class="v7-habits__name">{{ habit.name }}</span>
                <span class="v7-habits__chevron" aria-hidden="true">
                  {{ expandedHabit === habit.id ? '−' : '+' }}
                </span>
              </button>
              <Transition name="v7-habits-expand">
                <div v-if="expandedHabit === habit.id" class="v7-habits__detail">
                  <p v-if="habit.why" class="v7-habits__why">
                    {{ habit.why }}
                  </p>
                  <p class="v7-habits__step">
                    <span class="v7-habits__step-label">Try this:</span>
                    {{ habit.firstStep }}
                  </p>
                  <ul class="v7-habits__resources">
                    <li
                      v-for="r in habit.resources"
                      :key="r.url"
                      class="v7-habits__resource"
                    >
                      <a
                        :href="r.url"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="v7-habits__resource-link"
                      >
                        {{ r.label }} ↗
                      </a>
                      <span
                        v-if="r.placeholder"
                        class="v7-habits__resource-flag"
                        title="Resource link placeholder — needs AHA validation"
                      >
                        placeholder
                      </span>
                    </li>
                  </ul>
                </div>
              </Transition>
            </li>
          </ul>
        </div>
      </section>

      <!-- ─── Scene 10: Closing CTA (persona-tailored) ─── -->
      <section
        ref="ctaScene"
        class="v7-scene v7-scene--cta"
        :class="{ 'is-active': activeSceneKey === 'cta' }"
      >
        <div class="v7-scene__inner v7-scene__inner--cta">
          <p class="v7-overline v7-overline--accent">{{ content.cta.overline }}</p>
          <h2 class="v7-headline v7-headline--cta">{{ content.cta.headline }}</h2>
          <p class="v7-body">{{ content.cta.body }}</p>
          <p class="v7-cta__recap">{{ content.cta.recap }}</p>
          <a
            class="v7-cta-button"
            :href="ctaForPersona.primary.url"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>{{ ctaForPersona.primary.label }}</span>
            <span class="v7-cta-button__arrow" aria-hidden="true">↗</span>
          </a>
          <a
            class="v7-cta-secondary"
            :href="ctaForPersona.secondary.url"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ ctaForPersona.secondary.label }}
          </a>
          <p class="v7-cta__note" aria-label="Placeholder note">
            <span class="v7-habits__resource-flag">placeholder URLs</span>
            CTAs need AHA-validated destinations
          </p>
        </div>
      </section>

      <!-- Stub: end of v7 narrative (kept as a final scene for spacing) -->
      <section ref="stubScene" class="v7-scene v7-scene--stub">
        <div class="v7-scene__inner">
          <p class="v7-overline">Scaffold</p>
          <h2 class="v7-headline">End of /v7 narrative</h2>
          <p class="v7-body">
            Full 10-scene arc complete. Polish + reduced-motion fallback are
            the remaining build phases.
          </p>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,300..900;1,300..900&display=swap');

.v7 {
  --paper: #ffffff;
  --paper-alt: #f7f5f1;
  --ink: #2d2d2d;
  --ink-soft: #555;
  --ink-faint: #888;
  --rule: #e0dcd4;
  --heart: #c10e21;
  --kidney: #0a5c8a;
  --metabolic: #e2a52b;
  --accent: #c10e21;
  --accent-hover: #9c0c1a;

  position: relative;
  background: var(--paper);
  color: var(--ink);
  font-family:
    'Public Sans',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    sans-serif;
}

.v7-overline {
  font-family: inherit;
  font-weight: 700;
  font-size: 0.78rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-faint);
  margin: 0 0 1.5rem;
}

.v7-headline {
  font-family: inherit;
  font-weight: 800;
  font-size: clamp(2rem, 8vw, 3.25rem);
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin: 0 0 1.5rem;
  color: var(--ink);
  max-width: 18ch;
}

.v7-body {
  font-family: inherit;
  font-weight: 400;
  font-size: clamp(1rem, 2.6vw, 1.125rem);
  line-height: 1.6;
  margin: 0 0 1rem;
  color: var(--ink-soft);
  max-width: 36ch;
}

.v7-welcome {
  font-family: inherit;
  font-weight: 600;
  font-size: clamp(1.05rem, 2.7vw, 1.18rem);
  line-height: 1.45;
  color: var(--ink);
  margin: 0 0 1rem;
  max-width: 28ch;
  border-left: 3px solid var(--accent);
  padding-left: 0.85rem;
}

.v7-cue {
  font-family: inherit;
  font-weight: 600;
  font-size: 0.78rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-faint);
  margin: 4rem 0 0;
  transition: color 250ms ease;
}

.v7-cue.is-ready {
  color: var(--accent);
}

/* ── Audience selector overlay ─────────────────── */
.v7-selector {
  position: fixed;
  inset: 0;
  background: var(--paper);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(1.5rem, 6vw, 3rem);
  overflow-y: auto;
}

.v7-selector__inner {
  width: 100%;
  max-width: 36rem;
  display: flex;
  flex-direction: column;
}

.v7-selector__headline {
  font-family: inherit;
  font-weight: 800;
  font-size: clamp(2.25rem, 8.5vw, 3.5rem);
  line-height: 1.05;
  letter-spacing: -0.025em;
  margin: 0 0 1rem;
  color: var(--ink);
  max-width: 14ch;
}

.v7-selector__body {
  font-family: inherit;
  font-weight: 400;
  font-size: clamp(1.05rem, 2.6vw, 1.18rem);
  line-height: 1.55;
  color: var(--ink-soft);
  margin: 0 0 1.75rem;
  max-width: 36ch;
}

.v7-selector__options {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.65rem;
}

.v7-selector__option {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  width: 100%;
  background: var(--paper);
  border: 1.5px solid var(--rule);
  border-radius: 0.65rem;
  padding: 1rem 1.1rem;
  font-family: inherit;
  font-weight: 600;
  font-size: 1.05rem;
  line-height: 1.3;
  color: var(--ink);
  cursor: pointer;
  text-align: left;
  transition:
    border-color 200ms ease,
    transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 200ms ease;
  animation: v7-rise 600ms cubic-bezier(0.2, 0.65, 0.3, 1) both;
  animation-delay: calc(180ms + var(--i) * 70ms);
}

.v7-selector__option:hover {
  border-color: var(--accent);
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(193, 14, 33, 0.1);
}

.v7-selector__option:active {
  transform: translateY(0) scale(0.99);
}

.v7-selector__option:focus-visible {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(193, 14, 33, 0.18);
}

.v7-selector__option-letter {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.8rem;
  height: 1.8rem;
  border-radius: 50%;
  background: var(--paper-alt);
  color: var(--ink-soft);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  flex-shrink: 0;
  transition:
    background 200ms ease,
    color 200ms ease;
}

.v7-selector__option:hover .v7-selector__option-letter {
  background: var(--accent);
  color: #fff;
}

.v7-selector__option-label {
  flex: 1;
}

.v7-selector__option-arrow {
  color: var(--ink-faint);
  font-size: 1rem;
  transition:
    transform 220ms ease,
    color 220ms ease;
}

.v7-selector__option:hover .v7-selector__option-arrow {
  color: var(--accent);
  transform: translateX(2px);
}

.v7-selector__headline,
.v7-selector__body,
.v7-selector .v7-overline {
  animation: v7-rise 700ms cubic-bezier(0.2, 0.65, 0.3, 1) both;
}
.v7-selector .v7-overline {
  animation-delay: 0ms;
}
.v7-selector__headline {
  animation-delay: 80ms;
}
.v7-selector__body {
  animation-delay: 200ms;
}

@keyframes v7-rise {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.v7-selector-fade-leave-active {
  transition: opacity 400ms ease;
}
.v7-selector-fade-leave-to {
  opacity: 0;
}

/* ── DEBUG persona switcher (bottom-right) ──── */
.v7-persona-switch {
  position: fixed;
  bottom: clamp(0.75rem, 2vh, 1.25rem);
  right: clamp(0.75rem, 2vw, 1.25rem);
  z-index: 50;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: var(--paper);
  border: 1px solid var(--rule);
  border-radius: 999px;
  padding: 0.3rem 0.7rem;
  font-family: inherit;
  font-weight: 600;
  font-size: 0.72rem;
  letter-spacing: 0.04em;
  color: var(--ink-soft);
  cursor: pointer;
  opacity: 0.45;
  transition:
    opacity 200ms ease,
    border-color 200ms ease,
    color 200ms ease;
}

.v7-persona-switch:hover,
.v7-persona-switch:focus-visible {
  opacity: 1;
  border-color: var(--accent);
  color: var(--ink);
  outline: none;
}

.v7-persona-switch::before {
  content: 'debug';
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--ink-faint);
  margin-right: 0.15rem;
  border-right: 1px solid var(--rule);
  padding-right: 0.5rem;
}

.v7-persona-switch__short {
  font-weight: 700;
  color: var(--ink);
}

.v7-persona-switch__change {
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.65rem;
  color: var(--accent);
}

/* ── Scrollytelling experience ─────────────────── */
.v7-experience {
  position: relative;
}

/* ── Stage zones ──────────────────────────────────
   The viewport is split into two non-overlapping stage zones:
   - top 55vh: the Venn (always lives here, never crosses below).
   - bottom 45vh: scene copy (always lives here, never crosses above).
   This means the Venn and text can't visually overlap, so the
   choreography reads as "one stage, two performers." */
.v7-venn {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 55vh;
  height: 55svh;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 1;
  will-change: transform;
}

.v7-venn__svg {
  width: min(72vw, 460px);
  aspect-ratio: 1 / 1;
  height: auto;
  max-height: 92%;
}

.v7-venn__threads {
  pointer-events: none;
}

.v7-venn__thread {
  stroke: var(--ink);
  stroke-width: 1.5;
  stroke-linecap: round;
  fill: none;
  opacity: 0;
}

.v7-venn__labels {
  pointer-events: none;
}

.v7-venn__label {
  font-family: 'Public Sans', sans-serif;
  font-weight: 700;
  font-size: 22px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.v7-venn__label--heart {
  fill: var(--heart);
}

.v7-venn__label--kidney {
  fill: var(--kidney);
}

.v7-venn__label--metabolic {
  fill: var(--metabolic);
}

/* ── Scene base ────────────────────────────────── */
.v7-scene {
  position: relative;
  z-index: 2;
  min-height: 100vh;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  padding: clamp(2rem, 8vw, 4rem) clamp(1.25rem, 5vw, 2.5rem);
  padding-bottom: clamp(4rem, 10vh, 6rem);
}

/* Scene content is anchored to the bottom stage zone of the *viewport*,
   not the scene. This means it never crosses into the Venn pane regardless
   of scene height. All inactive scenes' content stacks here invisibly
   (opacity 0 via the staged-fade rule); only the active scene's content
   is visible and interactive at any moment. */
.v7-scene__inner {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 36rem;
  padding: clamp(1.25rem, 4vh, 2.5rem) clamp(1.25rem, 5vw, 2.5rem)
    clamp(2.5rem, 6vh, 4rem);
  pointer-events: none;
  z-index: 2;
}

.v7-scene.is-active .v7-scene__inner {
  pointer-events: auto;
}

/* Tall-content scenes flow naturally instead of being fixed-positioned. */
.v7-scene--take-action .v7-scene__inner,
.v7-scene--cta .v7-scene__inner {
  position: relative;
  bottom: auto;
  left: auto;
  transform: none;
  pointer-events: auto;
  padding: 0;
}

/* takeAction — Venn is a small corner badge so content can sit near the top */
.v7-scene--take-action .v7-scene__inner {
  margin-top: clamp(2rem, 7vh, 4rem);
}

/* cta — the closing-hero Venn fills the top stage zone, so push the content
   below it just like the captioned scenes do. */
.v7-scene--cta .v7-scene__inner {
  margin-top: 56vh;
  margin-top: 56svh;
}

/* Connection scenes (5–7) — sized narrower for headline focus */
.v7-scene__inner--connection {
  max-width: 32rem;
}

/* Scene 4.5 — Venn intro: hero moment for the Venn diagram.
   With the split-pane stage, the saturated Venn fills the top zone
   and the copy fills the bottom zone — they no longer compete. */
.v7-scene__inner--venn-intro {
  max-width: 32rem;
}

/* ── Stagecraft: every scene's text content is choreographed ────
   Copy enters AFTER the Venn has substantially morphed (~700ms),
   and exits quickly when its scene leaves the stage so the Venn
   is alone during the transition. */
.v7-scene .v7-scene__inner > * {
  opacity: 0;
  transform: translateY(14px);
  /* Exit transition (when .is-active is removed): fast, no delay,
     ease-in so it falls away crisply. */
  transition:
    opacity 320ms cubic-bezier(0.4, 0, 1, 1),
    transform 320ms cubic-bezier(0.4, 0, 1, 1);
  transition-delay: 0ms;
}

.v7-scene.is-active .v7-scene__inner > * {
  opacity: 1;
  transform: none;
  /* Entry transition (when .is-active is added): slower ease-out
     to feel deliberate. Delays applied per-child below. */
  transition:
    opacity 650ms cubic-bezier(0.2, 0.65, 0.3, 1),
    transform 650ms cubic-bezier(0.2, 0.65, 0.3, 1);
}

/* Stagger child reveals so headlines, body, then cues rise in sequence —
   only after the Venn morph (~600–700ms) has substantially landed. */
.v7-scene.is-active .v7-scene__inner > *:nth-child(1) {
  transition-delay: 650ms;
}
.v7-scene.is-active .v7-scene__inner > *:nth-child(2) {
  transition-delay: 800ms;
}
.v7-scene.is-active .v7-scene__inner > *:nth-child(3) {
  transition-delay: 950ms;
}
.v7-scene.is-active .v7-scene__inner > *:nth-child(4) {
  transition-delay: 1100ms;
}
.v7-scene.is-active .v7-scene__inner > *:nth-child(5) {
  transition-delay: 1250ms;
}
.v7-scene.is-active .v7-scene__inner > *:nth-child(6) {
  transition-delay: 1400ms;
}
.v7-scene.is-active .v7-scene__inner > *:nth-child(7) {
  transition-delay: 1550ms;
}

/* ── Scene 4: stat guess ──────────────────────── */
.v7-scene--guess .v7-scene__inner {
  /* Inner is fixed at viewport bottom; nothing scene-specific needed. */
}

.v7-scene__inner--guess {
  max-width: 32rem;
}

.v7-guess__framing {
  font-family: inherit;
  font-weight: 600;
  font-size: clamp(1rem, 2.6vw, 1.1rem);
  line-height: 1.4;
  color: var(--ink);
  margin: 0 0 1rem;
  max-width: 28ch;
  border-left: 3px solid var(--accent);
  padding-left: 0.85rem;
}

.v7-headline--question {
  font-size: clamp(1.5rem, 5.5vw, 2.25rem);
  line-height: 1.15;
  max-width: 22ch;
  margin: 0 0 1.25rem;
}

.v7-guess__options {
  list-style: none;
  margin: 0 0 1rem;
  padding: 0;
  display: grid;
  gap: 0.55rem;
}

.v7-guess__option {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  width: 100%;
  background: var(--paper);
  border: 1.5px solid var(--rule);
  border-radius: 0.65rem;
  padding: 0.85rem 1rem;
  font-family: inherit;
  font-weight: 600;
  font-size: 1.05rem;
  color: var(--ink);
  cursor: pointer;
  text-align: left;
  transition:
    border-color 200ms ease,
    transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 200ms ease;
  animation: v7-rise 600ms cubic-bezier(0.2, 0.65, 0.3, 1) both;
  animation-delay: calc(120ms + var(--i) * 70ms);
}

.v7-guess__option:hover {
  border-color: var(--accent);
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(193, 14, 33, 0.1);
}

.v7-guess__option:active {
  transform: translateY(0) scale(0.99);
}

.v7-guess__option:focus-visible {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(193, 14, 33, 0.18);
}

.v7-guess__option-letter {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.65rem;
  height: 1.65rem;
  border-radius: 50%;
  background: var(--paper-alt);
  color: var(--ink-soft);
  font-size: 0.78rem;
  font-weight: 700;
  flex-shrink: 0;
  transition:
    background 200ms ease,
    color 200ms ease;
}

.v7-guess__option:hover .v7-guess__option-letter {
  background: var(--accent);
  color: #fff;
}

.v7-cue--guess {
  margin-top: 0.5rem;
}

/* Reveal panel */
.v7-guess__verdict {
  font-family: inherit;
  font-weight: 700;
  font-size: 0.78rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--accent);
  margin: 0 0 1.25rem;
  animation: v7-rise 600ms cubic-bezier(0.2, 0.65, 0.3, 1) both;
}

.v7-guess__big-stat {
  font-family: inherit;
  font-weight: 900;
  font-size: clamp(3rem, 13vw, 5rem);
  line-height: 0.95;
  letter-spacing: -0.04em;
  color: var(--accent);
  margin: 0 0 1.5rem;
  font-feature-settings: 'tnum';
  animation: v7-rise 700ms cubic-bezier(0.2, 0.65, 0.3, 1) both;
  animation-delay: 100ms;
}

.v7-guess__answer-line {
  font-family: inherit;
  font-weight: 700;
  font-size: clamp(1.05rem, 2.8vw, 1.2rem);
  line-height: 1.4;
  color: var(--ink);
  margin: 0 0 1.25rem;
  max-width: 28ch;
  animation: v7-rise 700ms cubic-bezier(0.2, 0.65, 0.3, 1) both;
  animation-delay: 200ms;
}

.v7-guess__answer-sub {
  font-family: inherit;
  font-weight: 400;
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--ink-soft);
  margin: 0 0 3rem;
  max-width: 32ch;
  animation: v7-rise 700ms cubic-bezier(0.2, 0.65, 0.3, 1) both;
  animation-delay: 320ms;
}

.v7-guess__more-stats {
  list-style: none;
  margin: 1rem 0 0;
  padding: 0;
  display: grid;
  gap: 1rem;
}

.v7-guess__more-stat {
  display: grid;
  grid-template-columns: minmax(6rem, auto) 1fr;
  gap: 0.85rem 1.25rem;
  align-items: baseline;
  padding: 1.15rem 0;
  border-bottom: 1px solid var(--rule);
  animation: v7-rise 600ms cubic-bezier(0.2, 0.65, 0.3, 1) both;
  animation-delay: calc(440ms + var(--i) * 110ms);
}
.v7-guess__more-stat:last-child {
  border-bottom: none;
}

.v7-guess__more-big {
  font-family: inherit;
  font-weight: 800;
  font-size: clamp(1rem, 2.8vw, 1.2rem);
  color: var(--accent);
  letter-spacing: -0.01em;
  line-height: 1.15;
}

.v7-guess__more-qual {
  font-family: inherit;
  font-weight: 400;
  font-size: 0.92rem;
  line-height: 1.5;
  color: var(--ink-soft);
}

.v7-guess__closing {
  font-family: inherit;
  font-weight: 600;
  font-size: clamp(1rem, 2.4vw, 1.1rem);
  line-height: 1.5;
  color: var(--ink);
  margin: 3rem 0 0;
  max-width: 32ch;
  border-left: 3px solid var(--accent);
  padding-left: 1rem;
  animation: v7-rise 600ms cubic-bezier(0.2, 0.65, 0.3, 1) both;
  animation-delay: calc(440ms + 4 * 110ms + 100ms);
}

.v7-guess-swap-enter-active,
.v7-guess-swap-leave-active {
  transition:
    opacity 320ms ease,
    transform 320ms ease;
}
.v7-guess-swap-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.v7-guess-swap-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* ── Scene 8: shift ───────────────────────────── */
.v7-scene--shift .v7-scene__inner {
  /* Inner is fixed at viewport bottom; nothing scene-specific needed. */
}

.v7-scene__inner--shift {
  max-width: 32rem;
}

.v7-shift__messages {
  position: relative;
  width: 100%;
  min-height: 11rem;
  margin: 2.5rem 0 0;
}

.v7-shift__message {
  position: absolute;
  inset: 0;
  font-family: inherit;
  font-size: clamp(1.05rem, 2.6vw, 1.18rem);
  line-height: 1.6;
  margin: 0;
  padding-left: 1rem;
  border-left: 3px solid var(--rule);
  opacity: 0;
  transform: translateY(8px);
  max-width: 36ch;
}

.v7-shift__message--warn {
  color: #6e3a3f;
}

.v7-shift__message--hope {
  color: var(--ink);
  font-weight: 500;
  border-left-color: var(--accent);
}

/* ── Scene 9: Take Action ─────────────────────── */
.v7-scene--take-action .v7-scene__inner {
  margin-top: clamp(2rem, 7vh, 4rem);
}

.v7-scene__inner--take-action {
  max-width: 36rem;
}

.v7-habits {
  list-style: none;
  margin: 1.25rem 0 0;
  padding: 0;
  display: grid;
  gap: 0.55rem;
}

.v7-habits__button {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  width: 100%;
  background: var(--paper);
  border: 1.5px solid var(--rule);
  border-radius: 0.65rem;
  padding: 0.85rem 1rem;
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  transition:
    border-color 200ms ease,
    transform 200ms ease,
    box-shadow 200ms ease;
}

.v7-habits__button:hover,
.v7-habits__button:focus-visible {
  border-color: var(--ink);
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(45, 45, 45, 0.07);
  outline: none;
}

.v7-habits__item.is-open .v7-habits__button {
  border-color: var(--accent);
}

.v7-habits__num {
  font-family: inherit;
  font-weight: 700;
  font-size: 0.78rem;
  letter-spacing: 0.06em;
  color: var(--accent);
  flex-shrink: 0;
  width: 1.65rem;
  text-align: center;
}

.v7-habits__name {
  flex: 1;
  font-family: inherit;
  font-weight: 600;
  font-size: 1rem;
  color: var(--ink);
}

.v7-habits__chevron {
  font-size: 1.2rem;
  color: var(--ink-faint);
  font-weight: 400;
  width: 1rem;
  text-align: center;
}

.v7-habits__detail {
  padding: 0.75rem 1rem 1rem;
  background: var(--paper-alt);
  border-radius: 0 0 0.5rem 0.5rem;
  margin: -0.25rem 0.25rem 0;
  border-left: 3px solid var(--accent);
}

.v7-habits__why {
  font-family: inherit;
  font-weight: 400;
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--ink-soft);
  margin: 0 0 0.65rem;
  font-style: italic;
}

.v7-habits__step {
  font-family: inherit;
  font-weight: 600;
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--ink);
  margin: 0 0 0.6rem;
}

.v7-habits__step-label {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent);
  margin-right: 0.4rem;
}

.v7-habits__resources {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.4rem;
}

.v7-habits__resource {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.v7-habits__resource-link {
  font-family: inherit;
  font-weight: 500;
  font-size: 0.9rem;
  color: var(--accent);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
}

.v7-habits__resource-link:hover {
  color: var(--accent-hover);
}

.v7-habits__resource-flag {
  font-family: inherit;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-faint);
  background: rgba(0, 0, 0, 0.05);
  padding: 0.1rem 0.4rem;
  border-radius: 0.25rem;
  cursor: help;
}

.v7-habits-expand-enter-active,
.v7-habits-expand-leave-active {
  transition:
    opacity 250ms ease,
    transform 250ms ease,
    max-height 280ms ease;
  overflow: hidden;
}
.v7-habits-expand-enter-from,
.v7-habits-expand-leave-to {
  opacity: 0;
  transform: translateY(-4px);
  max-height: 0;
}
.v7-habits-expand-enter-to,
.v7-habits-expand-leave-from {
  opacity: 1;
  max-height: 14rem;
}

/* ── Scene 10: CTA ─────────────────────────────── */
/* Mobile margin-top is set in the unified tall-content block above so the
   content drops below the closing-hero Venn pane. */

.v7-scene__inner--cta {
  max-width: 32rem;
  /* Flex column so the button and secondary link stack vertically and
     `align-self: flex-start` works as intended on each. */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.v7-overline--accent {
  color: var(--accent);
}

.v7-headline--cta {
  font-size: clamp(2.25rem, 9vw, 3.5rem);
  max-width: 16ch;
}

.v7-cta-button {
  align-self: flex-start;
  display: inline-flex;
  align-items: baseline;
  gap: 0.6rem;
  margin-top: 1.5rem;
  font-family: inherit;
  font-weight: 700;
  font-size: 1rem;
  color: #fff;
  background: var(--accent);
  text-decoration: none;
  padding: 0.95rem 1.75rem 0.95rem 1.95rem;
  border-radius: 999px;
  letter-spacing: 0.01em;
  box-shadow: 0 6px 20px rgba(193, 14, 33, 0.22);
  transition:
    transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1),
    background 200ms ease,
    box-shadow 200ms ease;
}

.v7-cta-button:hover,
.v7-cta-button:focus-visible {
  transform: translateY(-2px);
  background: var(--accent-hover);
  box-shadow: 0 8px 24px rgba(193, 14, 33, 0.32);
  outline: none;
}

.v7-cta-button:active {
  transform: translateY(1px) scale(0.98);
}

.v7-cta-button__arrow {
  font-style: normal;
  transition: transform 220ms ease;
}

.v7-cta-button:hover .v7-cta-button__arrow {
  transform: translate(2px, -2px);
}

.v7-cta-secondary {
  align-self: flex-start;
  margin-top: 1.25rem;
  font-family: inherit;
  font-weight: 500;
  font-size: 0.95rem;
  color: var(--ink-soft);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 4px;
  text-decoration-color: var(--rule);
}

.v7-cta-secondary:hover {
  color: var(--ink);
  text-decoration-color: currentColor;
}

.v7-cta__recap {
  font-family: inherit;
  font-weight: 600;
  font-size: clamp(1rem, 2.4vw, 1.1rem);
  line-height: 1.5;
  color: var(--ink);
  margin: 0.5rem 0 0;
  max-width: 32ch;
  border-left: 3px solid var(--accent);
  padding-left: 0.875rem;
}

.v7-cta__note {
  margin-top: 2rem;
  font-family: inherit;
  font-size: 0.78rem;
  color: var(--ink-faint);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

/* ── Three teammates list ──────────────────────── */
.v7-teammates {
  list-style: none;
  margin: 1.5rem 0 0;
  padding: 0;
  display: grid;
  gap: 0.6rem;
}

.v7-teammates__button {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  width: 100%;
  background: var(--paper);
  border: 1.5px solid var(--rule);
  border-radius: 0.65rem;
  padding: 0.95rem 1rem;
  font-family: inherit;
  font-weight: 700;
  font-size: 1.05rem;
  color: var(--ink);
  cursor: pointer;
  text-align: left;
  transition:
    border-color 220ms ease,
    transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 220ms ease;
}

.v7-teammates__button:hover,
.v7-teammates__button:focus-visible {
  border-color: var(--ink);
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(45, 45, 45, 0.07);
  outline: none;
}

.v7-teammates__item.is-open .v7-teammates__button {
  border-color: var(--ink);
  box-shadow: 0 4px 14px rgba(45, 45, 45, 0.07);
}

.v7-teammates__item[data-region='heart'].is-open .v7-teammates__button {
  border-color: var(--heart);
}
.v7-teammates__item[data-region='kidney'].is-open .v7-teammates__button {
  border-color: var(--kidney);
}
.v7-teammates__item[data-region='metabolic'].is-open .v7-teammates__button {
  border-color: var(--metabolic);
}

.v7-teammates__dot {
  display: inline-block;
  width: 0.85rem;
  height: 0.85rem;
  border-radius: 50%;
  flex-shrink: 0;
}
.v7-teammates__dot[data-region='heart'] { background: var(--heart); }
.v7-teammates__dot[data-region='kidney'] { background: var(--kidney); }
.v7-teammates__dot[data-region='metabolic'] { background: var(--metabolic); }

.v7-teammates__name {
  flex: 1;
}

.v7-teammates__chevron {
  font-size: 1.2rem;
  color: var(--ink-faint);
  font-weight: 400;
  width: 1rem;
  text-align: center;
}

.v7-teammates__what {
  font-family: inherit;
  font-weight: 400;
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--ink-soft);
  margin: 0.5rem 0.25rem 0.25rem 0.25rem;
  padding: 0.65rem 0.9rem;
  background: var(--paper-alt);
  border-radius: 0.5rem;
}

.v7-teammates-expand-enter-active,
.v7-teammates-expand-leave-active {
  transition:
    opacity 250ms ease,
    transform 250ms ease,
    max-height 280ms ease;
  overflow: hidden;
}
.v7-teammates-expand-enter-from,
.v7-teammates-expand-leave-to {
  opacity: 0;
  transform: translateY(-4px);
  max-height: 0;
}
.v7-teammates-expand-enter-to,
.v7-teammates-expand-leave-from {
  opacity: 1;
  max-height: 12rem;
}

/* ── Desktop layout (≥ 960px) ─────────────────────
   Switch from stacked (Venn top / text bottom) to side-by-side
   (text left / Venn right). This is the editorial-scrollytelling
   layout: a fixed visual pane on the right, copy that scrolls
   through fixed positions on the left. */
@media (min-width: 960px) {
  /* Venn moves from top zone (full width, 55vh) to right pane
     (full height, 50vw). */
  .v7-venn {
    top: 0;
    bottom: 0;
    left: auto;
    right: 0;
    width: 50vw;
    height: 100vh;
    height: 100svh;
  }

  .v7-venn__svg {
    width: min(80%, 540px);
    max-height: 80%;
  }

  /* Scene copy lives in the left pane, vertically centered for the
     editorial caption feel. Mobile's bottom-anchored layout is replaced. */
  .v7-scene__inner {
    position: fixed;
    top: 50%;
    left: 0;
    right: 50vw;
    bottom: auto;
    transform: translateY(-50%);
    width: auto;
    max-width: none;
    padding: 0 clamp(2rem, 4vw, 4rem) 0 clamp(3rem, 6vw, 6rem);
  }

  /* Inner content stays at a comfortable text measure within the pane,
     anchored toward the right edge of the left pane so it sits closer
     to the Venn. */
  .v7-scene__inner > * {
    max-width: 32rem;
    margin-left: auto;
  }

  /* Tall-content scenes: natural-flow layout. cta keeps the left-pane
     constraint so its hero Venn has the right pane. takeAction has no
     Venn so its content can span the full viewport. */
  .v7-scene--take-action .v7-scene__inner,
  .v7-scene--cta .v7-scene__inner {
    position: relative;
    top: auto;
    left: auto;
    right: auto;
    bottom: auto;
    transform: none;
    margin-top: clamp(3rem, 8vh, 6rem);
    padding: 0;
  }

  .v7-scene--take-action .v7-scene__inner > *,
  .v7-scene--cta .v7-scene__inner > * {
    margin-left: 0;
  }

  /* cta keeps left-pane constraint (Venn lives in right pane) */
  .v7-scene--cta .v7-scene__inner {
    margin-left: clamp(3rem, 6vw, 6rem);
    margin-right: 50vw;
    padding: 0 clamp(2rem, 4vw, 4rem) 0 0;
    max-width: 32rem;
  }

  /* takeAction has no Venn — content centers on full viewport */
  .v7-scene--take-action .v7-scene__inner {
    margin-left: auto;
    margin-right: auto;
    padding: 0 clamp(2rem, 5vw, 4rem);
    max-width: 42rem;
  }

  /* Persona switcher — move to bottom-left so it doesn't sit over the Venn pane */
  .v7-persona-switch {
    right: auto;
    left: clamp(0.75rem, 2vw, 1.25rem);
  }

  /* Guess scene — Venn is hidden during this beat, so let the question and
     reveal cascade center across the full viewport instead of crammed in
     the left pane. */
  .v7-scene--guess .v7-scene__inner {
    left: 50%;
    right: auto;
    transform: translate(-50%, -50%);
    width: auto;
    max-width: 38rem;
    padding: 0 clamp(2rem, 5vw, 4rem);
  }

  .v7-scene--guess .v7-scene__inner > * {
    margin-left: 0;
    margin-right: 0;
  }
}

/* ── Visual flair: dot patterns ───────────────────
   Two related additions echoing the AHA flyer's dotted motif:
   1. v7-progress: a bottom-fixed row of 10 dots showing journey progress.
   2. v7-stat-dots: a row of 10 dots used to visualize the "9 in 10" stat. */

.v7-progress {
  position: fixed;
  bottom: clamp(0.85rem, 2vh, 1.4rem);
  left: 50%;
  transform: translateX(-50%);
  z-index: 30;
  pointer-events: none;
}

.v7-progress__list {
  display: flex;
  align-items: center;
  gap: 7px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.v7-progress__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: transparent;
  border: 1px solid var(--ink-faint);
  opacity: 0.55;
  transition:
    background 350ms ease,
    border-color 350ms ease,
    transform 350ms cubic-bezier(0.34, 1.56, 0.64, 1),
    opacity 350ms ease;
}

.v7-progress__dot.is-visited {
  background: var(--ink-faint);
  border-color: var(--ink-faint);
  opacity: 0.55;
}

.v7-progress__dot.is-current {
  background: var(--accent);
  border-color: var(--accent);
  opacity: 1;
  transform: scale(1.5);
}

/* Color backdrop wash — three soft radial gradients using the heart, kidney,
   and metabolic brand colors. Lives behind everything (z-index 0) and only
   shows on its scene. Creates an atmospheric, warm opening. */
.v7-bg-tint {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  opacity: 0;
  background:
    radial-gradient(circle at 78% 22%, rgba(193, 14, 33, 0.18), transparent 55%),
    radial-gradient(circle at 25% 75%, rgba(226, 165, 43, 0.14), transparent 55%),
    radial-gradient(circle at 88% 82%, rgba(10, 92, 138, 0.12), transparent 50%);
  transition: opacity 800ms cubic-bezier(0.2, 0.65, 0.3, 1);
}

.v7-bg-tint.is-shown {
  opacity: 1;
}

/* Stat visualization for the post-reveal "9 in 10" cascade */
.v7-stat-dots {
  list-style: none;
  display: flex;
  gap: 7px;
  margin: 0 0 1rem;
  padding: 0;
}

.v7-stat-dots__dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: transparent;
  border: 1.5px solid var(--ink-faint);
  opacity: 0.55;
  transition: background 400ms ease, border-color 400ms ease, opacity 400ms ease;
}

.v7-stat-dots__dot.is-filled {
  background: var(--accent);
  border-color: var(--accent);
  opacity: 1;
}

/* ── Reduced motion ───────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .v7-selector__option,
  .v7-selector__headline,
  .v7-selector__body,
  .v7-selector .v7-overline {
    animation: none !important;
  }
  .v7-teammates-expand-enter-active,
  .v7-teammates-expand-leave-active {
    transition: none !important;
  }
}
</style>
