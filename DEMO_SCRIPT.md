# CampusBuddy — 3-Minute Video & Live Judging Script
**Event:** UXDC Designathon 2026 (University of Calgary UI/UX Club)  
**Track:** Experienced Track  
**Evaluation Target:** 3-Minute Presentation Walkthrough for Product Designers & Human Factors Judges  

---

## Overview & Demo Setup

- **Live Prototype URL:** [https://vikassharma270907-alt.github.io/campusbuddy-uxdc/](https://vikassharma270907-alt.github.io/campusbuddy-uxdc/) (or open `campusbuddy.html` / `npm start`).
- **Device Support:** 100% responsive across desktop (1920x1080), tablets, and mobile devices (375x812).
- **Core Narrative:** Follow **Maya**, an incoming first-year Biology student sitting alone at the library facing a daunting calculus problem set. Within **90 seconds**, she goes from feeling isolated to having a confirmed study partner at a safe public campus landmark.

---

## Act 1: The 90-Second Micro-Connection Sprint (0:00 – 1:00)

### Screen 1: The Landing Experience & Judge Guided Tour
- **Presenter Script:**
  > *"Judges, university campuses are full of people, but students often feel intensely disconnected during small, mundane moments — like having nobody to study with before an exam. Existing social networks subject students to endless algorithmic feeds and superficial metrics. CampusBuddy is different: Your campus, your people, your moments.*
  >
  > *At the very top of the app, notice our **UXDC 2026 Judge Guided Tour** banner. Evaluators can click any of the 5 steps — from Research & Personas to our Spatial Radar Map — to see live rubric criteria callouts."*
- **Action:** Tap the primary button: **`⚡ See the 90-Second Journey`** (or `⚡ Find someone to study with (<90s)`).

### Screen 2: The Study Sprint & Real-Time Stopwatch
- **Presenter Script:**
  > *"Notice the stopwatch in the top right. It is ticking in real time. We challenge ourselves to solve Maya's disconnection in under 90 seconds. Maya's schedule free window ('Afternoon') is already pre-calibrated. In one glance, she sees her top recommendation."*
- **Visual Highlight:**
  - Active pulsing timer: `⏱️ 00:08s elapsed`.
  - Micro-stepper: `① Pick slot ➔ ② View best match ➔ ③ Tap Join`.
  - Highlighted card: **"Calculus revision, quiet corner"** hosted by **Dev** (Commuter · Computer Science).
  - **75% Match Score** with plain-language reasons:
    - *Study together is one of your go-to activities (+30)*
    - *You're free today afternoon (+25)*
    - *Shared interests: calculus (+20)*
  - Safe Landmark: `📍 Taylor Family Digital Library (TFDL), Level 2 Commons`.
- **Action:** Tap the primary button: **`Join this moment`** (1 tap!).

### Screen 3: The Confirmed Meetup Modal & Spot Landmark Compass
- **Presenter Script:**
  > *"Done! In just 14 seconds — well under our 90-second threshold — Maya has a confirmed study session with Dev. Notice the confetti celebration and tactile audio chime.*
  >
  > *Crucially, we've solved the #1 psychological fear in user research: 'What if I arrive in public and can't find who I'm meeting?' Our **Spot Landmark Compass** provides exact directions: 'Meet at the Level 2 high-top wooden tables overlooking the quad', provides recognition cues, noise ratings, and amenities like power outlets and AirUC-Secure Wi-Fi.*
  >
  > *Maya also gets an icebreaker prompt: 'What's the topic you keep putting off?' with a 1-tap copy and shuffle button."*
- **Visual Highlight:**
  - Celebration badge: `✓ Study Partner Connected!`.
  - Elapsed time stamp: `⏱ From “nobody to study with” to confirmed plan in 14 seconds.`
  - Landmark Compass Card: Directions, Noise Rating, Amenities.
  - Icebreaker Roulette card with `Shuffle ⟳` and `Copy 📋` buttons.
- **Action:** Tap **`Done`** to dismiss the modal.

---

## Act 2: Multi-Persona Roleplay & Command Palette (1:00 – 1:45)

### Screen 4: Command Palette (`⌘K`) & Persona Switcher
- **Presenter Script:**
  > *"To empower evaluators and power users, CampusBuddy includes a Linear/Raycast-inspired **Command Palette**. Pressing `⌘K` or clicking the header button opens an instant fuzzy-search overlay."*
- **Action:** Press `⌘K` (or click `⚡ ⌘K`).
  - Type `"map"` to demonstrate real-time filtering.
  - Press `Esc` to close.
- **Presenter Script:**
  > *"CampusBuddy includes a deterministic reactive state machine with multi-persona roleplay. In the top bar, we see that Tom invited Maya to 'Coffee before the 10am lecture'."*
- **Action:** Tap the **`Invites`** tab (notice the `1` badge).
  - Point out Tom's pending invitation to Maya.
  - Switch persona in the header dropdown from `Maya` to `Tom`.
  - Show how the app perspective, permissions, and recommendations adapt instantaneously.
  - Switch back to `Maya` and tap `Accept`.
  - Hear the tactile chime and see participants and attendee capacity update reactively.

---

## Act 3: Discovery, Campus Vibe Timeline & Radar Map (1:45 – 2:15)

### Screen 5: Discover Moments & Interactive Campus Radar Map
- **Presenter Script:**
  > *"Under the Discover tab, students can browse open meetups or toggle into our **Campus Radar Map** — an interactive vector blueprint of the University of Calgary.*
  >
  > *Here, judges can see real-time pulsating radar beacons over TFDL, MacEwan Student Centre, and Science Theatres, with live moment counters and an interactive Spot Detail Drawer."*
- **Action:**
  - Tap `🗺️ Campus Radar Map (6 Spots)`.
  - Click on a beacon (e.g. `TFDL`) to open the Spot Detail Drawer.
  - Point out the acoustic noise meter, walking time from CTrain transit, and 1-tap `+ Host Moment Here`.
  - Switch back to `📋 List View`.
- **Presenter Script:**
  > *"On the Today dashboard, notice our **Campus Disconnection & Activity Timeline**. It maps out the four daily windows where students feel most isolated: Morning Focus, Midday Lunch Rush, Afternoon Study Sprint, and Evening Wind-Down. Tapping any card instantly filters moments for that campus vibe."*
- **Action:** Tap `Afternoon Sprint` on the timeline to show dynamic vibe filtering.

---

## Act 4: Psychological Safety, Privacy & Zero Moderation Illusion (2:15 – 2:45)

### Screen 6: Safety & Privacy Tab
- **Presenter Script:**
  > *"Psychological safety is the bedrock of student connection. In our Safety tab, CampusBuddy implements four strict guardrails:
  > 1. General public campus spots only — no private dorms or isolated addresses.
  > 2. Zero contact detail sharing — no phone numbers or personal handles.
  > 3. Profile Visibility Toggle — students can hide their profile anytime with one tap.
  > 4. Instant Mutual Blocking — blocking immediately cancels any mutual pending invitations and prevents either student from seeing the other's moments.
  > 
  > Crucially, our reporting UI explicitly states that reports are logged for university audit without falsely claiming instant AI automated moderation."*
- **Action:** Demonstrate the `Block` feature on a peer and show the immediate cancellation and notification update.

---

## Act 5: Craftsmanship, Accessibility & Conclusion (2:45 – 3:00)

### Screen 7: Design System, Accessibility & 69 Passing Tests
- **Presenter Script:**
  > *"Under the hood, CampusBuddy is an engineering masterclass:
  > - **Zero Client Dependencies:** Pure semantic HTML5, CSS design tokens, and modular ES6+ JavaScript.
  > - **69 Automated Tests:** 100% passing across 8 test suites in under 300ms, verified in real Chromium across desktop, tablet, and mobile.
  > - **WCAG 2.2 AA Accessibility:** 7:1 contrast ratios on OLED obsidian dark mode and 5:1 on daylight slate, with full keyboard navigation and screen-reader live regions."*
- **Action:**
  - Tap `Toggle theme` in the header: show seamless transition between accessible **Light Mode** and high-contrast **Dark Mode**.
- **Closing Script:**
  > *"CampusBuddy proves that human connection doesn't need addictive algorithms or invasive tracking. By turning fragmented campus downtime into 90-second micro-moments at safe campus spots, we help students feel like they belong — one conversation at a time. Thank you!"*
