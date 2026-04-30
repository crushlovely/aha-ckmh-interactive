<template>
  <div class="ck-fp" :class="{ 'ck-fp--has-banner': showReturnBanner }">
    <!-- Optional return-visit banner (cookie-driven) -->
    <transition name="ck-banner">
      <div v-if="showReturnBanner" class="ck-banner">
        <div class="ck-banner__content">
          <span class="ck-banner__icon">👋</span>
          <span>Welcome back — pick up where you left off?</span>
          <button class="ck-banner__action" @click="resumeSession">
            Yes, take me there →
          </button>
          <button class="ck-banner__dismiss" aria-label="Dismiss" @click="showReturnBanner = false">
            ✕
          </button>
        </div>
      </div>
    </transition>

    <!-- ── Sticky page nav ── -->
    <nav class="ck-nav" :aria-label="'In-page navigation'">
      <ul class="ck-nav__list">
        <li v-for="item in data.nav" :key="item.id">
          <a
            :href="`#${item.id}`"
            class="ck-nav__chip"
            :class="{
              'ck-nav__chip--active': activeSection === item.id,
              'ck-nav__chip--visited': visitedSections.includes(item.id),
            }"
          >
            <span class="ck-nav__chip-num">{{ item.n }}</span>
            <span class="ck-nav__chip-label">{{ item.label }}</span>
          </a>
        </li>
      </ul>
    </nav>

    <!-- ── Section 1 · Hero ── -->
    <section id="intro" ref="sec_intro" class="ck-section ck-hero">
      <div class="container ck-hero__inner">
        <span class="ck-hero__overline">{{ data.hero.overline }}</span>
        <h1 class="ck-hero__title">{{ data.hero.title }}</h1>
        <p class="ck-hero__sub">{{ data.hero.subtitle }}</p>
        <a href="#explore" class="ck-hero__scrollcue">{{ data.hero.scrollCue }}</a>
      </div>
      <svg class="ck-hero__ambient" viewBox="0 0 1200 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g opacity="0.55">
          <circle cx="180" cy="120" r="60" fill="none" stroke="#E05A6D" stroke-width="1.4" stroke-dasharray="3 4" />
          <circle cx="1020" cy="100" r="55" fill="none" stroke="#3A9BA5" stroke-width="1.4" stroke-dasharray="3 4" />
          <circle cx="600" cy="320" r="65" fill="none" stroke="#D4943A" stroke-width="1.4" stroke-dasharray="3 4" />
          <path d="M 220 140 Q 600 60 990 130" fill="none" stroke="#888" stroke-width="0.8" stroke-dasharray="2 6" />
          <path d="M 220 160 Q 400 280 580 300" fill="none" stroke="#888" stroke-width="0.8" stroke-dasharray="2 6" />
          <path d="M 990 150 Q 800 280 640 310" fill="none" stroke="#888" stroke-width="0.8" stroke-dasharray="2 6" />
        </g>
      </svg>
    </section>

    <!-- ── Section 2 · Venn (CKM Connection Explorer) ── -->
    <section id="explore" ref="sec_explore" class="ck-section ck-section--white">
      <div class="container">
        <SectionHeader :num="data.venn.sectionNum" :title="data.venn.sectionTitle" :purpose="data.venn.sectionPurpose" />

        <div class="ck-layout" :class="{ 'ck-layout--open': activeRegion }">
          <div class="ck-diagram-wrap">
            <svg
              class="ck-diagram"
              viewBox="0 0 500 455"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Interactive Venn diagram showing connections between Heart, Kidney, and Metabolic health"
              :style="diagramTiltStyle"
              @mousemove="onDiagramMouseMove"
              @mouseleave="onDiagramMouseLeave"
            >
              <defs>
                <clipPath id="ckmh5-clipH">
                  <circle cx="175" cy="145" r="130" :transform="magneticTransform('heart')" />
                </clipPath>
                <clipPath id="ckmh5-clipK">
                  <circle cx="325" cy="145" r="130" :transform="magneticTransform('kidney')" />
                </clipPath>
                <clipPath id="ckmh5-clipM">
                  <circle cx="250" cy="270" r="130" :transform="magneticTransform('metabolic')" />
                </clipPath>
                <clipPath id="ckmh5-clipHK" clip-path="url(#ckmh5-clipK)">
                  <circle cx="175" cy="145" r="130" :transform="magneticTransform('heart')" />
                </clipPath>
                <clipPath id="ckmh5-clipHM" clip-path="url(#ckmh5-clipM)">
                  <circle cx="175" cy="145" r="130" :transform="magneticTransform('heart')" />
                </clipPath>
                <clipPath id="ckmh5-clipKM" clip-path="url(#ckmh5-clipM)">
                  <circle cx="325" cy="145" r="130" :transform="magneticTransform('kidney')" />
                </clipPath>
                <clipPath id="ckmh5-clipHKM" clip-path="url(#ckmh5-clipHK)">
                  <circle cx="250" cy="270" r="130" :transform="magneticTransform('metabolic')" />
                </clipPath>
                <linearGradient id="ckmh5-shimmer" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stop-color="white" stop-opacity="0" />
                  <stop offset="50%" stop-color="white" stop-opacity="0.65" />
                  <stop offset="100%" stop-color="white" stop-opacity="0" />
                </linearGradient>
              </defs>

              <circle cx="175" cy="145" r="135" :fill="regions.heart.color" :opacity="haloOpacity('heart')" class="ck-halo" />
              <circle cx="325" cy="145" r="135" :fill="regions.kidney.color" :opacity="haloOpacity('kidney')" class="ck-halo" />
              <circle cx="250" cy="270" r="135" :fill="regions.metabolic.color" :opacity="haloOpacity('metabolic')" class="ck-halo" />

              <circle cx="175" cy="145" r="130" :fill="regions.heart.color" :opacity="circleOpacity('heart')" :transform="magneticTransform('heart')" class="ck-circle-base" />
              <circle cx="325" cy="145" r="130" :fill="regions.kidney.color" :opacity="circleOpacity('kidney')" :transform="magneticTransform('kidney')" class="ck-circle-base" />
              <circle cx="250" cy="270" r="130" :fill="regions.metabolic.color" :opacity="circleOpacity('metabolic')" :transform="magneticTransform('metabolic')" class="ck-circle-base" />

              <rect x="0" y="0" width="500" height="455" :fill="regions.heart_kidney.color" :opacity="overlapOpacity('heart_kidney')" clip-path="url(#ckmh5-clipHK)" class="ck-circle-base" />
              <rect x="0" y="0" width="500" height="455" :fill="regions.heart_metabolic.color" :opacity="overlapOpacity('heart_metabolic')" clip-path="url(#ckmh5-clipHM)" class="ck-circle-base" />
              <rect x="0" y="0" width="500" height="455" :fill="regions.kidney_metabolic.color" :opacity="overlapOpacity('kidney_metabolic')" clip-path="url(#ckmh5-clipKM)" class="ck-circle-base" />
              <rect x="0" y="0" width="500" height="455" :fill="regions.center.color" :opacity="overlapOpacity('center')" clip-path="url(#ckmh5-clipHKM)" class="ck-circle-base" />

              <rect x="0" y="0" width="500" height="455" fill="transparent" clip-path="url(#ckmh5-clipH)" class="ck-region"
                role="button" tabindex="0" :aria-label="`Heart health${isVisited('heart') ? ' (visited)' : ''}`"
                @click="selectRegion('heart')" @mouseenter="hoveredRegion = 'heart'" @mouseleave="hoveredRegion = null"
                @keydown.enter.prevent="selectRegion('heart')" @keydown.space.prevent="selectRegion('heart')" />
              <rect x="0" y="0" width="500" height="455" fill="transparent" clip-path="url(#ckmh5-clipK)" class="ck-region"
                role="button" tabindex="0" :aria-label="`Kidney health${isVisited('kidney') ? ' (visited)' : ''}`"
                @click="selectRegion('kidney')" @mouseenter="hoveredRegion = 'kidney'" @mouseleave="hoveredRegion = null"
                @keydown.enter.prevent="selectRegion('kidney')" @keydown.space.prevent="selectRegion('kidney')" />
              <rect x="0" y="0" width="500" height="455" fill="transparent" clip-path="url(#ckmh5-clipM)" class="ck-region"
                role="button" tabindex="0" :aria-label="`Metabolic health${isVisited('metabolic') ? ' (visited)' : ''}`"
                @click="selectRegion('metabolic')" @mouseenter="hoveredRegion = 'metabolic'" @mouseleave="hoveredRegion = null"
                @keydown.enter.prevent="selectRegion('metabolic')" @keydown.space.prevent="selectRegion('metabolic')" />
              <rect x="0" y="0" width="500" height="455" fill="transparent" clip-path="url(#ckmh5-clipHK)" class="ck-region"
                role="button" tabindex="0" :aria-label="`Heart and kidney connection${isVisited('heart_kidney') ? ' (visited)' : ''}`"
                @click="selectRegion('heart_kidney')" @mouseenter="hoveredRegion = 'heart_kidney'" @mouseleave="hoveredRegion = null"
                @keydown.enter.prevent="selectRegion('heart_kidney')" @keydown.space.prevent="selectRegion('heart_kidney')" />
              <rect x="0" y="0" width="500" height="455" fill="transparent" clip-path="url(#ckmh5-clipHM)" class="ck-region"
                role="button" tabindex="0" :aria-label="`Heart and metabolic connection${isVisited('heart_metabolic') ? ' (visited)' : ''}`"
                @click="selectRegion('heart_metabolic')" @mouseenter="hoveredRegion = 'heart_metabolic'" @mouseleave="hoveredRegion = null"
                @keydown.enter.prevent="selectRegion('heart_metabolic')" @keydown.space.prevent="selectRegion('heart_metabolic')" />
              <rect x="0" y="0" width="500" height="455" fill="transparent" clip-path="url(#ckmh5-clipKM)" class="ck-region"
                role="button" tabindex="0" :aria-label="`Kidney and metabolic connection${isVisited('kidney_metabolic') ? ' (visited)' : ''}`"
                @click="selectRegion('kidney_metabolic')" @mouseenter="hoveredRegion = 'kidney_metabolic'" @mouseleave="hoveredRegion = null"
                @keydown.enter.prevent="selectRegion('kidney_metabolic')" @keydown.space.prevent="selectRegion('kidney_metabolic')" />
              <rect x="0" y="0" width="500" height="455" fill="transparent" clip-path="url(#ckmh5-clipHKM)" class="ck-region"
                role="button" tabindex="0" :aria-label="`All three connected${isVisited('center') ? ' (visited)' : ''}`"
                @click="selectRegion('center')" @mouseenter="hoveredRegion = 'center'" @mouseleave="hoveredRegion = null"
                @keydown.enter.prevent="selectRegion('center')" @keydown.space.prevent="selectRegion('center')" />

              <g :opacity="labelOpacity('heart')" pointer-events="none">
                <text x="127" y="138" class="ck-label" text-anchor="middle">Heart</text>
              </g>
              <g :opacity="labelOpacity('kidney')" pointer-events="none">
                <text x="368" y="138" class="ck-label" text-anchor="middle">Kidneys</text>
              </g>
              <g :opacity="labelOpacity('metabolic')" pointer-events="none">
                <text x="250" y="312" class="ck-label" text-anchor="middle">Metabolic</text>
              </g>

              <rect
                v-if="pulseRegion && shimmerClipPath"
                :key="`shimmer-${pulseKey}`"
                x="-220" y="-30" width="200" height="515"
                fill="url(#ckmh5-shimmer)" :clip-path="shimmerClipPath"
                class="ck-shimmer" pointer-events="none"
              />
              <circle
                v-for="(organ, i) in pulseLabelOrgans"
                :key="`pulse-${organ}-${pulseKey}`"
                :cx="labelCenter(organ).x" :cy="labelCenter(organ).y"
                r="20" fill="none" :stroke="regions[organ].color" stroke-width="3"
                class="ck-pulse"
                :style="{ animationDelay: `${i * 0.08}s` }"
                pointer-events="none"
              />
            </svg>
          </div>

          <transition name="ck-content" mode="out-in">
            <div v-if="activeRegion" :key="activeRegion" class="ck-panel" role="region" :aria-label="`${regions[activeRegion].label} health information`">
              <span class="ck-panel__chip" :style="{ color: regions[activeRegion].color, borderColor: regions[activeRegion].color }">
                {{ regions[activeRegion].label }}
              </span>
              <h3 class="ck-panel__headline">{{ regions[activeRegion].headline }}</h3>
              <p class="ck-panel__body">{{ regions[activeRegion].body[0] }}</p>
              <div class="ck-panel__callout" :style="{ borderLeftColor: regions[activeRegion].color }">
                <p class="ck-panel__callout-label">Why this matters to you</p>
                <p>{{ regions[activeRegion].callout }}</p>
              </div>
              <div class="ck-panel__nav">
                <button class="ck-panel__navbtn" @click="navigateRegion(-1)">← Prev</button>
                <span class="ck-panel__dots">
                  <button
                    v-for="(key, i) in regionKeys" :key="key"
                    class="ck-panel__dot"
                    :class="{ 'ck-panel__dot--active': i === activeRegionIndex, 'ck-panel__dot--visited': isVisited(key) }"
                    :style="i === activeRegionIndex ? { backgroundColor: regions[key].color } : {}"
                    :aria-label="regions[key].label"
                    @click="selectRegion(key)"
                  />
                </span>
                <button class="ck-panel__navbtn" @click="navigateRegion(1)">Next →</button>
              </div>
            </div>
          </transition>
        </div>

        <p v-if="visitedRegions.length > 0 && visitedRegions.length < 7" class="ck-progress">
          ✦ You've explored {{ visitedRegions.length }} of 7 — see the full connection →
        </p>
      </div>
    </section>

    <!-- ── Section 3 · Stats Game ── -->
    <section id="scope" ref="sec_scope" class="ck-section ck-section--alt">
      <div class="container">
        <SectionHeader :num="data.stats.sectionNum" :title="data.stats.sectionTitle" :purpose="data.stats.sectionPurpose" />
        <p class="ck-lead">{{ data.stats.intro }}</p>

        <div class="ck-stats-grid">
          <div v-for="stat in data.stats.items" :key="stat.id" class="ck-stat-card">
            <p class="ck-stat-card__prompt">{{ stat.prompt }}</p>

            <div v-if="!statRevealed[stat.id]">
              <div class="ck-stat-card__guess">
                <span class="ck-stat-card__guess-num">{{ statGuess[stat.id] || 50 }}</span>
                <span class="ck-stat-card__guess-unit">{{ stat.unit }}</span>
              </div>
              <input
                type="range" min="0" max="100"
                :value="statGuess[stat.id] || 50"
                @input="setStatGuess(stat.id, $event.target.valueAsNumber)"
                class="ck-stat-card__slider"
                :aria-label="`Your guess for: ${stat.prompt}`"
              />
              <button class="ck-stat-card__reveal" @click="revealStat(stat.id)">
                Reveal →
              </button>
            </div>

            <div v-else class="ck-stat-card__revealed">
              <div class="ck-stat-card__compare">
                <div>
                  <p class="ck-stat-card__cmp-label">YOU</p>
                  <p class="ck-stat-card__cmp-you">{{ statGuess[stat.id] }}{{ stat.unit }}</p>
                </div>
                <span class="ck-stat-card__arrow">→</span>
                <div>
                  <p class="ck-stat-card__cmp-label ck-stat-card__cmp-label--actual">ACTUAL</p>
                  <p class="ck-stat-card__cmp-actual">{{ stat.display }}</p>
                </div>
              </div>
              <p class="ck-stat-card__verdict" :style="{ color: statVerdict(stat).color }">
                {{ statVerdict(stat).label }}
              </p>
              <p class="ck-stat-card__context">{{ stat.context }}</p>
              <div class="ck-stat-card__bar">
                <div class="ck-stat-card__bar-diff" :style="statDiffStyle(stat)"></div>
                <div class="ck-stat-card__bar-actual" :style="{ left: stat.answer + '%' }"></div>
                <div class="ck-stat-card__bar-guess" :style="{ left: statGuess[stat.id] + '%' }"></div>
              </div>
            </div>
          </div>
        </div>

        <p class="ck-progress" :class="{ 'ck-progress--complete': statRevealedCount === data.stats.items.length }">
          {{ statRevealedCount === data.stats.items.length
            ? '✦ All revealed — surprised?'
            : `${statRevealedCount} of ${data.stats.items.length} revealed` }}
        </p>
      </div>
    </section>

    <!-- ── Section 4 · Know Your Numbers (flip cards) ── -->
    <section id="know" ref="sec_know" class="ck-section">
      <div class="container">
        <SectionHeader :num="data.knowYourNumbers.sectionNum" :title="data.knowYourNumbers.sectionTitle" :purpose="data.knowYourNumbers.sectionPurpose" />
        <p class="ck-lead">{{ data.knowYourNumbers.intro }}</p>

        <div class="ck-kyn-grid">
          <div
            v-for="(item, i) in data.knowYourNumbers.items" :key="i"
            class="ck-flip" :class="{ 'ck-flip--flipped': flippedCards[i] }"
            @click="toggleFlip(i)"
            tabindex="0"
            role="button"
            :aria-pressed="!!flippedCards[i]"
            :aria-label="`${item.name} — click to ${flippedCards[i] ? 'see description' : 'see healthy range and question to ask'}`"
            @keydown.enter.prevent="toggleFlip(i)"
            @keydown.space.prevent="toggleFlip(i)"
          >
            <div class="ck-flip__inner">
              <div class="ck-flip__face ck-flip__face--front">
                <span class="ck-flip__pill" :class="`ck-flip__pill--${item.region}`">
                  {{ regionGlyph(item.region) }} {{ item.region.charAt(0).toUpperCase() + item.region.slice(1) }}
                </span>
                <h4>{{ item.name }}</h4>
                <p class="ck-flip__desc">{{ item.desc }}</p>
                <p class="ck-flip__test">TEST · {{ item.test }}</p>
                <span class="ck-flip__hint">↻ flip</span>
              </div>
              <div class="ck-flip__face ck-flip__face--back">
                <p class="ck-flip__back-label">HEALTHY RANGE</p>
                <p class="ck-flip__healthy">{{ item.healthy }}</p>
                <p class="ck-flip__back-label">ASK YOUR DOCTOR</p>
                <p class="ck-flip__ask">{{ item.ask }}</p>
                <span class="ck-flip__hint">↺ back</span>
              </div>
            </div>
          </div>

          <div class="ck-flip ck-checklist">
            <p class="ck-checklist__count">{{ flippedCount }}/{{ data.knowYourNumbers.items.length }} FLIPPED</p>
            <h4>Build my checklist →</h4>
            <p class="ck-flip__desc">All 5 questions, ready to print and bring to your doctor.</p>
            <button
              class="ck-checklist__btn"
              :disabled="flippedCount < data.knowYourNumbers.checklistMin"
            >
              {{ flippedCount < data.knowYourNumbers.checklistMin
                ? `Flip ${data.knowYourNumbers.checklistMin - flippedCount} more first`
                : 'Print my checklist' }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Section 5 · Stages (interactive timeline) ── -->
    <section id="stages" ref="sec_stages" class="ck-section ck-section--alt">
      <div class="container">
        <SectionHeader :num="data.stages.sectionNum" :title="data.stages.sectionTitle" :purpose="data.stages.sectionPurpose" />
        <p class="ck-lead">{{ data.stages.intro }}</p>

        <div class="ck-stages-track" role="group" aria-label="CKM syndrome stages">
          <div class="ck-stages-line">
            <div class="ck-stages-fill" :style="{ width: ((activeStageIdx / (data.stages.items.length - 1)) * 100) + '%' }"></div>
            <button
              v-for="(s, i) in data.stages.items" :key="i"
              class="ck-stages-node"
              :class="{ 'ck-stages-node--active': i === activeStageIdx }"
              :style="{ left: ((i / (data.stages.items.length - 1)) * 100) + '%' }"
              @click="activeStageIdx = i"
              :aria-label="`Stage ${s.num}: ${s.name}`"
              :aria-pressed="i === activeStageIdx"
            >
              {{ i }}
            </button>
            <div
              v-for="(s, i) in data.stages.items" :key="`lbl-${i}`"
              class="ck-stages-tick"
              :class="{ 'ck-stages-tick--active': i === activeStageIdx }"
              :style="{ left: ((i / (data.stages.items.length - 1)) * 100) + '%' }"
            >
              {{ s.name }}
            </div>
          </div>
        </div>

        <transition name="ck-content" mode="out-in">
          <div :key="activeStageIdx" class="ck-stage-detail">
            <div class="ck-stage-detail__bar" :style="{ background: activeStage.color }"></div>
            <div class="ck-stage-detail__body">
              <p class="ck-stage-detail__num">STAGE {{ activeStage.num }}</p>
              <h3 class="ck-stage-detail__name">{{ activeStage.name }}</h3>
              <p class="ck-stage-detail__what">{{ activeStage.what }}</p>
              <p class="ck-stage-detail__helps">→ {{ activeStage.helps }}</p>
            </div>
          </div>
        </transition>

        <p class="ck-stages-closing">{{ data.stages.closing }}</p>
      </div>
    </section>

    <!-- ── Section 6 · Take Action (habit picker) ── -->
    <section id="act" ref="sec_act" class="ck-section">
      <div class="container">
        <SectionHeader :num="data.takeAction.sectionNum" :title="data.takeAction.sectionTitle" :purpose="data.takeAction.sectionPurpose" />
        <p class="ck-lead">{{ data.takeAction.intro }}</p>

        <div class="ck-le8">
          <button
            v-for="(t, i) in data.takeAction.tiles" :key="i"
            class="ck-tile"
            :class="{
              'ck-tile--picked': pickedTile === i,
              'ck-tile--dimmed': pickedTile !== null && pickedTile !== i,
            }"
            @click="pickTile(i)"
            :aria-pressed="pickedTile === i"
          >
            <span v-if="pickedTile === i" class="ck-tile__mark">★ picked</span>
            <div class="ck-tile__icon" aria-hidden="true">
              <span>{{ tileGlyph(i) }}</span>
            </div>
            <h4>{{ t.name }}</h4>
            <p class="ck-tile__why">{{ t.why }}</p>
          </button>
        </div>

        <transition name="ck-commit">
          <div v-if="pickedTile !== null" class="ck-commit">
            <div v-if="!committed">
              <p class="ck-commit__label">YOUR FOCUS THIS WEEK</p>
              <h3 class="ck-commit__name">{{ data.takeAction.tiles[pickedTile].name }}</h3>
              <p class="ck-commit__suggest">
                Suggested first step: <strong>{{ data.takeAction.tiles[pickedTile].step }}</strong>
              </p>
              <div class="ck-commit__form">
                <label for="commit-input">This week, I will</label>
                <input
                  id="commit-input"
                  type="text"
                  v-model="commitment"
                  :placeholder="data.takeAction.tiles[pickedTile].step"
                />
                <span>.</span>
              </div>
              <button class="ck-commit__btn" :disabled="!commitment.trim()" @click="commit">
                Commit →
              </button>
            </div>
            <div v-else class="ck-commit__done">
              <p class="ck-commit__done-title">You're in. ✓</p>
              <p class="ck-commit__done-sub">We saved your commitment. Come back anytime — we'll remember where you left off.</p>
              <p class="ck-commit__quote">"{{ commitment }}"</p>
              <div class="ck-commit__actions">
                <button class="ck-commit__btn ck-commit__btn--ghost" @click="resetCommit">Change my pick</button>
                <button class="ck-commit__btn">Add to calendar</button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </section>

    <!-- ── Section 7 · Closing CTA ── -->
    <section id="cta" ref="sec_cta" class="ck-section ck-cta">
      <div class="container ck-cta__inner">
        <h2 class="ck-cta__title">{{ data.closingCta.title }}</h2>
        <p class="ck-cta__sub">{{ data.closingCta.subtitle }}</p>
        <div class="ck-cta__btns">
          <a :href="data.closingCta.primary.url" target="_blank" rel="noopener" class="ck-cta__btn ck-cta__btn--primary">
            {{ data.closingCta.primary.label }}
          </a>
          <a :href="data.closingCta.secondary.url" target="_blank" rel="noopener" class="ck-cta__btn">
            {{ data.closingCta.secondary.label }}
          </a>
          <button class="ck-cta__btn ck-cta__btn--ghost">{{ data.closingCta.tertiary.label }}</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { fullPageData } from '../data/ckmh-connections-full-page.js'

export default {
  name: 'CkmhConnectionsV5',
  props: {
    ckmhData: { type: Object, required: false, default: null },
  },
  data() {
    return {
      data: fullPageData,
      // Venn state
      activeRegion: 'center',
      hoveredRegion: null,
      visitedRegions: [],
      pulseRegion: null,
      pulseKey: 0,
      cursor: { x: null, y: null },
      regionKeys: [
        'center', 'heart', 'kidney', 'metabolic',
        'heart_kidney', 'heart_metabolic', 'kidney_metabolic',
      ],
      // Stats game
      statGuess: {},
      statRevealed: {},
      // Flip cards
      flippedCards: {},
      // Stages
      activeStageIdx: 1,
      // Take Action
      pickedTile: null,
      commitment: '',
      committed: false,
      // Page-level
      activeSection: 'intro',
      visitedSections: [],
      showReturnBanner: false,
      sectionObserver: null,
    }
  },
  computed: {
    regions() { return this.data.venn.regions },
    activeRegionIndex() { return this.regionKeys.indexOf(this.activeRegion) },
    statRevealedCount() { return Object.values(this.statRevealed).filter(Boolean).length },
    flippedCount() { return Object.values(this.flippedCards).filter(Boolean).length },
    activeStage() { return this.data.stages.items[this.activeStageIdx] },
    pulseLabelOrgans() {
      const map = {
        heart: ['heart'], kidney: ['kidney'], metabolic: ['metabolic'],
        heart_kidney: ['heart', 'kidney'],
        heart_metabolic: ['heart', 'metabolic'],
        kidney_metabolic: ['kidney', 'metabolic'],
        center: ['heart', 'kidney', 'metabolic'],
      }
      return this.pulseRegion ? map[this.pulseRegion] || [] : []
    },
    shimmerClipPath() {
      const map = {
        heart: 'ckmh5-clipH', kidney: 'ckmh5-clipK', metabolic: 'ckmh5-clipM',
        heart_kidney: 'ckmh5-clipHK', heart_metabolic: 'ckmh5-clipHM',
        kidney_metabolic: 'ckmh5-clipKM', center: 'ckmh5-clipHKM',
      }
      const id = map[this.pulseRegion]
      return id ? `url(#${id})` : ''
    },
    diagramTiltStyle() {
      if (this.cursor.x == null) return { '--tilt-x': '0deg', '--tilt-y': '0deg' }
      const cx = 250, cy = 227.5
      const dx = (this.cursor.x - cx) / cx
      const dy = (this.cursor.y - cy) / cy
      const max = 5
      return {
        '--tilt-x': `${(dy * max).toFixed(2)}deg`,
        '--tilt-y': `${(-dx * max).toFixed(2)}deg`,
      }
    },
  },
  watch: {
    activeRegion(newVal) {
      if (!newVal) return
      this.pulseRegion = newVal
      this.pulseKey++
    },
  },
  mounted() {
    this.loadFromCookie()
    this.setupSectionObserver()
  },
  beforeUnmount() {
    if (this.sectionObserver) this.sectionObserver.disconnect()
  },
  methods: {
    selectRegion(key) {
      this.activeRegion = key
      if (!this.visitedRegions.includes(key)) {
        this.visitedRegions.push(key)
        this.saveToCookie()
      }
    },
    navigateRegion(direction) {
      const len = this.regionKeys.length
      const next = (this.activeRegionIndex + direction + len) % len
      this.selectRegion(this.regionKeys[next])
    },
    isVisited(key) { return this.visitedRegions.includes(key) },
    circleOpacity(key) {
      const focus = this.hoveredRegion || this.activeRegion
      if (!focus) return 0.55
      return focus === key ? 0.78 : 0.25
    },
    overlapOpacity(key) {
      const focus = this.hoveredRegion || this.activeRegion
      if (!focus) return 0.72
      return focus === key ? 0.95 : 0.3
    },
    labelOpacity(key) {
      const focus = this.hoveredRegion || this.activeRegion
      if (!focus) return 1
      return focus === key ? 1 : 0.6
    },
    haloOpacity(key) {
      const focus = this.hoveredRegion || this.activeRegion
      if (!focus) return 0
      const map = {
        heart: ['heart', 'heart_kidney', 'heart_metabolic', 'center'],
        kidney: ['kidney', 'heart_kidney', 'kidney_metabolic', 'center'],
        metabolic: ['metabolic', 'heart_metabolic', 'kidney_metabolic', 'center'],
      }
      return map[key].includes(focus) ? 0.55 : 0
    },
    labelCenter(organ) {
      const centers = {
        heart: { x: 127, y: 107 },
        kidney: { x: 368, y: 107 },
        metabolic: { x: 250, y: 299 },
      }
      return centers[organ] || { x: 250, y: 200 }
    },
    circleCenter(organ) {
      const centers = {
        heart: { x: 175, y: 145 },
        kidney: { x: 325, y: 145 },
        metabolic: { x: 250, y: 270 },
      }
      return centers[organ] || { x: 250, y: 200 }
    },
    onDiagramMouseMove(e) {
      const svg = e.currentTarget
      const ctm = svg.getScreenCTM()
      if (!ctm) return
      const pt = svg.createSVGPoint()
      pt.x = e.clientX
      pt.y = e.clientY
      const p = pt.matrixTransform(ctm.inverse())
      this.cursor = { x: p.x, y: p.y }
    },
    onDiagramMouseLeave() { this.cursor = { x: null, y: null } },
    magneticTransform(key) {
      if (this.cursor.x == null) return 'translate(0 0)'
      const c = this.circleCenter(key)
      const dx = this.cursor.x - c.x
      const dy = this.cursor.y - c.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      const radius = 180
      if (dist > radius) return 'translate(0 0)'
      const pull = (1 - dist / radius) * 3
      const norm = Math.max(dist, 0.01)
      return `translate(${((dx / norm) * pull).toFixed(2)} ${((dy / norm) * pull).toFixed(2)})`
    },
    setStatGuess(id, val) {
      this.statGuess = { ...this.statGuess, [id]: val }
    },
    revealStat(id) {
      if (this.statGuess[id] === undefined) {
        this.statGuess = { ...this.statGuess, [id]: 50 }
      }
      this.statRevealed = { ...this.statRevealed, [id]: true }
    },
    statVerdict(stat) {
      const guess = this.statGuess[stat.id] ?? 50
      const diff = Math.abs(guess - stat.answer)
      if (diff <= 5) return { label: 'Spot on!', color: '#2D8B3F' }
      if (diff <= 15) return { label: 'Pretty close', color: '#D4943A' }
      if (diff <= 30) return { label: 'Surprised?', color: '#C10E21' }
      return { label: 'Way off — most people are.', color: '#C10E21' }
    },
    statDiffStyle(stat) {
      const guess = this.statGuess[stat.id] ?? 50
      const left = Math.min(guess, stat.answer)
      const width = Math.abs(guess - stat.answer)
      return { left: left + '%', width: width + '%' }
    },
    toggleFlip(i) {
      this.flippedCards = { ...this.flippedCards, [i]: !this.flippedCards[i] }
      this.saveToCookie()
    },
    regionGlyph(region) {
      return region === 'heart' ? '♥' : region === 'kidney' ? '◆' : '✦'
    },
    pickTile(i) {
      this.pickedTile = i
      this.committed = false
    },
    commit() {
      if (!this.commitment.trim()) return
      this.committed = true
      this.saveToCookie()
    },
    resetCommit() {
      this.pickedTile = null
      this.commitment = ''
      this.committed = false
    },
    tileGlyph(i) {
      return ['🥗', '🚶', '🚭', '😴', '⚖️', '🩸', '🍬', '💗'][i] || '◯'
    },
    setupSectionObserver() {
      if (typeof IntersectionObserver === 'undefined') return
      const ids = this.data.nav.map((n) => n.id)
      const targets = ids
        .map((id) => this.$refs['sec_' + id])
        .filter(Boolean)
      this.sectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.activeSection = entry.target.id
              if (!this.visitedSections.includes(entry.target.id)) {
                this.visitedSections.push(entry.target.id)
                this.saveToCookie()
              }
            }
          })
        },
        { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
      )
      targets.forEach((t) => this.sectionObserver.observe(t))
    },
    resumeSession() {
      this.showReturnBanner = false
      const last = this.visitedSections[this.visitedSections.length - 1]
      if (last) {
        const el = document.getElementById(last)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }
    },
    loadFromCookie() {
      const match = document.cookie.match(/(?:^|;\s*)ckmh5_state=([^;]*)/)
      if (!match) return
      try {
        const parsed = JSON.parse(decodeURIComponent(match[1]))
        if (Array.isArray(parsed.visitedRegions)) this.visitedRegions = parsed.visitedRegions
        if (Array.isArray(parsed.visitedSections)) this.visitedSections = parsed.visitedSections
        if (parsed.flippedCards && typeof parsed.flippedCards === 'object') this.flippedCards = parsed.flippedCards
        if (typeof parsed.commitment === 'string') this.commitment = parsed.commitment
        if (typeof parsed.pickedTile === 'number') this.pickedTile = parsed.pickedTile
        if (parsed.committed) this.committed = true
        if (this.visitedSections.length > 1) this.showReturnBanner = true
      } catch (_) { /* ignore */ }
    },
    saveToCookie() {
      const state = {
        visitedRegions: this.visitedRegions,
        visitedSections: this.visitedSections,
        flippedCards: this.flippedCards,
        commitment: this.commitment,
        pickedTile: this.pickedTile,
        committed: this.committed,
      }
      const value = encodeURIComponent(JSON.stringify(state))
      const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString()
      document.cookie = `ckmh5_state=${value}; expires=${expires}; path=/; SameSite=Lax`
    },
  },
  components: {
    SectionHeader: {
      props: ['num', 'title', 'purpose'],
      template: `
        <header class="ck-sec-head">
          <span class="ck-sec-num">SECTION · {{ num }}</span>
          <h2 class="ck-sec-title">{{ title }}</h2>
          <span class="ck-sec-purpose">{{ purpose }}</span>
        </header>
      `,
    },
  },
}
</script>

<style scoped>
.ck-fp {
  --ck-paper: #f9f9f9;
  --ck-paper-2: #f5f5f5;
  --ck-ink: #1a1a1a;
  --ck-ink-2: #3a3a3a;
  --ck-ink-soft: #6a6a6a;
  --ck-rule: #d2d2d2;
  --ck-accent: #c10e21;
  --ck-note: #dadada;

  background: var(--ck-paper);
  color: var(--ck-ink);
  font-family: 'Montserrat', system-ui, -apple-system, sans-serif;
  margin-block-start: -2.5rem;
}

.ck-fp .container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }

.ck-banner {
  position: sticky; top: 0; z-index: 30;
  background: var(--ck-note);
  padding: 0.75rem 1.25rem;
  border-bottom: 1px solid var(--ck-rule);  
}
.ck-banner__content {
  display: flex; align-items: center; gap: 0.75rem;
  justify-content: center;
  width: max-content;
  margin-inline: auto;
  font-size: 0.9rem;
}
.ck-banner__icon { font-size: 1.2rem; }
.ck-banner__action {
  margin-left: auto;
  border: none; background: none; cursor: pointer;
  font-weight: 600; color: var(--ck-accent);
  text-decoration: underline;
}
.ck-banner__dismiss {
  border: none; background: none; cursor: pointer;
  color: var(--ck-ink-soft); font-size: 1rem; padding: 0 0.25rem;
}
.ck-banner-enter-active, .ck-banner-leave-active { transition: all 0.25s ease; }
.ck-banner-enter-from, .ck-banner-leave-to { opacity: 0; transform: translateY(-100%); }

.ck-nav {
  position: sticky; top: 0; z-index: 20;
  display: flex; align-items: center; justify-content: center;
  padding: 0.75rem 1.5rem;
  background: var(--ck-paper);
  border-bottom: 1px solid var(--ck-rule);
  font-size: 0.85rem;
}
.ck-fp--has-banner .ck-nav { top: 50px; }

.ck-nav__list {
  display: flex; gap: 0.4rem; flex-wrap: wrap;
  list-style: none; margin: 0; padding: 0;
}
.ck-nav__chip {
  display: inline-flex; align-items: center; gap: 0.4rem;
  padding: 0.35rem 0.75rem;
  border: 1px solid var(--ck-rule); border-radius: 999px;
  text-decoration: none; color: var(--ck-ink-2);
  font-size: 0.8rem;
  transition: all 0.15s;
}
.ck-nav__chip:hover { border-color: var(--ck-ink-soft); color: var(--ck-ink); }
.ck-nav__chip--active { background: var(--ck-ink); color: var(--ck-paper); border-color: var(--ck-ink); }
.ck-nav__chip--visited:not(.ck-nav__chip--active)::before {
  content: '✓'; color: var(--ck-accent); font-weight: 700;
}
.ck-nav__chip-num {
  font-family: ui-monospace, monospace;
  font-size: 0.7rem; opacity: 0.7;
}

.ck-section {
  position: relative;
  padding: 5rem 0;
  border-bottom: 1px solid var(--ck-rule);
}
.ck-section--white { background: white; }
.ck-section--alt { background: var(--ck-paper-2); }

.ck-sec-head {
  display: flex; align-items: baseline; gap: 1rem;
  margin-bottom: 1.5rem; flex-wrap: wrap;
}
.ck-sec-num {
  font-family: ui-monospace, monospace;
  font-size: 0.7rem; letter-spacing: 0.18em; color: var(--ck-ink-soft);
  border: 1px solid var(--ck-rule); padding: 0.25rem 0.6rem; border-radius: 4px;
}
.ck-sec-title {
  font-size: 2.25rem; font-weight: 700; line-height: 1.1; margin: 0;
}
.ck-sec-purpose {
  font-family: ui-monospace, monospace;
  font-size: 0.75rem; color: var(--ck-ink-soft); margin-left: auto;
}
.ck-lead {
  font-size: 1.15rem; line-height: 1.55;
  max-width: 720px; color: var(--ck-ink-2);
  margin: 0 0 2rem;
}
.ck-progress {
  text-align: center; margin: 2rem 0 0;
  font-size: 0.95rem; color: var(--ck-ink-soft);
}
.ck-progress--complete { color: var(--ck-accent); font-weight: 600; }

.ck-hero {
  text-align: center; min-height: 60vh;
  display: flex; align-items: center; justify-content: center;
  padding: 6rem 0 5rem;
  background: white;
  overflow: hidden;
}
.ck-hero__inner { position: relative; z-index: 1; }
.ck-hero__overline {
  display: block;
  font-size: 0.85rem; letter-spacing: 0.2em; text-transform: uppercase;
  color: var(--ck-accent); font-weight: 600; margin-bottom: 1rem;
}
.ck-hero__title {
  font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 700;
  line-height: 1.05; margin: 0 auto 1.25rem;
  max-width: 18ch; text-wrap: balance;
}
.ck-hero__sub {
  max-width: 640px; margin: 0 auto 2rem;
  font-size: 1.1rem; line-height: 1.55; color: var(--ck-ink-2);
}
.ck-hero__scrollcue {
  display: inline-block;
  font-size: 0.9rem; color: var(--ck-ink-soft);
  text-decoration: none;
  animation: ck-bob 2s ease-in-out infinite;
}
.ck-hero__ambient {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  pointer-events: none; opacity: 0.5;
}
@keyframes ck-bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(6px); }
}

.ck-layout {
  display: grid; grid-template-columns: 1fr;
  gap: 2rem; align-items: center;
}
@media (min-width: 768px) {
  .ck-layout--open { grid-template-columns: 1.1fr 1fr; }
}
.ck-diagram-wrap {
  perspective: 1200px;
  display: flex; justify-content: center; align-items: center;
  padding: 1rem;
}
.ck-diagram {
  width: 100%; max-width: 480px; height: auto;
  display: block; overflow: visible;
  transform-origin: 50% 50%;
  transform: rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg));
  transition: transform 0.18s ease-out;
  animation: ck-svg-entry 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) both,
             ck-svg-breathe 5s ease-in-out 0.8s infinite;
}
@keyframes ck-svg-entry {
  0% { scale: 0.85; opacity: 0; }
  100% { scale: 1; opacity: 1; }
}
@keyframes ck-svg-breathe {
  0%, 100% { scale: 1; }
  50% { scale: 1.012; }
}

.ck-circle-base { pointer-events: none; transition: opacity 0.3s ease; }
.ck-region { cursor: pointer; outline: none; transition: opacity 0.2s ease; }
.ck-region:focus-visible { outline: 3px solid var(--ck-accent); outline-offset: 2px; }
.ck-label {
  font-size: 14px; font-weight: 700; fill: #2d2d2d;
  pointer-events: none; transition: opacity 0.3s ease;
}
.ck-halo {
  pointer-events: none;
  filter: blur(18px);
  transition: opacity 0.45s ease;
  transform-box: fill-box; transform-origin: 50% 50%;
  animation: ck-halo-pulse 3.2s ease-in-out infinite;
}
@keyframes ck-halo-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
.ck-pulse {
  transform-box: fill-box; transform-origin: 50% 50%;
  filter: blur(4px);
  animation: ck-pulse-grow 0.85s ease-out forwards;
}
@keyframes ck-pulse-grow {
  0% { transform: scale(0.5); opacity: 0.7; stroke-width: 9; }
  100% { transform: scale(5); opacity: 0; stroke-width: 1; }
}
.ck-shimmer {
  animation: ck-shimmer-sweep 0.9s cubic-bezier(0.5, 0, 0.4, 1) forwards;
  pointer-events: none;
}
@keyframes ck-shimmer-sweep {
  0% { transform: translateX(0) skewX(-18deg); opacity: 0; }
  20% { opacity: 1; }
  80% { opacity: 1; }
  100% { transform: translateX(740px) skewX(-18deg); opacity: 0; }
}

.ck-panel {
  border-left: 2px dashed var(--ck-rule);
  padding-left: 1.5rem;
  display: flex; flex-direction: column; gap: 1rem;
}
@media (max-width: 767px) {
  .ck-panel { border-left: none; border-top: 2px dashed var(--ck-rule); padding-left: 0; padding-top: 1.5rem; }
}
.ck-panel__chip {
  display: inline-block; padding: 0.25rem 0.7rem;
  border: 1.5px solid; border-radius: 999px;
  font-size: 0.7rem; letter-spacing: 0.1em;
  text-transform: uppercase; font-weight: 600;
  align-self: flex-start;
}
.ck-panel__headline {
  font-size: 1.6rem; font-weight: 700; line-height: 1.15; margin: 0;
}
.ck-panel__body { font-size: 0.95rem; line-height: 1.55; color: var(--ck-ink-2); margin: 0; }
.ck-panel__callout {
  border-left: 4px solid; padding: 0.75rem 1rem;
  background: var(--ck-paper-2); border-radius: 0 4px 4px 0;
}
.ck-panel__callout-label {
  font-size: 0.7rem; letter-spacing: 0.08em;
  text-transform: uppercase; color: var(--ck-ink-soft);
  margin: 0 0 0.4rem; font-weight: 600;
}
.ck-panel__callout p:last-child { font-size: 0.85rem; line-height: 1.5; margin: 0; }
.ck-panel__nav {
  display: flex; align-items: center; gap: 0.75rem;
  border-top: 1px solid var(--ck-rule); padding-top: 1rem; margin-top: auto;
}
.ck-panel__navbtn {
  border: none; background: none; cursor: pointer;
  color: var(--ck-accent); font-weight: 600; font-size: 0.85rem;
  padding: 0.25rem 0;
}
.ck-panel__dots { display: flex; gap: 0.4rem; flex: 1; justify-content: center; }
.ck-panel__dot {
  width: 10px; height: 10px; border-radius: 50%;
  background: #ddd; border: none; padding: 0; cursor: pointer;
  transition: all 0.2s;
}
.ck-panel__dot--visited { background: #aaa; }
.ck-panel__dot--active { transform: scale(1.3); }

.ck-content-enter-active { transition: transform 0.32s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.32s ease; }
.ck-content-leave-active { transition: transform 0.18s ease-in, opacity 0.18s ease-in; }
.ck-content-enter-from { opacity: 0; transform: translateY(0.6rem); }
.ck-content-leave-to { opacity: 0; transform: translateY(-0.4rem); }

.ck-stats-grid {
  display: grid; gap: 1.25rem;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}
.ck-stat-card {
  background: white; border: 1px solid var(--ck-rule); border-radius: 8px;
  padding: 1.5rem;
}
.ck-stat-card__prompt {
  font-size: 0.95rem; line-height: 1.4;
  color: var(--ck-ink-2); margin: 0 0 1rem;
}
.ck-stat-card__guess {
  display: flex; align-items: baseline; gap: 0.4rem; margin-bottom: 0.75rem;
}
.ck-stat-card__guess-num { font-size: 3rem; font-weight: 700; line-height: 1; }
.ck-stat-card__guess-unit { font-family: ui-monospace, monospace; font-size: 0.9rem; color: var(--ck-ink-soft); }
.ck-stat-card__slider {
  width: 100%; accent-color: var(--ck-accent);
  margin-bottom: 1rem;
}
.ck-stat-card__reveal {
  background: var(--ck-ink); color: white;
  border: none; padding: 0.5rem 1.25rem; border-radius: 4px;
  cursor: pointer; font-weight: 600; font-size: 0.9rem;
}
.ck-stat-card__compare {
  display: flex; align-items: baseline; gap: 1rem; margin-bottom: 0.75rem;
}
.ck-stat-card__cmp-label {
  font-family: ui-monospace, monospace; font-size: 0.65rem;
  letter-spacing: 0.1em; color: var(--ck-ink-soft); margin: 0;
}
.ck-stat-card__cmp-label--actual { color: var(--ck-accent); }
.ck-stat-card__cmp-you { font-size: 1.8rem; color: var(--ck-ink-soft); margin: 0; line-height: 1; }
.ck-stat-card__cmp-actual { font-size: 2.5rem; font-weight: 700; margin: 0; line-height: 1; }
.ck-stat-card__arrow { font-size: 1.25rem; color: var(--ck-ink-soft); }
.ck-stat-card__verdict { font-weight: 600; margin: 0.5rem 0 0.25rem; font-size: 1rem; }
.ck-stat-card__context { font-size: 0.85rem; color: var(--ck-ink-2); margin: 0 0 0.75rem; }
.ck-stat-card__bar {
  height: 6px; background: var(--ck-paper-2);
  border: 1px solid var(--ck-rule); border-radius: 3px;
  position: relative; margin-top: 0.75rem;
}
.ck-stat-card__bar-diff { position: absolute; height: 100%; background: var(--ck-accent); opacity: 0.4; }
.ck-stat-card__bar-actual { position: absolute; top: -3px; width: 2px; height: 12px; background: var(--ck-ink); }
.ck-stat-card__bar-guess { position: absolute; top: -3px; width: 2px; height: 12px; background: var(--ck-ink-soft); }

.ck-kyn-grid {
  display: grid; gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}
.ck-flip {
  perspective: 1000px;
  min-height: 220px; cursor: pointer;
  outline: none;
}
.ck-flip:focus-visible { outline: 3px solid var(--ck-accent); outline-offset: 2px; border-radius: 8px; }
.ck-flip__inner {
  position: relative; width: 100%; height: 100%; min-height: 220px;
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
.ck-flip--flipped .ck-flip__inner { transform: rotateY(180deg); }
.ck-flip__face {
  position: absolute; inset: 0;
  backface-visibility: hidden; -webkit-backface-visibility: hidden;
  background: white;
  border: 1px solid var(--ck-rule); border-radius: 8px;
  padding: 1.25rem;
  display: flex; flex-direction: column; gap: 0.6rem;
  transition: opacity 0.3s 0.15s;
}
.ck-flip__face--front { opacity: 1; }
.ck-flip__face--back {
  transform: rotateY(180deg);
  background: var(--ck-paper-2);
  opacity: 0;
}
.ck-flip--flipped .ck-flip__face--front { opacity: 0; }
.ck-flip--flipped .ck-flip__face--back { opacity: 1; }
.ck-flip h4 { font-size: 1.25rem; font-weight: 700; margin: 0; line-height: 1.1; }
.ck-flip__pill {
  align-self: flex-start;
  display: inline-flex; gap: 0.3rem; align-items: center;
  font-size: 0.7rem; padding: 0.2rem 0.6rem; border-radius: 999px;
  letter-spacing: 0.08em; text-transform: uppercase; font-weight: 600;
  border: 1px solid;
}
.ck-flip__pill--heart { background: rgba(224, 90, 109, 0.12); color: #8a2535; border-color: rgba(224, 90, 109, 0.3); }
.ck-flip__pill--kidney { background: rgba(58, 155, 165, 0.12); color: #1d5b62; border-color: rgba(58, 155, 165, 0.3); }
.ck-flip__pill--metabolic { background: rgba(212, 148, 58, 0.12); color: #6d4717; border-color: rgba(212, 148, 58, 0.3); }
.ck-flip__desc { font-size: 0.9rem; color: var(--ck-ink-2); margin: 0; line-height: 1.4; }
.ck-flip__test {
  font-family: ui-monospace, monospace; font-size: 0.7rem;
  color: var(--ck-ink-soft); letter-spacing: 0.1em;
  border-top: 1px dashed var(--ck-rule); padding-top: 0.5rem; margin: auto 0 0;
}
.ck-flip__hint {
  position: absolute; top: 0.75rem; right: 0.75rem;
  font-size: 0.7rem; color: var(--ck-ink-soft); font-family: ui-monospace, monospace;
}
.ck-flip__back-label {
  font-family: ui-monospace, monospace; font-size: 0.65rem;
  letter-spacing: 0.18em; color: var(--ck-ink-soft); margin: 0;
}
.ck-flip__healthy { font-size: 1.6rem; font-weight: 700; line-height: 1; margin: 0.25rem 0 0.75rem; }
.ck-flip__ask { font-size: 1rem; color: var(--ck-accent); font-style: italic; margin: 0.25rem 0 0; line-height: 1.3; }
.ck-checklist {
  background: var(--ck-note); border: 1.5px dashed var(--ck-ink);
  padding: 1.25rem; border-radius: 8px;
  display: flex; flex-direction: column; gap: 0.5rem;
  cursor: default;
}
.ck-checklist__count { font-family: ui-monospace, monospace; font-size: 0.7rem; color: var(--ck-ink-soft); margin: 0; letter-spacing: 0.1em; }
.ck-checklist__btn {
  margin-top: auto;
  background: var(--ck-ink); color: white;
  border: none; padding: 0.5rem 1rem; border-radius: 4px;
  cursor: pointer; font-weight: 600; font-size: 0.9rem;
}
.ck-checklist__btn:disabled { background: var(--ck-ink-soft); cursor: not-allowed; }

.ck-stages-track {
  position: relative;
  padding: 3rem 1rem 4rem;
}
.ck-stages-line {
  position: relative;
  height: 6px; background: var(--ck-rule); border-radius: 3px;
}
.ck-stages-fill {
  position: absolute; inset: 0;
  background: linear-gradient(90deg, #A8D5A8, #D4943A, #E05A6D);
  border-radius: 3px; transition: width 0.3s;
}
.ck-stages-node {
  position: absolute; top: -15px; transform: translateX(-50%);
  width: 36px; height: 36px; border-radius: 50%;
  border: 2px solid var(--ck-ink); background: white;
  cursor: pointer; font-family: ui-monospace, monospace;
  font-size: 0.85rem; font-weight: 600;
  transition: all 0.2s;
}
.ck-stages-node--active {
  background: var(--ck-ink); color: white;
  box-shadow: 2px 2px 0 var(--ck-rule);
}
.ck-stages-tick {
  position: absolute; top: 24px; transform: translateX(-50%);
  font-family: ui-monospace, monospace; font-size: 0.65rem;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--ck-ink-soft); white-space: nowrap;
}
.ck-stages-tick--active { color: var(--ck-ink); font-weight: 600; }

.ck-stage-detail {
  position: relative;
  background: white;
  border: 1px solid var(--ck-rule); border-radius: 8px;
  overflow: hidden; min-height: 180px;
}
.ck-stage-detail__bar { position: absolute; left: 0; top: 0; width: 8px; height: 100%; }
.ck-stage-detail__body { padding: 1.5rem 1.5rem 1.5rem 2rem; }
.ck-stage-detail__num { font-family: ui-monospace, monospace; font-size: 0.7rem; letter-spacing: 0.18em; color: var(--ck-ink-soft); margin: 0; }
.ck-stage-detail__name { font-size: 2rem; font-weight: 700; line-height: 1; margin: 0.5rem 0 0.75rem; }
.ck-stage-detail__what { font-size: 0.95rem; line-height: 1.55; color: var(--ck-ink-2); max-width: 640px; margin: 0; }
.ck-stage-detail__helps {
  display: inline-block; margin-top: 1rem;
  background: var(--ck-note); padding: 0.5rem 1rem; border-radius: 4px;
  font-weight: 600; color: var(--ck-ink);
}
.ck-stages-closing {
  text-align: center; font-style: italic;
  color: var(--ck-ink-2); margin: 2rem 0 0;
  font-size: 1rem;
}

.ck-le8 {
  display: grid; gap: 0.8rem;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  margin-bottom: 2rem;
}
@media (min-width: 900px) { .ck-le8 { grid-template-columns: repeat(4, 1fr); } }
.ck-tile {
  position: relative;
  background: white; border: 1px solid var(--ck-rule); border-radius: 8px;
  padding: 1rem; cursor: pointer;
  display: flex; flex-direction: column; gap: 0.5rem;
  align-items: flex-start; text-align: left;
  min-height: 140px;
  transition: all 0.2s;
}
.ck-tile h4 { font-size: 1.1rem; font-weight: 700; margin: 0; line-height: 1.15; }
.ck-tile__why { font-size: 0.8rem; color: var(--ck-ink-soft); margin: 0; line-height: 1.35; }
.ck-tile__icon {
  width: 40px; height: 40px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.4rem;
  background: var(--ck-paper-2); border-radius: 8px;
}
.ck-tile--picked {
  background: var(--ck-note);
  box-shadow: 4px 4px 0 var(--ck-ink);
  transform: translate(-2px, -2px);
}
.ck-tile--dimmed { opacity: 0.45; }
.ck-tile__mark {
  position: absolute; top: 0.5rem; right: 0.6rem;
  font-size: 0.75rem; color: var(--ck-accent); font-weight: 600;
}

.ck-commit {
  border: 2px dashed var(--ck-ink); border-radius: 8px;
  padding: 1.75rem;
  background: var(--ck-paper-2);
}
.ck-commit__label { font-family: ui-monospace, monospace; font-size: 0.7rem; letter-spacing: 0.18em; color: var(--ck-ink-soft); margin: 0; }
.ck-commit__name { font-size: 2rem; font-weight: 700; line-height: 1; margin: 0.4rem 0 0.75rem; }
.ck-commit__suggest { font-size: 0.95rem; color: var(--ck-ink-2); margin: 0 0 1rem; }
.ck-commit__form { display: flex; align-items: baseline; gap: 0.5rem; flex-wrap: wrap; font-size: 1.1rem; }
.ck-commit__form label { font-weight: 600; }
.ck-commit__form input {
  flex: 1; min-width: 220px;
  border: none; border-bottom: 2px solid var(--ck-ink);
  background: transparent; padding: 0.25rem 0.1rem;
  font-size: 1.1rem; outline: none; color: var(--ck-ink);
}
.ck-commit__form input:focus { border-bottom-color: var(--ck-accent); }
.ck-commit__btn {
  margin-top: 1rem; background: var(--ck-ink); color: white;
  border: none; padding: 0.6rem 1.5rem; border-radius: 4px;
  cursor: pointer; font-weight: 600; font-size: 1rem;
}
.ck-commit__btn:disabled { background: var(--ck-ink-soft); cursor: not-allowed; }
.ck-commit__btn--ghost {
  background: transparent; color: var(--ck-ink);
  border: 1.5px dashed var(--ck-ink);
}
.ck-commit__done { text-align: center; padding: 1rem 0; }
.ck-commit__done-title { font-size: 2.5rem; font-weight: 700; margin: 0; line-height: 1; }
.ck-commit__done-sub { color: var(--ck-ink-2); max-width: 480px; margin: 1rem auto; font-size: 0.95rem; line-height: 1.55; }
.ck-commit__quote {
  display: inline-block;
  background: var(--ck-note); padding: 0.75rem 1rem;
  font-size: 1.1rem; transform: rotate(-0.5deg);
  box-shadow: 2px 2px 0 var(--ck-rule); margin: 1rem 0;
}
.ck-commit__actions { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }
.ck-commit-enter-active, .ck-commit-leave-active { transition: all 0.3s ease; }
.ck-commit-enter-from, .ck-commit-leave-to { opacity: 0; transform: translateY(0.5rem); }

.ck-cta {
  background: var(--ck-ink); color: white;
  text-align: center; padding: 5rem 0;
  border-bottom: none;
}
.ck-cta__inner { max-width: 720px; }
.ck-cta__title { font-size: clamp(2rem, 4vw, 3rem); font-weight: 700; line-height: 1.1; margin: 0 0 1rem; text-wrap: balance; }
.ck-cta__sub { opacity: 0.85; font-size: 1.1rem; margin: 0 0 2rem; }
.ck-cta__btns { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }
.ck-cta__btn {
  background: white; color: var(--ck-ink);
  border: none; padding: 0.7rem 1.5rem; border-radius: 4px;
  text-decoration: none; cursor: pointer;
  font-weight: 600; font-size: 1rem;
  transition: transform 0.15s;
}
.ck-cta__btn:hover { transform: translateY(-2px); }
.ck-cta__btn--primary { background: var(--ck-accent); color: white; }
.ck-cta__btn--ghost { background: transparent; color: white; border: 1.5px solid white; }

@media (prefers-reduced-motion: reduce) {
  .ck-diagram, .ck-halo, .ck-pulse, .ck-shimmer { animation: none; }
  .ck-diagram { transform: none; transition: none; }
  .ck-content-enter-active, .ck-content-leave-active,
  .ck-commit-enter-active, .ck-commit-leave-active,
  .ck-banner-enter-active, .ck-banner-leave-active { transition: none; }
  .ck-hero__scrollcue { animation: none; }
  .ck-flip__inner { transition: none; }
}

@media (max-width: 767px) {
  .ck-nav__list { display: none; }
  .ck-section { padding: 3rem 0; }
  .ck-sec-purpose { margin-left: 0; }
  .ck-stages-tick {
    font-size: 0.55rem;
    transform: translateX(-50%) rotate(-30deg);
    transform-origin: center;
  }
}
</style>
