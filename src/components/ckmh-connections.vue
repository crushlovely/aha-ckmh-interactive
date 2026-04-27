<template>
  <div class="ck-root">
    <!-- Hero -->
    <div class="ck-hero">
      <div class="ck-hero__container container">
        <div class="ck-hero__content">
          <span class="ck-hero__content__overline">American Heart Association</span>
          <h1 class="ck-hero__content__title">{{ regions ? ckmhData.hero.title : '' }}</h1>
          <div class="ck-hero__content__text">
            <p>{{ ckmhData.hero.subtitle }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Body -->
    <div class="ck-body">
      <div class="ck-body__container container">
        <div class="ck-body__wrapper">
          <!-- Diagram + Panel layout -->
          <div class="ck-layout" :class="{ 'ck-layout--open': activeRegion }">
            <!-- Venn Diagram -->
            <div class="ck-diagram-wrap">
              <svg
                class="ck-diagram"
                viewBox="0 0 500 455"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label="Interactive Venn diagram showing connections between Heart, Kidney, and Metabolic health"
              >
                <defs>
                  <!-- Individual circle clip paths -->
                  <clipPath id="ckmh-clipH">
                    <circle cx="175" cy="145" r="130" />
                  </clipPath>
                  <clipPath id="ckmh-clipK">
                    <circle cx="325" cy="145" r="130" />
                  </clipPath>
                  <clipPath id="ckmh-clipM">
                    <circle cx="250" cy="270" r="130" />
                  </clipPath>
                  <!-- Pairwise intersection clip paths -->
                  <clipPath id="ckmh-clipHK" clip-path="url(#ckmh-clipK)">
                    <circle cx="175" cy="145" r="130" />
                  </clipPath>
                  <clipPath id="ckmh-clipHM" clip-path="url(#ckmh-clipM)">
                    <circle cx="175" cy="145" r="130" />
                  </clipPath>
                  <clipPath id="ckmh-clipKM" clip-path="url(#ckmh-clipM)">
                    <circle cx="325" cy="145" r="130" />
                  </clipPath>
                  <!-- Triple intersection -->
                  <clipPath id="ckmh-clipHKM" clip-path="url(#ckmh-clipHK)">
                    <circle cx="250" cy="270" r="130" />
                  </clipPath>
                </defs>

                <!-- BASE CIRCLES (visual fill only, no pointer events) -->
                <circle
                  cx="175"
                  cy="145"
                  r="130"
                  :fill="regions.heart.color"
                  :opacity="circleOpacity('heart')"
                  class="ck-circle-base"
                />
                <circle
                  cx="325"
                  cy="145"
                  r="130"
                  :fill="regions.kidney.color"
                  :opacity="circleOpacity('kidney')"
                  class="ck-circle-base"
                />
                <circle
                  cx="250"
                  cy="270"
                  r="130"
                  :fill="regions.metabolic.color"
                  :opacity="circleOpacity('metabolic')"
                  class="ck-circle-base"
                />

                <!-- OVERLAP FILLS (visual only) -->
                <rect
                  x="0"
                  y="0"
                  width="500"
                  height="455"
                  :fill="regions.heart_kidney.color"
                  :opacity="overlapOpacity('heart_kidney')"
                  clip-path="url(#ckmh-clipHK)"
                  class="ck-circle-base"
                />
                <rect
                  x="0"
                  y="0"
                  width="500"
                  height="455"
                  :fill="regions.heart_metabolic.color"
                  :opacity="overlapOpacity('heart_metabolic')"
                  clip-path="url(#ckmh-clipHM)"
                  class="ck-circle-base"
                />
                <rect
                  x="0"
                  y="0"
                  width="500"
                  height="455"
                  :fill="regions.kidney_metabolic.color"
                  :opacity="overlapOpacity('kidney_metabolic')"
                  clip-path="url(#ckmh-clipKM)"
                  class="ck-circle-base"
                />
                <rect
                  x="0"
                  y="0"
                  width="500"
                  height="455"
                  :fill="regions.center.color"
                  :opacity="overlapOpacity('center')"
                  clip-path="url(#ckmh-clipHKM)"
                  class="ck-circle-base"
                />

                <!-- INTERACTIVE HIT AREAS (stacked bottom → top, most specific on top) -->

                <!-- Heart (individual) -->
                <rect
                  x="0"
                  y="0"
                  width="500"
                  height="455"
                  fill="transparent"
                  clip-path="url(#ckmh-clipH)"
                  class="ck-region"
                  :class="{
                    'ck-region--active': activeRegion === 'heart',
                    'ck-region--hovered': hoveredRegion === 'heart',
                  }"
                  role="button"
                  tabindex="0"
                  :aria-label="`Heart health — click to learn more${isVisited('heart') ? ' (visited)' : ''}`"
                  :aria-pressed="activeRegion === 'heart'"
                  @click="selectRegion('heart')"
                  @mouseenter="hoveredRegion = 'heart'"
                  @mouseleave="hoveredRegion = null"
                  @keydown.enter.prevent="selectRegion('heart')"
                  @keydown.space.prevent="selectRegion('heart')"
                />

                <!-- Kidney (individual) -->
                <rect
                  x="0"
                  y="0"
                  width="500"
                  height="455"
                  fill="transparent"
                  clip-path="url(#ckmh-clipK)"
                  class="ck-region"
                  :class="{
                    'ck-region--active': activeRegion === 'kidney',
                    'ck-region--hovered': hoveredRegion === 'kidney',
                  }"
                  role="button"
                  tabindex="0"
                  :aria-label="`Kidney health — click to learn more${isVisited('kidney') ? ' (visited)' : ''}`"
                  :aria-pressed="activeRegion === 'kidney'"
                  @click="selectRegion('kidney')"
                  @mouseenter="hoveredRegion = 'kidney'"
                  @mouseleave="hoveredRegion = null"
                  @keydown.enter.prevent="selectRegion('kidney')"
                  @keydown.space.prevent="selectRegion('kidney')"
                />

                <!-- Metabolic (individual) -->
                <rect
                  x="0"
                  y="0"
                  width="500"
                  height="455"
                  fill="transparent"
                  clip-path="url(#ckmh-clipM)"
                  class="ck-region"
                  :class="{
                    'ck-region--active': activeRegion === 'metabolic',
                    'ck-region--hovered': hoveredRegion === 'metabolic',
                  }"
                  role="button"
                  tabindex="0"
                  :aria-label="`Metabolic health — click to learn more${isVisited('metabolic') ? ' (visited)' : ''}`"
                  :aria-pressed="activeRegion === 'metabolic'"
                  @click="selectRegion('metabolic')"
                  @mouseenter="hoveredRegion = 'metabolic'"
                  @mouseleave="hoveredRegion = null"
                  @keydown.enter.prevent="selectRegion('metabolic')"
                  @keydown.space.prevent="selectRegion('metabolic')"
                />

                <!-- Heart + Kidney overlap -->
                <rect
                  x="0"
                  y="0"
                  width="500"
                  height="455"
                  fill="transparent"
                  clip-path="url(#ckmh-clipHK)"
                  class="ck-region"
                  :class="{
                    'ck-region--active': activeRegion === 'heart_kidney',
                    'ck-region--hovered': hoveredRegion === 'heart_kidney',
                  }"
                  role="button"
                  tabindex="0"
                  :aria-label="`Heart and Kidney connection — click to learn more${isVisited('heart_kidney') ? ' (visited)' : ''}`"
                  :aria-pressed="activeRegion === 'heart_kidney'"
                  @click="selectRegion('heart_kidney')"
                  @mouseenter="hoveredRegion = 'heart_kidney'"
                  @mouseleave="hoveredRegion = null"
                  @keydown.enter.prevent="selectRegion('heart_kidney')"
                  @keydown.space.prevent="selectRegion('heart_kidney')"
                />

                <!-- Heart + Metabolic overlap -->
                <rect
                  x="0"
                  y="0"
                  width="500"
                  height="455"
                  fill="transparent"
                  clip-path="url(#ckmh-clipHM)"
                  class="ck-region"
                  :class="{
                    'ck-region--active': activeRegion === 'heart_metabolic',
                    'ck-region--hovered': hoveredRegion === 'heart_metabolic',
                  }"
                  role="button"
                  tabindex="0"
                  :aria-label="`Heart and Metabolic connection — click to learn more${isVisited('heart_metabolic') ? ' (visited)' : ''}`"
                  :aria-pressed="activeRegion === 'heart_metabolic'"
                  @click="selectRegion('heart_metabolic')"
                  @mouseenter="hoveredRegion = 'heart_metabolic'"
                  @mouseleave="hoveredRegion = null"
                  @keydown.enter.prevent="selectRegion('heart_metabolic')"
                  @keydown.space.prevent="selectRegion('heart_metabolic')"
                />

                <!-- Kidney + Metabolic overlap -->
                <rect
                  x="0"
                  y="0"
                  width="500"
                  height="455"
                  fill="transparent"
                  clip-path="url(#ckmh-clipKM)"
                  class="ck-region"
                  :class="{
                    'ck-region--active': activeRegion === 'kidney_metabolic',
                    'ck-region--hovered': hoveredRegion === 'kidney_metabolic',
                  }"
                  role="button"
                  tabindex="0"
                  :aria-label="`Kidney and Metabolic connection — click to learn more${isVisited('kidney_metabolic') ? ' (visited)' : ''}`"
                  :aria-pressed="activeRegion === 'kidney_metabolic'"
                  @click="selectRegion('kidney_metabolic')"
                  @mouseenter="hoveredRegion = 'kidney_metabolic'"
                  @mouseleave="hoveredRegion = null"
                  @keydown.enter.prevent="selectRegion('kidney_metabolic')"
                  @keydown.space.prevent="selectRegion('kidney_metabolic')"
                />

                <!-- Center — all three -->
                <rect
                  x="0"
                  y="0"
                  width="500"
                  height="455"
                  fill="transparent"
                  clip-path="url(#ckmh-clipHKM)"
                  class="ck-region"
                  :class="{
                    'ck-region--active': activeRegion === 'center',
                    'ck-region--hovered': hoveredRegion === 'center',
                  }"
                  role="button"
                  tabindex="0"
                  :aria-label="`All three connected — click to learn more${isVisited('center') ? ' (visited)' : ''}`"
                  :aria-pressed="activeRegion === 'center'"
                  @click="selectRegion('center')"
                  @mouseenter="hoveredRegion = 'center'"
                  @mouseleave="hoveredRegion = null"
                  @keydown.enter.prevent="selectRegion('center')"
                  @keydown.space.prevent="selectRegion('center')"
                />

                <!-- LABELS -->
                <!-- Heart label -->
                <g :opacity="labelOpacity('heart')" pointer-events="none">
                  <!-- Heart icon (34×34) centered at 110, 103 -->
                  <svg x="95" y="82" width="34" height="34" viewBox="0 0 500 500">
                    <path
                      d="M362.73,96.67c4.93-1.53,8.93-5.14,10.95-9.88,2.02-4.74,1.85-10.13-.45-14.75l-26.16-52.34c-2.97-5.95-9.05-9.71-15.71-9.71-64.71,0-102.51,49.35-123.77,95.17-6.46-11.82-8.66-28.52-8.88-34.67-.22-7.58-5.28-14.15-12.54-16.31l-56.08-16.69c-7.84-2.32-16.26,1.05-20.29,8.19-27.71,49.01,3.55,113.88,17.65,138.6-14.48,23.06-23.01,50-23.01,78.8,0,38.62,14.73,75.06,41.52,102.92,27.63,44.17,63.66,81.28,106.65,110.02.24.17,2.32,1.65,2.57,1.81,12.47,7.97,26.7,12.18,41.1,12.18,28.33,0,53.8-15.75,66.48-41.11,25.19-50.36,38.49-106.74,38.49-163.03v-22.77c0-57.77-33.35-109.2-84.31-133.44,21.05-24.43,44.5-32.55,45.77-32.97ZM135.47,75.74l29.38,8.73c1.87,12.92,7.06,32.38,18.97,47.41-11.9,6.21-22.64,14.02-32.24,22.97-10.9-22.14-22.04-53.93-16.11-79.12ZM366.15,263.08v22.77c0,50.88-12.03,101.82-34.79,147.32-6.69,13.39-20.12,21.7-35.06,21.7-7.71,0-15.38-2.31-21.47-6.16-.14-.1-2.1-1.5-2.25-1.6-38.83-25.96-71.11-59.07-95.99-98.41-.88-2.01-2.13-3.84-3.68-5.4-21.49-21.49-33.33-49.98-33.33-80.22,0-36.63,17.38-69.78,45.46-90.66-1.11,5.09-1.68,8.4-1.83,9.27-1.59,9.57,4.86,18.6,14.42,20.2,9.46,1.52,18.61-4.85,20.22-14.41.23-1.36,23.05-131.1,103.01-141.68l12.83,25.64c-20.34,11.1-52.39,34.84-70.91,80.33-9.11,22.36-13.77,64.44-8.84,98.7-5.2,10.26-29.23,34.35-49.44,51.57-7.37,6.3-8.25,17.38-1.97,24.75,3.48,4.08,8.41,6.17,13.38,6.17,4.02,0,8.07-1.38,11.38-4.2,5.31-4.52,24.38-21.12,39.89-38.28,10.61,17.16,12.14,38.8,3.55,57.14l-7.61,16.29c-4.1,8.78-.31,19.23,8.48,23.35,2.4,1.12,4.93,1.65,7.42,1.65,6.61,0,12.94-3.74,15.93-10.13l7.6-16.28c14.03-29.98,11.34-65.72-7.02-93.27-12.54-18.82-10.85-78.18-.23-104.22.81-1.98,1.83-3.55,2.7-5.42,41.02,17.66,68.15,57.94,68.15,103.47Z"
                      fill="#222222"
                    />
                  </svg>
                  <text x="114" y="132" class="ck-label" text-anchor="middle">Heart</text>
                </g>

                <!-- Kidney label -->
                <g :opacity="labelOpacity('kidney')" pointer-events="none">
                  <!-- Kidneys icon (34×34) centered at 388, 101 -->
                  <svg x="371" y="84" width="34" height="34" viewBox="0 0 500 500">
                    <path
                      d="M192.48,108.11c-8.43-17.66-26.58-39.75-65.16-44.56-43.91-5.43-79.35,13.1-99.52,52.37-31.94,62.26-19.19,174.58,24.57,221.77,22.25,27.1,50.12,42.02,76.06,42.02,8.68,0,17.15-1.68,25.12-5.13,26.26-11.38,39.93-38.8,35.65-71.55-1.24-9.32-2.95-18.41-4.65-27.3-.62-3.26-1.22-6.43-1.78-9.53,10.52,13.92,16.38,30.65,16.11,48.45l-1.19,104.96c-.11,9.71,7.67,17.66,17.38,17.78h.21c9.62,0,17.47-7.74,17.58-17.39l1.19-104.89c.46-30.77-11.2-59.78-32.79-81.7-5.74-5.83-12.05-10.84-18.72-15.23,1.18-3.46,2.61-6.86,4.66-10.17,14.52-23.41,21.32-66.37,5.29-99.9ZM120.07,199.43c-9.71,0-17.58,7.88-17.58,17.58s7.88,17.58,17.58,17.58c8.44,0,16.55,1.67,24.34,4.2.19,14.61,2.86,29.18,5.58,43.51,1.58,8.24,3.18,16.66,4.3,25.29,2.2,16.79-3.3,29.77-14.72,34.72-12.94,5.59-36.36,1.85-60.74-27.74-31.87-34.41-47.16-129.14-19.74-182.61,11.79-22.95,29.24-34.23,53.16-34.23,3.43,0,7.01.24,10.71.7,18.54,2.32,30.91,10.44,37.78,24.83,10.69,22.36,4.85,52.81-3.46,66.2-2.99,4.82-5.18,9.65-7.03,14.5-9.76-2.68-19.78-4.54-30.19-4.54Z"
                      fill="#222222"
                    />
                    <path
                      d="M372.71,63.55c-38.58,4.82-56.73,26.9-65.16,44.56-16.03,33.53-9.23,76.49,5.29,99.9,2.46,3.96,4.09,8.04,5.31,12.22-5.57,3.93-10.94,8.22-15.82,13.18-21.61,21.92-33.24,50.94-32.79,81.64l1.21,104.96c.11,9.64,7.97,17.38,17.58,17.38h.21c9.71-.11,17.49-8.08,17.38-17.79l-1.21-105.02c-.22-14.81,3.85-28.92,11.24-41.32-.16.83-.3,1.62-.46,2.46-1.69,8.89-3.41,17.98-4.65,27.3-4.28,32.75,9.39,60.17,35.65,71.55,7.99,3.47,16.48,5.14,25.21,5.14,25.87,0,53.57-14.78,75.28-41.25,44.44-47.98,57.19-160.3,25.25-222.56-20.17-39.28-55.63-57.88-99.52-52.37ZM420.52,315.37c-23.72,28.85-47.19,32.51-60.05,26.95-11.42-4.95-16.92-17.93-14.72-34.72,1.12-8.63,2.72-17.05,4.3-25.29,2.65-13.97,5.24-28.17,5.54-42.41,8.83-3.35,18.21-5.3,27.95-5.3s17.58-7.88,17.58-17.58-7.88-17.58-17.58-17.58c-11.57,0-22.69,2.24-33.43,5.53-1.91-5.18-4.18-10.35-7.37-15.49-8.31-13.39-14.15-43.84-3.46-66.2,6.87-14.39,19.23-22.51,37.78-24.83,29.58-3.62,50.39,7.29,63.88,33.53,27.43,53.47,12.13,148.2-20.42,183.4Z"
                      fill="#222222"
                    />
                  </svg>
                  <text x="388" y="132" class="ck-label" text-anchor="middle">Kidneys</text>
                </g>

                <!-- Metabolic label -->
                <g :opacity="labelOpacity('metabolic')" pointer-events="none">
                  <!-- Metabolic (lightning) icon (34×34) centered at 250, 299 -->
                  <svg x="233" y="282" width="34" height="34" viewBox="0 0 500 500">
                    <path
                      d="M165.65,490c-3.35,0-6.73-.94-9.73-2.85-7.2-4.61-10.19-13.65-7.15-21.65l57.74-151.93-118.36-19.39c-6.66-1.08-12.15-5.79-14.26-12.21-2.09-6.4-.45-13.46,4.27-18.26L321.44,15.43c5.96-6.12,15.41-7.18,22.65-2.59,7.2,4.61,10.19,13.65,7.15,21.65l-57.74,151.93,118.36,19.39c6.66,1.08,12.15,5.79,14.26,12.21,2.09,6.4.45,13.46-4.27,18.28l-67.57,68.94c-7,7.13-18.42,7.22-25.55.26-7.13-6.99-7.25-18.45-.26-25.58l43.2-44.07-105.84-17.34c-5.35-.87-10.04-4.12-12.74-8.82-2.71-4.68-3.16-10.35-1.24-15.44l34.88-91.77-158.4,161.65,105.85,17.34c5.35.87,10.04,4.12,12.74,8.82,2.71,4.68,3.16,10.35,1.24,15.44l-34.88,91.77,67.95-69.34c6.99-7.15,18.42-7.25,25.55-.28,7.13,6.99,7.25,18.42.26,25.55l-128.47,131.13c-3.49,3.58-8.19,5.44-12.92,5.44Z"
                      fill="#222222"
                    />
                  </svg>
                  <text x="250" y="332" class="ck-label" text-anchor="middle">Metabolic</text>
                </g>

                <!-- Overlap indicators -->
                <text
                  x="250"
                  y="120"
                  class="ck-overlap-indicator"
                  text-anchor="middle"
                  :opacity="overlapLabelOpacity('heart_kidney')"
                >
                  +
                </text>
                <text
                  x="170"
                  y="240"
                  class="ck-overlap-indicator"
                  text-anchor="middle"
                  :opacity="overlapLabelOpacity('heart_metabolic')"
                >
                  +
                </text>
                <text
                  x="320"
                  y="240"
                  class="ck-overlap-indicator"
                  text-anchor="middle"
                  :opacity="overlapLabelOpacity('kidney_metabolic')"
                >
                  +
                </text>
                <text
                  x="250"
                  y="202"
                  class="ck-overlap-indicator"
                  text-anchor="middle"
                  :opacity="overlapLabelOpacity('center')"
                >
                  ●
                </text>
              </svg>

              <!-- Hover preview -->
              <div
                class="ck-hover-preview"
                :class="{ 'ck-hover-preview--visible': hoveredRegion && !activeRegion }"
              >
                <span v-if="hoveredRegion">{{ regions[hoveredRegion].headline }}</span>
              </div>
            </div>

            <!-- Content Panel -->
            <transition name="ck-panel">
              <div
                v-if="activeRegion"
                class="ck-panel"
                role="dialog"
                aria-modal="true"
                :aria-label="`${regions[activeRegion].label} health information`"
                ref="panel"
              >
                <div class="ck-panel__inner">
                  <div class="ck-panel__content">
                    <div
                      class="ck-panel__region-label"
                      :style="{ color: regions[activeRegion].color }"
                    >
                      {{ regions[activeRegion].label }}
                    </div>

                    <h2 class="ck-panel__headline">{{ regions[activeRegion].headline }}</h2>

                    <div class="ck-panel__body">
                      <p v-for="(paragraph, i) in regions[activeRegion].body" :key="i">
                        {{ paragraph }}
                      </p>
                    </div>

                    <div
                      class="ck-panel__callout"
                      :style="{ borderLeftColor: regions[activeRegion].color }"
                    >
                      <p class="ck-panel__callout__label">Why this matters to you</p>
                      <p>{{ regions[activeRegion].callout }}</p>
                    </div>

                    <div
                      v-if="regions[activeRegion].stats && regions[activeRegion].stats.length"
                      class="ck-panel__stats"
                    >
                      <p class="ck-panel__stats__label">Key numbers</p>
                      <ul>
                        <li v-for="(stat, i) in regions[activeRegion].stats" :key="i">
                          {{ stat }}
                        </li>
                      </ul>
                    </div>

                    <a
                      v-if="regions[activeRegion].cta"
                      :href="regions[activeRegion].cta.url"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="ck-panel__cta btn btn-round btn-danger"
                    >
                      {{ regions[activeRegion].cta.label }}
                    </a>
                  </div>

                  <!-- Region navigation -->
                  <div class="ck-panel__nav">
                    <button class="ck-panel__nav__btn" @click="navigateRegion(-1)">← Prev</button>
                    <span class="ck-panel__nav__dots">
                      <button
                        v-for="(key, i) in regionKeys"
                        :key="key"
                        class="ck-panel__nav__dot"
                        :class="{
                          'ck-panel__nav__dot--active': i === activeRegionIndex,
                          'ck-panel__nav__dot--visited': isVisited(key),
                        }"
                        :style="
                          i === activeRegionIndex ? { backgroundColor: regions[key].color } : {}
                        "
                        :aria-label="regions[key].label"
                        @click="selectRegion(key)"
                      />
                    </span>
                    <button class="ck-panel__nav__btn" @click="navigateRegion(1)">Next →</button>
                  </div>
                </div>
              </div>
            </transition>
          </div>

          <!-- Completion nudge -->
          <transition name="ck-nudge">
            <div v-if="showNudge" class="ck-nudge">
              <p>
                You've explored {{ visitedRegions.length }} of 7 regions. Ready to see how
                everything connects?
              </p>
              <button
                class="ck-nudge__btn btn btn-round btn-danger"
                @click="selectRegion('center')"
              >
                Explore the full connection →
              </button>
              <button class="ck-nudge__dismiss" @click="showNudge = false" aria-label="Dismiss">
                ✕
              </button>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CkmhConnections',

  props: {
    ckmhData: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      activeRegion: 'center',
      hoveredRegion: null,
      visitedRegions: [],
      showNudge: false,
      regionKeys: [
        'center',
        'heart',
        'kidney',
        'metabolic',
        'heart_kidney',
        'heart_metabolic',
        'kidney_metabolic',
      ],
    }
  },

  computed: {
    regions() {
      return this.ckmhData.regions
    },
    activeRegionIndex() {
      return this.regionKeys.indexOf(this.activeRegion)
    },
  },

  mounted() {
    this.loadVisitedFromCookie()
  },

  methods: {
    selectRegion(key) {
      this.activeRegion = key
      if (!this.visitedRegions.includes(key)) {
        this.visitedRegions.push(key)
        this.saveVisitedToCookie()
      }
      this.$nextTick(() => {
        if (this.$refs.panel) {
          this.$refs.panel.focus()
        }
        this.checkNudge()
      })
    },

    navigateRegion(direction) {
      const len = this.regionKeys.length
      const next = (this.activeRegionIndex + direction + len) % len
      this.selectRegion(this.regionKeys[next])
    },

    isVisited(key) {
      return this.visitedRegions.includes(key)
    },

    checkNudge() {
      if (
        this.visitedRegions.length >= 4 &&
        !this.isVisited('center') &&
        this.activeRegion !== 'center'
      ) {
        this.showNudge = true
      }
    },

    circleOpacity(key) {
      const highlighted = this.hoveredRegion || this.activeRegion
      if (!highlighted) return 0.55
      return highlighted === key ? 0.78 : 0.5
    },

    overlapOpacity(key) {
      const highlighted = this.hoveredRegion || this.activeRegion
      if (!highlighted) return 0.72
      return highlighted === key ? 0.95 : 0.3
    },

    labelOpacity(key) {
      const highlighted = this.hoveredRegion || this.activeRegion
      if (!highlighted) return 1
      return highlighted === key ? 1 : 0.5
    },

    overlapLabelOpacity(key) {
      const highlighted = this.hoveredRegion || this.activeRegion
      if (!highlighted) return 0.7
      return highlighted === key ? 1 : 0.25
    },

    loadVisitedFromCookie() {
      const match = document.cookie.match(/(?:^|;\s*)ckmh_visited=([^;]*)/)
      if (match) {
        try {
          const parsed = JSON.parse(decodeURIComponent(match[1]))
          if (Array.isArray(parsed)) {
            this.visitedRegions = parsed
          }
        } catch (_) {}
      }
    },

    saveVisitedToCookie() {
      const value = encodeURIComponent(JSON.stringify(this.visitedRegions))
      const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString()
      document.cookie = `ckmh_visited=${value}; expires=${expires}; path=/; SameSite=Lax`
    },
  },
}
</script>

<style scoped>
/* ── Hero ── */
.ck-hero {
  padding: 1rem 0 7.5rem;
  margin-top: -2.5rem;
  background-color: #c10e21;
  background-image: url("data:image/svg+xml,%3Csvg width='570' height='763' viewBox='0 0 570 763' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg opacity='0.1'%3E%3Cpath d='M483.468 272.842C417.302 242.172 340.245 264.06 299.263 321.207C359.311 316.039 408.52 330.754 410.63 346.814L404.828 402.01L404.38 402.062C404.485 400.955 404.538 399.873 404.406 398.792C401.611 377.484 351.769 366.461 293.092 374.188C234.416 381.914 189.136 405.438 191.931 426.746C192.063 427.827 192.432 428.882 192.802 429.911L191.747 430.042L172.469 378.17C170.359 362.109 213.952 335.263 273.156 324.688C232.834 264.957 154.009 241.565 86.5245 272.842C6.69801 309.841 -31.4879 404.462 31.5399 516.066C76.3187 595.392 146.546 655.281 284.996 762.56C295.861 754.148 306.278 746.025 316.326 738.167C285.708 557.601 242.723 432.179 242.696 432.126C241.193 420.681 265.508 408.049 297.022 403.908C328.536 399.768 355.276 405.675 356.779 417.12C356.779 417.12 345.941 521.578 360.445 703.172C450.583 630.492 502.693 579.463 538.479 516.066C601.48 404.462 563.295 309.841 483.468 272.842Z' fill='black'/%3E%3Cpath d='M357.676 167.78C333.177 182.522 313.794 218.123 323.209 253.83C356.252 205.017 456.807 249.057 490.246 137.005C467.962 154.937 438.848 160.08 424.185 158.392C478.985 135.713 510.341 55.1213 461.29 0.03125C475.741 64.9842 393.119 70.6277 328.246 82.7586C206.383 105.702 186.525 218.572 241.8 276.167C235.418 207.839 289.822 167.095 357.676 167.78Z' fill='black'/%3E%3Cpath d='M286.315 322.628C220.545 331.278 170.228 360.946 172.47 378.166L191.747 430.065L192.802 429.933C192.406 428.905 192.064 427.85 191.932 426.769C189.136 405.461 234.416 381.937 293.093 374.21C351.769 366.484 401.611 377.507 404.407 398.815C404.539 399.896 404.486 401.004 404.38 402.085L404.829 402.032L410.63 346.837C408.363 329.616 352.059 313.978 286.315 322.628Z' fill='%239D3939'/%3E%3Cpath d='M360.419 703.174C345.915 521.58 356.754 417.122 356.754 417.122C355.25 405.677 328.483 399.77 296.996 403.91C265.482 408.05 241.167 420.682 242.671 432.127C242.697 432.18 285.682 557.603 316.3 738.169C331.964 725.906 346.627 714.276 360.419 703.174Z' fill='%239D3939'/%3E%3Cg style='mix-blend-mode:multiply'%3E%3Cpath d='M409.654 343.783C410.155 344.785 410.498 345.814 410.63 346.816L404.828 402.011L404.38 402.064C403.114 415.461 383.915 429.306 355.091 439.354C352.744 479.016 349.817 570.473 360.392 703.148C450.556 630.441 502.64 579.439 538.426 516.042C543.41 507.234 547.682 498.557 551.401 489.987L409.654 343.783Z' fill='url(%23paint0_linear_2318_6628)'/%3E%3C/g%3E%3C/g%3E%3Cdefs%3E%3ClinearGradient id='paint0_linear_2318_6628' x1='352.869' y1='523.483' x2='551.447' y2='523.483' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%23905848'/%3E%3Cstop offset='0.0215' stop-color='%23925B4B'/%3E%3Cstop offset='0.3599' stop-color='%23BA9284'/%3E%3Cstop offset='0.614' stop-color='%23D4B9AE'/%3E%3Cstop offset='0.753' stop-color='%23DEC9C0'/%3E%3Cstop offset='0.7834' stop-color='%23E3D1C9'/%3E%3Cstop offset='0.9115' stop-color='%23F5EDE9'/%3E%3Cstop offset='1' stop-color='%23FEFCFB'/%3E%3C/linearGradient%3E%3C/defs%3E%3C/svg%3E");
  background-size: auto 180%;
  background-position: -300px 50%;
  background-repeat: no-repeat;
  color: white;
}
@media (min-width: 46em) {
  .ck-hero {
    background-position: calc(((100vw - 1170px) / 2) - 175px) 50%;
  }
}
.ck-hero__content {
  padding: 3.65rem 0 2rem;
  margin: 0 auto;
}
.ck-hero__content__overline {
  display: grid;
  grid-template-columns: 2rem 1fr;
  align-items: center;
  gap: 0.125rem;
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.05rem;
  margin-bottom: 1.25rem;
  &::before {
    content: '';
    display: block;
    height: 1.75rem;
    width: 1.275rem;
    background-repeat: no-repeat;
    background-image: url('data:image/svg+xml,<svg id="heart_White" data-name="heart White" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24.41" height="32.567" viewBox="0 0 24.41 32.567"><defs><clipPath id="clip-path"><path id="Clip_2" data-name="Clip 2" d="M0,0H24.41V21.511H0Z" fill="none"/></clipPath></defs><g id="Group_3" data-name="Group 3" transform="translate(0 11.056)"><path id="Clip_2-2" data-name="Clip 2" d="M0,0H24.41V21.511H0Z" transform="translate(0 0)" fill="none"/><g id="Group_3-2" data-name="Group 3" transform="translate(0 0)" clip-path="url(%23clip-path)"><path id="Fill_1" data-name="Fill 1" d="M20.7.593A6.412,6.412,0,0,0,12.816,2.66c2.571-.221,4.679.407,4.77,1.094l-.248,2.358-.019,0a.635.635,0,0,0,0-.14c-.12-.91-2.254-1.381-4.767-1.051S8.1,6.258,8.219,7.168a.622.622,0,0,0,.037.135l-.045.006L7.386,5.092C7.3,4.406,9.163,3.259,11.7,2.807A6.411,6.411,0,0,0,3.706.593C.287,2.173-1.349,6.215,1.351,10.983c1.918,3.388,4.925,5.946,10.855,10.529q.7-.54,1.341-1.042A91.587,91.587,0,0,0,10.393,7.4h0c-.065-.489.977-1.028,2.326-1.205s2.5.076,2.559.564a73.956,73.956,0,0,0,.157,12.219c3.86-3.1,6.092-5.284,7.625-7.992C25.759,6.215,24.123,2.173,20.7.593" transform="translate(0 0)" fill="%23fff"/></g></g><path id="Fill_6" data-name="Fill 6" d="M6.223,7.153a3.409,3.409,0,0,0-1.478,3.668c1.417-2.081,5.727-.2,7.16-4.981a4.29,4.29,0,0,1-2.832.912A4.319,4.319,0,0,0,10.663,0c.62,2.77-2.922,3.01-5.7,3.528-5.223.978-6.075,5.791-3.705,8.246C.982,8.862,3.315,7.125,6.223,7.153" transform="translate(9.157)" fill="%23fff"/></svg>');
    background-size: contain;
  }
}
.ck-hero__content__title {
  font-size: 3.25rem;
  font-weight: 700;
  line-height: 1.25;
  margin-bottom: 1rem;
}
.ck-hero__content__text p {
  font-size: 1.125rem;
  line-height: 1.5;
  text-wrap: balance;
}

/* ── Body ── */
.ck-body {
  position: relative;
  background: #f7f5f2;
  padding: 0;
}
@media (min-width: 60em) {
  .ck-body {
    --desk-content-height: 800px;
  }
}
.ck-body__container {
  position: relative;
}
.ck-body__wrapper {
  position: relative;
  top: -7.5rem;
  padding-bottom: 4rem;
}

/* ── Layout ── */
.ck-layout {
  background: white;
  box-shadow: 0 0 2rem rgba(0, 0, 0, 0.1);
  display: grid;
}

@media (min-width: 60em) {
  .ck-layout {
    grid-template-columns: 1.2fr 1fr;
    min-height: var(--desk-content-height);
  }
  .ck-layout--open .ck-diagram-wrap {
  }
}

/* ── Diagram ── */
.ck-diagram-wrap {
  padding: 2rem 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}
.ck-diagram {
  width: 100%;
  max-width: 100%;
  height: auto;
  display: block;
  overflow: visible;
}

/* Larger, centered diagram when panel is closed on desktop */
@media (min-width: 60em) {
  .ck-layout:not(.ck-layout--open) .ck-diagram-wrap {
    justify-content: center;
    padding: 2rem;
  }
  .ck-layout:not(.ck-layout--open) .ck-diagram {
    /* max-width: 600px; */
  }
}

/* SVG base circles: no pointer events, just visual */
.ck-circle-base {
  pointer-events: none;
  transition: opacity 0.3s ease;
}

/* SVG interactive regions */
.ck-region {
  cursor: pointer;
  transition: opacity 0.2s ease;
  outline: none;
}
.ck-region:focus-visible {
  outline: 3px solid #c10e21;
  outline-offset: 2px;
}

/* SVG labels */
.ck-label {
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  fill: #2d2d2d;
  pointer-events: none;
  transition: opacity 0.3s ease;
  font-family: inherit;
}
.ck-overlap-indicator {
  font-size: 18px;
  font-weight: 700;
  fill: white;
  pointer-events: none;
  transition: opacity 0.3s ease;
  font-family: inherit;
}

/* Hover preview */
.ck-hover-preview {
  min-height: 1.5rem;
  margin-top: 0.75rem;
  font-size: 0.875rem;
  font-style: italic;
  color: #555;
  text-align: center;
  opacity: 0;
  transition: opacity 0.2s ease;
}
.ck-hover-preview--visible {
  opacity: 1;
}

/* ── Panel ── */
.ck-panel {
  position: relative;
  background: white;
  padding: 2rem 1.5rem 2.5rem;
  border-top: 1px solid #e2e2e2;
  flex: 1;
  outline: none;
}
@media (min-width: 60em) {
  .ck-panel {
    border-top: none;
    border-left: 1px solid #e2e2e2;
    padding: 2.5rem 2rem 2.5rem;
    max-height: var(--desk-content-height);
    overflow-y: auto;
  }
}

@media (min-width: 60em) {
  .ck-panel__inner {
    height: 100%;
    display: grid;
    grid-template-rows: 1fr auto;
  }
}

.ck-panel__region-label {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}
.ck-panel__headline {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1rem;
  color: #2d2d2d;
}
.ck-panel__body {
  margin-bottom: 1.25rem;
  & p {
    font-size: 0.85rem;
    line-height: 1.65;
    color: #333;
    margin-bottom: 0.75rem;
  }
  & p:last-child {
    margin-bottom: 0;
  }
}

.ck-panel__callout {
  border-left: 4px solid;
  padding: 0.75rem 1rem;
  background: #f7f5f2;
  margin-bottom: 1.25rem;
  border-radius: 0 4px 4px 0;
}
.ck-panel__callout__label {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #777;
  margin-bottom: 0.4rem;
}
.ck-panel__callout p:last-child {
  font-size: 0.8rem;
  line-height: 1.6;
  color: #333;
  margin: 0;
}

.ck-panel__stats {
  margin-bottom: 1.5rem;
}
.ck-panel__stats__label {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #777;
  margin-bottom: 0.5rem;
}
.ck-panel__stats ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.ck-panel__stats li {
  font-size: 0.8rem;
  line-height: 1.5;
  color: #333;
  padding: 0.3rem 0 0.3rem 1.25rem;
  position: relative;
}
.ck-panel__stats li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #c10e21;
  font-weight: 700;
}

.ck-panel__cta {
  display: inline-block;
  margin-bottom: 1.5rem;
  font-size: 0.8rem;
  text-decoration: none;
}

.ck-panel__nav {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-top: 1px solid #e2e2e2;
  padding-top: 1.25rem;
}
.ck-panel__nav__btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  color: #c10e21;
  font-weight: 600;
  padding: 0.25rem 0;
  white-space: nowrap;
}
.ck-panel__nav__btn:focus-visible {
  outline: 3px solid #c10e21;
  outline-offset: 2px;
  border-radius: 2px;
}
.ck-panel__nav__dots {
  display: flex;
  gap: 0.4rem;
  flex: 1;
  justify-content: center;
}
.ck-panel__nav__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ddd;
  border: 2px solid transparent;
  cursor: pointer;
  padding: 0;
  transition:
    background-color 0.2s,
    transform 0.2s;
}
.ck-panel__nav__dot:hover {
  transform: scale(1.3);
}
.ck-panel__nav__dot--visited {
  background: #aaa;
}
.ck-panel__nav__dot--active {
  transform: scale(1.3);
}
.ck-panel__nav__dot:focus-visible {
  outline: 3px solid #c10e21;
  outline-offset: 2px;
}

/* ── Panel transition ── */
.ck-panel-enter-active,
.ck-panel-leave-active {
  transition:
    transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.35s ease;
}
.ck-panel-enter-from,
.ck-panel-leave-to {
  opacity: 0;
  transform: translateY(1.5rem);
}
@media (min-width: 60em) {
  .ck-panel-enter-from,
  .ck-panel-leave-to {
    opacity: 0;
    transform: translateX(2rem);
  }
}

/* ── Completion nudge ── */
.ck-nudge {
  position: relative;
  margin-top: 1.5rem;
  padding: 1.25rem 3rem 1.25rem 1.5rem;
  background: #fff8e1;
  border: 1px solid #f0c040;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}
.ck-nudge p {
  margin: 0;
  font-size: 0.8rem;
  color: #333;
  flex: 1;
  min-width: 180px;
}
.ck-nudge__btn {
  font-size: 0.875rem;
  white-space: nowrap;
}
.ck-nudge__dismiss {
  position: absolute;
  top: 0.5rem;
  right: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  color: #888;
  line-height: 1;
}
.ck-nudge-enter-active,
.ck-nudge-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}
.ck-nudge-enter-from,
.ck-nudge-leave-to {
  opacity: 0;
  transform: translateY(0.5rem);
}

/* ── Reduced motion ── */
@media (prefers-reduced-motion: reduce) {
  .ck-circle-base,
  .ck-region,
  .ck-label,
  .ck-overlap-indicator,
  .ck-hover-preview,
  .ck-panel__nav__dot {
    transition: none;
  }
  .ck-panel-enter-active,
  .ck-panel-leave-active,
  .ck-nudge-enter-active,
  .ck-nudge-leave-active {
    transition: none;
  }
  .ck-panel-enter-from,
  .ck-panel-leave-to,
  .ck-nudge-enter-from,
  .ck-nudge-leave-to {
    transform: none;
  }
}
</style>
