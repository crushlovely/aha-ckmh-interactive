// Content for /v8 — Unified body, audience-aware, scale-anchored Venn.
//
// Resource URLs marked `placeholder: true` are best-guess heart.org destinations
// that need stakeholder validation before launch. Every persona-tailored CTA URL
// also currently points to heart.org/myCKMhealth — those will be replaced with
// real persona-specific destinations once the AHA team confirms.

export const PERSONAS = {
  curious: {
    id: 'curious',
    label: "I'm curious about CKM health",
    short: 'Curious',
  },
  diagnosed: {
    id: 'diagnosed',
    label: "I've recently been diagnosed",
    short: 'Diagnosed',
  },
  family: {
    id: 'family',
    label: 'Someone close to me has been diagnosed',
    short: 'Family',
  },
  clinician: {
    id: 'clinician',
    label: "I'm a healthcare professional",
    short: 'Clinician',
  },
}

export const PERSONA_ORDER = ['curious', 'diagnosed', 'family', 'clinician']

export const v8Content = {
  // Scene 1 — Audience selector
  whoAreYou: {
    overline: 'Welcome',
    headline: 'Tell us about you.',
    body: 'A quick question so we can shape what comes next. You can change this anytime.',
  },

  // Scene 2 — One body. One system.
  oneBody: {
    overline: 'CKM Health',
    headline: 'One body. One system.',
    body: 'Your heart, kidneys, and the way your body creates energy work together. When you take care of one, the others benefit too.',
    welcome: {
      curious: "You're going to learn how your body works as a team.",
      diagnosed: "Take a breath. Let's walk through what this means — and what you can do.",
      family: "Here's what your loved one is dealing with, and how you can help.",
      clinician: 'A patient-facing primer on CKM health messaging.',
    },
  },

  // Scene 3 — Three teammates (tap-to-explore)
  threeTeammates: {
    overline: 'Three teammates',
    headline: 'Heart. Kidneys. Metabolism.',
    body: 'Three systems, each with its own job, sharing the work. Tap each to see what it does.',
    continueCue: "Continue when you're ready",
    teammates: [
      {
        id: 'heart',
        region: 'heart',
        name: 'Heart',
        what: 'Pumps blood through your body, delivering oxygen and nutrients to every cell.',
      },
      {
        id: 'kidney',
        region: 'kidney',
        name: 'Kidneys',
        what: 'Filter waste from your blood, balance fluids, and help control your blood pressure.',
      },
      {
        id: 'metabolic',
        region: 'metabolic',
        name: 'Metabolism',
        what: 'Turns food into energy. Manages blood sugar, weight, and how you fuel your body.',
      },
    ],
  },

  // Scene 4 — Stat reveal (pinned interactive)
  guess: {
    overline: 'A quick question',
    framing: {
      curious: "Here's something most people don't realize.",
      diagnosed: "If this feels overwhelming — you're not alone.",
      family: "Most people don't know how common this is.",
      clinician: 'Patient-facing prevalence framing for context.',
    },
    question: 'How many U.S. adults have at least one risk factor for CKM syndrome?',
    revealCue: 'Tap to reveal',
    answer: '9 in 10',
    answerLine: 'Yes — nearly 9 in 10 of us have at least one risk factor.',
    answerSubLine:
      'Most adults are in the same boat. The connection between heart, kidney, and metabolic health means small changes can have big effects.',
    moreStats: [
      {
        big: '1 in 7',
        qual: "U.S. adults have kidney disease — and most don't know it.",
      },
      {
        big: 'More than half',
        qual: 'of U.S. adults have prediabetes or diabetes.',
      },
      { big: 'Nearly half', qual: 'of U.S. adults have high blood pressure.' },
      {
        big: 'Only 10%',
        qual: 'of U.S. adults have excellent CKM health today.',
      },
    ],
    closing: 'The good news: these factors can improve — together.',
  },

  // Scene 4.5 — Introducing the CKM Venn diagram
  vennIntro: {
    overline: 'A picture of the connection',
    headline: 'Introducing the CKM Venn diagram.',
    body: "Three circles — one each for heart, kidneys, and metabolism. Where they overlap is where they share the work. Next, we'll walk through the three connections, one pair at a time.",
  },

  // Scenes 5–7 — Connections
  connections: [
    {
      id: 'hk',
      overline: 'Connection 1 of 3',
      headline: 'Your heart and kidneys help each other.',
      body: 'When your heart is healthy, your kidneys work better. And when your kidneys are healthy, your heart has less to work against. Caring for one supports the other.',
    },
    {
      id: 'hm',
      overline: 'Connection 2 of 3',
      headline: 'Energy fuels your heart.',
      body: "How your body creates and uses energy directly shapes your heart's health. Steady blood sugar and a healthy weight keep the arteries that feed your heart strong.",
    },
    {
      id: 'km',
      overline: 'Connection 3 of 3',
      headline: 'Your kidneys filter what you eat.',
      body: 'Steady blood sugar and healthy blood pressure keep your kidneys filtering well. Take care of these, and your kidneys take care of you.',
    },
  ],

  // Scenes 8a–8f — CKM Syndrome stages
  ckmStages: {
    intro: {
      overline: 'CKM Syndrome',
      headline: 'CKM syndrome happens in stages.',
      body: "It's not a single disease — it's several connected conditions that can build on each other over time. Understanding the stages helps you act early.",
    },
    stages: [
      {
        id: 'stage0',
        overline: 'Stage 0 of 4',
        headline: 'Healthy.',
        body: 'No CKM risk factors. No kidney disease. No cardiovascular disease. Starting from a strong place.',
        whatHelps: "Regular checkups and Life's Essential 8 habits keep you here.",
      },
      {
        id: 'stage1',
        overline: 'Stage 1 of 4',
        headline: 'Risk factors present.',
        body: 'Early metabolic signals — elevated blood pressure, blood sugar, weight, or cholesterol — but no organ damage yet. This stage affects most U.S. adults.',
        whatHelps: 'Lifestyle changes now can often reverse this stage entirely.',
      },
      {
        id: 'stage2',
        overline: 'Stage 2 of 4',
        headline: 'Kidney involvement.',
        body: 'Kidney function begins to decline, or metabolic risk factors have become more severe. The kidneys and heart are beginning to feel the strain together.',
        whatHelps: 'Monitoring all five numbers, working with your care team, and medication when needed can slow progression.',
      },
      {
        id: 'stage3',
        overline: 'Stage 3 of 4',
        headline: 'Early heart signals.',
        body: 'Imaging or tests show early signs of cardiovascular disease — often with no symptoms yet. This is still a window for meaningful action.',
        whatHelps: 'Treatment plus lifestyle changes can slow or stop progression from here.',
      },
      {
        id: 'stage4',
        overline: 'Stage 4 of 4',
        headline: 'Cardiovascular disease.',
        body: 'A heart attack, stroke, heart failure, or another cardiovascular event has occurred alongside CKM risk factors. Managing all three systems together is critical.',
        whatHelps: 'Comprehensive care with your full care team, ongoing treatment, and lifestyle support.',
        closing: 'Many aspects of CKM syndrome are preventable, treatable, and sometimes reversible.',
      },
    ],
  },

  // Scene 8 — The shift
  shift: {
    overline: 'It can shift — both ways',
    headline: 'Connected health factors worsen together. They also improve together.',
    bodyWarn:
      'Risk factors compound. Heart problems, kidney problems, and metabolic problems often progress together — quietly, with few early symptoms.',
    bodyHope:
      'But the connection works in your favor too. Treating one factor often improves the others. CKM syndrome is preventable, treatable, and sometimes reversible.',
  },

  // Scene 9 — Take action with resources (Life's Essential 8)
  takeAction: {
    overline: 'Take action',
    headline: 'Eight habits. One body.',
    body: 'Improving even one helps your whole body. Tap any habit to see where to start.',
    habits: [
      {
        id: 'eat-better',
        name: 'Eat Better',
        why: 'What you eat shapes your blood pressure, blood sugar, weight, and cholesterol — all at once.',
        firstStep:
          'Add one vegetable to a meal today. Choose water over soda.',
        resources: [
          {
            label: 'Healthy eating basics',
            url: 'https://www.heart.org/healthy-living/healthy-eating',
            placeholder: true,
          },
        ],
      },
      {
        id: 'be-active',
        name: 'Be Active',
        why: 'Moving your body lowers blood pressure, balances blood sugar, and protects your heart.',
        firstStep: 'Move 30 minutes most days. Walks count. Stairs count.',
        resources: [
          {
            label: 'Fitness basics',
            url: 'https://www.heart.org/healthy-living/fitness',
            placeholder: true,
          },
        ],
      },
      {
        id: 'quit-tobacco',
        name: 'Quit Tobacco',
        why: 'Smoking damages every artery in your body. Quitting helps your heart, kidneys, and energy systems recover.',
        firstStep: 'If you smoke or vape, ask your doctor about quitting.',
        resources: [
          {
            label: 'Quit smoking & tobacco',
            url: 'https://www.heart.org/healthy-living/healthy-lifestyle/quit-smoking-tobacco',
            placeholder: true,
          },
        ],
      },
      {
        id: 'sleep',
        name: 'Get Healthy Sleep',
        why: 'Poor sleep raises blood pressure, disturbs blood sugar, and stresses your heart.',
        firstStep: 'Aim for 7 to 9 hours. Same bedtime each night.',
        resources: [
          {
            label: 'Sleep & heart health',
            url: 'https://www.heart.org/healthy-living/healthy-lifestyle/sleep',
            placeholder: true,
          },
        ],
      },
      {
        id: 'weight',
        name: 'Manage Weight',
        why: 'Weight around your waist drives high blood pressure, diabetes risk, and kidney strain.',
        firstStep:
          'Small, consistent changes beat crash diets. Track your waist size.',
        resources: [
          {
            label: 'Losing weight',
            url: 'https://www.heart.org/healthy-living/healthy-eating/losing-weight',
            placeholder: true,
          },
        ],
      },
      {
        id: 'cholesterol',
        name: 'Control Cholesterol',
        why: 'Cholesterol clogs the arteries that feed your heart, brain, and kidneys.',
        firstStep: 'Eat fish twice a week. Limit fried food. Get a lipid panel.',
        resources: [
          {
            label: 'Cholesterol overview',
            url: 'https://www.heart.org/health-topics/cholesterol',
            placeholder: true,
          },
        ],
      },
      {
        id: 'glucose',
        name: 'Manage Blood Sugar',
        why: 'High blood sugar damages your blood vessels, kidneys, and nerves over years.',
        firstStep:
          'Watch added sugars. Move after meals. Get a blood glucose test.',
        resources: [
          {
            label: 'Diabetes overview',
            url: 'https://www.heart.org/health-topics/diabetes',
            placeholder: true,
          },
        ],
      },
      {
        id: 'bp',
        name: 'Manage Blood Pressure',
        why: 'Untreated high blood pressure is a leading cause of stroke and kidney damage.',
        firstStep: 'Less salt. More potassium-rich foods. Check your numbers.',
        resources: [
          {
            label: 'High blood pressure overview',
            url: 'https://www.heart.org/health-topics/high-blood-pressure',
            placeholder: true,
          },
        ],
      },
    ],
  },

  // Scene 10 — CTA (persona-tailored)
  cta: {
    overline: 'Take the next step',
    headline: 'Early detection is strong protection.',
    body: 'Most adults already have at least one CKM risk factor. A checkup of your heart, kidney, and metabolic health can catch quiet risks early — and start the connections working in your favor.',
    recap: 'Five things to measure. Eight habits to start. One conversation with your care team.',
    byPersona: {
      curious: {
        primary: {
          label: 'Schedule a checkup',
          url: 'https://www.heart.org/myCKMhealth',
          placeholder: true,
        },
        secondary: {
          label: 'Or learn more about CKM health',
          url: 'https://www.heart.org/myCKMhealth',
          placeholder: true,
        },
      },
      diagnosed: {
        primary: {
          label: 'Bring this to your care team',
          url: 'https://www.heart.org/myCKMhealth',
          placeholder: true,
        },
        secondary: {
          label: 'Conversation guide for your next visit',
          url: 'https://www.heart.org/myCKMhealth',
          placeholder: true,
        },
      },
      family: {
        primary: {
          label: 'Caregiver resources',
          url: 'https://www.heart.org/myCKMhealth',
          placeholder: true,
        },
        secondary: {
          label: 'Support groups and guides',
          url: 'https://www.heart.org/myCKMhealth',
          placeholder: true,
        },
      },
      clinician: {
        primary: {
          label: 'Patient education materials',
          url: 'https://www.heart.org/myCKMhealth',
          placeholder: true,
        },
        secondary: {
          label: 'CME & professional resources',
          url: 'https://www.heart.org/myCKMhealth',
          placeholder: true,
        },
      },
    },
  },
}

// Persona cookie helpers (light wrapper around document.cookie)
const COOKIE_NAME = 'ckmh_v8_persona'
const COOKIE_DAYS = 30

export function readPersonaCookie() {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(
    new RegExp('(?:^|; )' + COOKIE_NAME + '=([^;]+)'),
  )
  if (!match) return null
  const val = decodeURIComponent(match[1])
  return PERSONA_ORDER.includes(val) ? val : null
}

export function writePersonaCookie(personaId) {
  if (typeof document === 'undefined') return
  if (!PERSONA_ORDER.includes(personaId)) return
  const expires = new Date(
    Date.now() + COOKIE_DAYS * 24 * 60 * 60 * 1000,
  ).toUTCString()
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(personaId)}; expires=${expires}; path=/; SameSite=Lax`
}
