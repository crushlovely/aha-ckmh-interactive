// Full-page content for /v5 — based on Claude Design wireframe (CKM Wireframes.html)
// Source content: _context/01-content-deduped.md

export const fullPageData = {
  // ─── Sticky in-page nav ───
  nav: [
    { id: 'intro', n: 1, label: 'Intro' },
    { id: 'explore', n: 2, label: 'Connection' },
    { id: 'scope', n: 3, label: 'Numbers' },
    { id: 'know', n: 4, label: 'Know' },
    { id: 'stages', n: 5, label: 'Stages' },
    { id: 'act', n: 6, label: 'Action' },
    { id: 'cta', n: 7, label: 'Schedule' },
  ],
  navCta: { label: 'Schedule checkup', url: 'https://heart.org/myCKMhealth' },

  // ─── Section 1: Hero ───
  hero: {
    overline: 'American Heart Association',
    title: 'Your body works as a team.',
    subtitle:
      "Heart, kidneys, and the way your body creates energy each have different jobs — but they share the work to keep you healthy. When one part isn't working well, it can affect the others.",
    scrollCue: 'Explore the connection ↓',
  },

  // ─── Section 2: Venn (uses v4 venn diagram, shorter copy) ───
  venn: {
    sectionNum: '02',
    sectionTitle: 'The CKM connection',
    sectionPurpose: 'Explore each system and its overlaps.',
    nudgeText: "You've explored {n} of 7 — see the full connection →",
    regions: {
      heart: {
        label: 'Heart',
        color: '#E05A6D',
        headline: 'Your heart keeps everything flowing',
        body: [
          'The heart pumps blood to every organ — including your kidneys and the systems that manage energy. When blood pressure stays high, it damages the blood vessels everywhere, not just around the heart.',
        ],
        callout: 'Taking care of your heart benefits your whole body.',
      },
      kidney: {
        label: 'Kidneys',
        color: '#3A9BA5',
        headline: 'Your kidneys do more than you think',
        body: [
          'Kidneys filter your blood, balance fluids, and help control blood pressure. When they struggle, fluid builds up and the heart has to work harder.',
        ],
        callout: 'Monitoring kidney health protects your heart and overall health.',
      },
      metabolic: {
        label: 'Metabolic',
        color: '#D4943A',
        headline: 'How your body uses energy matters',
        body: [
          'Metabolic health is how your body turns food into energy and manages weight and blood sugar. When this system is off, it strains every other system in your body.',
        ],
        callout: 'Small changes in eating, moving, and sleeping shape your CKM health over time.',
      },
      heart_kidney: {
        label: 'Heart + Kidneys',
        color: '#8A7A96',
        headline: 'Heart and kidneys travel together',
        body: [
          'When the heart pumps poorly, the kidneys get less blood. When the kidneys struggle, blood pressure rises and the heart works harder. Managing one often helps the other.',
        ],
        callout: 'If you have a heart or kidney condition, ask about screening for both.',
      },
      heart_metabolic: {
        label: 'Heart + Metabolic',
        color: '#CB6A52',
        headline: 'Diabetes and weight strain the heart',
        body: [
          'High blood sugar slowly damages blood vessels, including the ones supplying the heart. Excess weight raises blood pressure and inflammation. Improving metabolic health directly lowers heart risk.',
        ],
        callout: 'Progress in one area helps all areas.',
      },
      kidney_metabolic: {
        label: 'Kidneys + Metabolic',
        color: '#5FAF8A',
        headline: 'Sugar and pressure strain the kidneys',
        body: [
          'Diabetes and high blood pressure are the two leading causes of kidney disease. They damage the kidneys quietly — often before any symptoms appear.',
        ],
        callout: 'Tracking blood sugar and blood pressure is one of the best ways to protect your kidneys.',
      },
      center: {
        label: 'All three',
        color: '#5C3D5E',
        headline: "Everything's connected — that's good news",
        body: [
          'Heart, kidney, and metabolic health are one connected system. Risk in one area creates risk in the others — and improvement in one area helps the others, too.',
        ],
        callout: 'CKM health is preventable, treatable, and sometimes reversible.',
      },
    },
  },

  // ─── Section 3: Stats Game ───
  stats: {
    sectionNum: '03',
    sectionTitle: 'Guess the numbers',
    sectionPurpose: 'How close are your assumptions?',
    intro: "Drag the slider to your guess. We'll reveal the real number — most people are way off.",
    items: [
      {
        id: 1,
        prompt: 'How many U.S. adults (20+) have at least one CKM risk factor?',
        answer: 90,
        unit: '%',
        display: '9 in 10',
        context: 'Nearly everyone you know.',
      },
      {
        id: 2,
        prompt: 'How many young adults (20–44) are affected?',
        answer: 80,
        unit: '%',
        display: '8 in 10',
        context: 'It starts earlier than people think.',
      },
      {
        id: 3,
        prompt: 'What % of U.S. adults have excellent CKM health?',
        answer: 10,
        unit: '%',
        display: '10%',
        context: 'A tiny minority — but reachable.',
      },
      {
        id: 4,
        prompt: 'How many U.S. adults have kidney disease?',
        answer: 14,
        unit: '%',
        display: '1 in 7',
        context: "Most don't know they have it.",
      },
    ],
  },

  // ─── Section 4: Know Your Numbers (flip cards) ───
  knowYourNumbers: {
    sectionNum: '04',
    sectionTitle: 'Flip to learn',
    sectionPurpose: 'Click any card to see what to ask your doctor.',
    intro:
      'Five numbers. One blood draw and a checkup gets you most of them. Flip each card to see what "healthy" looks like and what to ask.',
    items: [
      {
        name: 'Blood pressure',
        region: 'heart',
        test: 'BP cuff · annually',
        desc: 'How hard your heart pumps blood through your body.',
        healthy: '< 120/80',
        ask: '"What\'s my BP trend?"',
      },
      {
        name: 'Cholesterol',
        region: 'heart',
        test: 'Lipid panel',
        desc: 'Fats in your blood that can clog arteries.',
        healthy: 'LDL < 100',
        ask: '"Should I track LDL or non-HDL?"',
      },
      {
        name: 'Waist size',
        region: 'metabolic',
        test: 'Tape measure',
        desc: 'Fat around your middle is the riskiest kind.',
        healthy: '< 35" (W) / 40" (M)',
        ask: '"How does my waist relate to risk?"',
      },
      {
        name: 'Blood glucose',
        region: 'metabolic',
        test: 'A1C blood test',
        desc: 'How your body handles sugar over time.',
        healthy: 'A1C < 5.7%',
        ask: '"Am I prediabetic?"',
      },
      {
        name: 'Kidney function',
        region: 'kidney',
        test: 'eGFR + urine test',
        desc: 'How well your kidneys filter waste.',
        healthy: 'eGFR > 60',
        ask: '"What\'s my eGFR? Any protein in urine?"',
      },
    ],
    checklistMin: 3,
  },

  // ─── Section 5: Stages (interactive timeline) ───
  stages: {
    sectionNum: '05',
    sectionTitle: 'Find your stage on the path',
    sectionPurpose: 'See where action helps most.',
    intro:
      'CKM is a continuum, not a single diagnosis. Most stages can be slowed — and the early ones, often reversed.',
    closing: 'Many aspects are preventable, treatable, and sometimes reversible.',
    items: [
      {
        num: '00',
        name: 'Healthy',
        what: 'No risk factors. Your body is firing on all cylinders.',
        helps: 'Build healthy habits early — they compound.',
        color: '#A8D5A8',
      },
      {
        num: '01',
        name: 'Risk factors',
        what: 'Excess weight, unhealthy fats, prediabetes, mild BP creep.',
        helps: 'Small changes can fully reverse this stage.',
        color: '#D4943A',
      },
      {
        num: '02',
        name: 'Risk + signs',
        what: 'High BP, high cholesterol, kidney signals on labs.',
        helps: 'Treatment + lifestyle work hand in hand.',
        color: '#D4934A',
      },
      {
        num: '03',
        name: 'Subclinical disease',
        what: 'Early heart or kidney disease, often without symptoms.',
        helps: 'Catching this matters — act now.',
        color: '#E05A6D',
      },
      {
        num: '04',
        name: 'Disease present',
        what: 'Heart attack, stroke, kidney failure, or heart failure.',
        helps: 'Coordinated care can still slow progression.',
        color: '#A8324C',
      },
    ],
  },

  // ─── Section 6: Take Action (habit picker + commitment) ───
  takeAction: {
    sectionNum: '06',
    sectionTitle: 'Pick one for this week',
    sectionPurpose: "Commit to one habit. We'll save it and check in.",
    intro: 'Improving even one improves how your body functions. Tap a tile to choose your focus.',
    tiles: [
      { name: 'Eat better', why: 'Cuts cholesterol, supports waist.', step: 'Add one vegetable to lunch this week.' },
      { name: 'Be active', why: 'Moves blood sugar into muscles.', step: 'Walk 10 minutes after dinner, 5 days.' },
      { name: 'Quit tobacco', why: 'Drops heart attack risk fast.', step: 'Pick a quit date in the next 14 days.' },
      { name: 'Get healthy sleep', why: 'Resets blood pressure overnight.', step: 'Same bedtime, 7 nights in a row.' },
      { name: 'Manage weight', why: 'Especially around the waist.', step: 'Weigh in once a week, same day.' },
      { name: 'Control cholesterol', why: 'Early signal of CKM.', step: 'Schedule a lipid panel.' },
      { name: 'Manage blood sugar', why: 'Protects heart and kidneys.', step: 'Ask for an A1C at next visit.' },
      { name: 'Manage blood pressure', why: 'The biggest single lever.', step: 'Take BP at home twice this week.' },
    ],
  },

  // ─── Section 7: Closing CTA ───
  closingCta: {
    title: 'Early detection is strong protection.',
    subtitle: 'Schedule a checkup of your heart, kidney, and metabolic health.',
    primary: { label: 'Schedule a checkup →', url: 'https://heart.org/myCKMhealth' },
    secondary: { label: 'Learn more about CKM', url: 'https://heart.org/myCKMhealth' },
    tertiary: { label: 'Print my checklist' },
  },
}
