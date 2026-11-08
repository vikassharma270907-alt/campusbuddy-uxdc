# CampusBuddy — 3-Minute Video & Live Judging Script
**Event:** UXDC Designathon 2026 (University of Calgary UI/UX Club)  
**Track:** Experienced Track  
**Evaluation Target:** 3-Minute Presentation Walkthrough for Product Designers & Human Factors Judges  

---

## Overview & Demo Setup

- **Prototype URL:** Open `campusbuddy.html` directly in any web browser (or `http://localhost:8085/campusbuddy.html`).
- **Device Setup:** Works natively on desktop browsers and mobile touch screens (<480px width).
- **Core Narrative:** Follow **Maya**, an incoming first-year Biology student who is sitting alone at the library with a tough calculus assignment. Within **90 seconds**, she goes from feeling isolated to having a confirmed study partner at a verified campus landmark.

---

## Act 1: The 90-Second Micro-Connection Sprint (0:00 – 1:00)

### Screen 1: The Landing Experience
- **Presenter Script:**
  > *"Judges, university campuses are full of people, but students often feel intensely disconnected during small, mundane moments — like having nobody to study with before an exam. Existing social networks subject students to endless algorithmic feeds and superficial metrics. CampusBuddy is different: Your campus, your people, your moments."*
- **Action:** Tap the primary button: **`⚡ See the 90-Second Journey`** (or `⚡ Find someone to study with (<90s)`).

### Screen 2: The Study Sprint & Real-Time Stopwatch
- **Presenter Script:**
  > *"Notice the stopwatch in the top right. It is ticking in real time. We are challenging ourselves to solve Maya's disconnection in under 90 seconds. Maya's schedule free window ('Afternoon') is already pre-calibrated. In one glance, she sees her top recommendation."*
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

### Screen 3: The Confirmed Meetup Modal
- **Presenter Script:**
  > *"Done! In just 14 seconds — well under our 90-second threshold — Maya has a confirmed study session. There is no awkward messaging back and forth. She sees exactly who is attending (Dev and Maya), the safe, public meeting spot at TFDL, and an icebreaker question to break the ice: 'What's the topic you keep putting off?'."*
- **Visual Highlight:**
  - Celebration badge: `✓ Study Partner Connected!`.
  - Elapsed time stamp: `⏱ From “nobody to study with” to confirmed plan in 14 seconds.`
  - Icebreaker card with `Shuffle ⟳` button (click to demonstrate alternate conversation prompts).
  - Quick action: `Copy meeting details` button.
- **Action:** Tap **`Done`** to dismiss the modal.

---

## Act 2: Multi-Persona Roleplay & Real-Time Invitations (1:00 – 1:45)

### Screen 4: Persona Switcher Demonstration
- **Presenter Script:**
  > *"To prove that this isn't a static mockup, CampusBuddy includes a full persona switcher in the header to simulate multi-student interactions. In the top bar, we can see that Tom invited Maya to 'Coffee before the 10am lecture'."*
- **Action:** Tap the **`Invites`** tab (notice the `1` badge).
  - Point out Tom's pending invitation to Maya.
  - Switch persona in the header dropdown from `Maya` to `Tom`.
- **Presenter Script:**
  > *"When we switch to Tom, we see the app from his perspective. If Tom visits the People tab, he sees classmates ranked by Jaccard peer similarity and shared courses."*
- **Action:** Switch back to `Maya` and tap `Accept` on Tom's invitation.
  - Toast notification appears: `Invitation accepted!`.
  - Show how attendees and participant capacities update reactively in real time.

---

## Act 3: Discovery, Categorical Filters & Capacity Rules (1:45 – 2:15)

### Screen 5: Discover Moments
- **Presenter Script:**
  > *"Under the Discover tab, students can browse and filter campus moments across categories like Co-working, Lunch, Coffee, and Campus Walks. Every moment has a hard capacity limit between 2 and 8 people to prevent overwhelming crowd anxiety."*
- **Action:**
  - Select category filter: `☕ Coffee chat` -> Feed immediately updates.
  - Toggle sort order: `Soonest first` vs `Best fit first`.
  - Point out full state on `Board games night (Moment Full 2/2)` — joining is automatically prevented when capacity is reached.

---

## Act 4: Psychological Safety, Privacy & Zero Moderation Illusion (2:15 – 2:45)

### Screen 6: Safety & Privacy Tab
- **Presenter Script:**
  > *"As human factors researchers know, psychological safety is the foundation of student connection. In the Safety tab, CampusBuddy implements four strict guardrails:
  > 1. General public campus spots only — no private dorms or isolated locations.
  > 2. Zero contact detail sharing — no phone numbers or personal handles.
  > 3. Profile Visibility Toggle — students can hide their profile anytime with one tap.
  > 4. Instant Mutual Blocking — blocking immediately cancels any mutual pending invitations and prevents either student from seeing the other's moments.
  > Crucially, our reporting UI explicitly states that reports are logged for university audit without falsely claiming instant automated moderation."*
- **Action:** Demonstrate the `Block` feature on a peer and show the immediate cancellation and notification update.

---

## Act 5: Post-Meetup Private Feedback Loop & Conclusion (2:45 – 3:00)

### Screen 7: Plans & Private Reflection
- **Presenter Script:**
  > *"Under the Plans tab, students can view their upcoming calendar or mark past sessions as concluded. When a session concludes, students can submit private feedback — such as 'Enjoyed the experience' or 'Preferred different group size'. This feedback is 100% private and feeds directly into calibrating their future recommendations."*
- **Action:**
  - Tap `Toggle theme` in the header: show seamless transition between accessible **Light Mode** and high-contrast **Dark Mode**.
- **Closing Script:**
  > *"CampusBuddy proves that human connection doesn't need complex feeds or invasive algorithms. By transforming fragmented downtime into 90-second micro-moments at safe campus spots, we help students feel like they belong — one conversation at a time. Thank you!"*

