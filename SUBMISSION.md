# CampusBuddy — UXDC Designathon 2026 Submission

**Project Title:** CampusBuddy  
**Tagline:** Your campus. Your people. Your moments.  
**Track:** Experienced Track  
**Event:** UXDC Designathon 2026 (Hosted by University of Calgary UI/UX Club on Devpost)  
**Theme:** *Human Connection — The moments when students feel disconnected*  

---

## 🔗 Quick Submission Links (Owner to Supply / Finalize)

- **Interactive Prototype:** [Open `campusbuddy.html` or `index.html`]
- **GitHub Repository:** [https://github.com/vikassharma270907-alt/campusbuddy-uxdc](https://github.com/vikassharma270907-alt/campusbuddy-uxdc)
- **Figma Design System & Community File:** `[INSERT FIGMA LINK HERE]`
- **Video Walkthrough (3-Minute Loom / YouTube):** `[INSERT DEMO VIDEO LINK HERE]`
- **Team Members:** `[INSERT TEAM MEMBER NAMES & UCALGARY / INSTITUTION ROLES]`

---

## 💡 Executive Summary & Problem Framing

Despite attending universities surrounded by thousands of peers, students frequently experience acute social disconnection. Research shows that this isolation rarely stems from a lack of desire to connect, but rather from the **friction of initiation**:
- Eating lunch alone in transit lounges between classes with no low-risk way to sit together.
- Struggling through homework in the library without knowing who else in the lecture hall is studying Chapter 4.
- Commuter, first-year, and exchange students feeling intimidated by large, noisy club fairs or high-stakes social gatherings.

Traditional digital solutions fail students:
- **Social media feeds** encourage passive scrolling, comparison, and screen fatigue.
- **Group chats (Discord/WhatsApp)** become noisy, uncoordinated bulletin boards.
- **Dating/friend apps** feel inappropriately high-stakes, fraught with rejection anxiety.

**CampusBuddy** takes a radically different, human-centered approach: **micro-moments**. Instead of building an endless feed, CampusBuddy connects students for short (30–60 min), optional, time-bound meetups (study together, lunch, coffee, campus walk) in **verified, safe, public campus spots**.

---

## ⚡ The Core Innovation: The 90-Second Journey

The hallmark of CampusBuddy is the **90-Second Micro-Connection Journey**:

> **One student goes from "I have nobody to study with" to "I've found someone to study with" in under 90 seconds, in two to three taps.**

1. **Step 1: Trigger.** A student lands on CampusBuddy and taps **`⚡ See the 90-Second Journey`** (free-time availability is pre-calibrated).
2. **Step 2: Transparent Match.** The system displays the top-ranked study moment with a **live ticking stopwatch** (`⏱️ 00:14s elapsed`) and an **explainable breakdown** of why they matched (+30 Activity, +25 Free Time, +20 Shared Topic).
3. **Step 3: Single-Tap Join.** The student taps **`Join this moment`**.
4. **Step 4: Immediate Grounding.** The confirmation modal confirms the plan with:
   - **Real measured elapsed time** (`⏱ From “nobody to study with” to confirmed plan in 14 seconds`).
   - A **verified safe public campus location** (`📍 Taylor Family Digital Library (TFDL), Level 2 Commons`).
   - Who is coming (names, avatars, academic majors).
   - A built-in **icebreaker question** (*“What's the topic you keep putting off?”*) with a shuffle option to eliminate awkwardness upon arrival.

---

## 🏆 Experienced-Track Rubric Alignment

### 1. User Research & Problem Validation
- **Theoretical Grounding:** Grounded in peer-reviewed social psychology:
  - **Weak-Tie Theory (Sandstrom & Dunn, 2014; Granovetter, 1973):** Casual, low-stakes micro-interactions contribute significantly to subjective belonging without requiring high emotional energy.
  - **Mispredicted Solitude (Epley & Schroeder, 2014):** Students systematically overestimate the awkwardness of talking to peers; providing clear shared intent and icebreaker starters eliminates this psychological barrier.
  - **Relational Interaction Design (Salarić et al., 2022):** Trust requires explainability, predictability, and safety guardrails.
- **Campus Personas (Fictional):** Tailored to address specific institutional isolation archetypes:
  - *Maya (First-Year Biology):* Overwhelmed by STEM classes, needs quiet study buddies.
  - *Dev (Commuter Computer Science):* Long transit gaps, needs spontaneous lunch companions.
  - *Ines (Third-Year Design):* Seeks casual peers for creative walks and exhibitions.
  - *Tom (Second-Year Mathematics):* Analytical, prefers 1-on-1 structured sessions.
  - *Zoe (Exchange Student, Biology):* Navigating campus geography and culture shock.

---

### 2. Solution Concept & Differentiation
- **Anti-Feed Design:** Zero endless feeds, zero vanity metrics (no followers, no public likes, no endless chat threads).
- **Time-Bound Micro-Moments:** Meetups are capped at 30–90 minutes with strict attendee caps (2–8 people) to prevent overwhelming group dynamics.
- **Explainable Matching (Design Defaults):** No black-box AI. Users see exactly how their match score was derived:
  - *Activity Compatibility: 30 pts*
  - *Time Availability Overlap: 25 pts*
  - *Shared Interests / Tags: 20 pts*
  - *Same Course / Department: 15 pts*
  - *Interaction Style: 10 pts*

---

### 3. UX & Interaction Design Quality
- **Low-Friction Workflow:** Minimalist 3-tap onboarding and 2-tap meetup joining.
- **Comprehensive State Machine:** 
  - Strict invitation transitions: `pending` can only transition to `accepted`, `declined`, or `cancelled`. Final states cannot be manipulated.
  - Capacity enforcement: Buttons automatically shift to `Moment Full (X/X)` when spots reach zero.
  - Duplicate prevention: Joining twice or sending duplicate pending invitations is strictly prevented.
- **Multi-Persona Simulation:** Includes an active persona switcher in the header to allow evaluators to immediately experience the app from both creator and invitee perspectives.
- **Private Closed-Loop Feedback:** After meetups, students provide private feedback ("Enjoyed the experience", "Preferred different group size") that refines future matching without public judgment.

---

### 4. Visual Design & Design System Consistency
- **WCAG 2.2 AA Compliance:** High-contrast design tokens exceeding minimum 4.5:1 text contrast and 3:1 component contrast across both Light and Dark modes.
- **Accessible Dark Mode:** High-contrast OLED dark palette with a 1-tap theme toggle in the header.
- **Typography Pairing:** Geometric warmth of `Bricolage Grotesque` (display) paired with clean legibility of `Figtree` (body).
- **Tactile Micro-Interactions:** Subtle button press scaling (`scale(0.98)`), smooth focus rings (`outline: 3px solid var(--sun)`), and clean pill badges.
- **Responsive Architecture:** Desktop features a clean horizontal sticky header; mobile viewports (<480px) feature a fixed bottom navigation bar and touch-friendly targets.

---

### 5. Feasibility, Safety & Technical Implementation
- **Zero-Build Production Prototype:** `campusbuddy.html` runs natively in any browser with zero installation, zero bundlers, and zero external runtime dependencies.
- **Automated Verification:** 21 automated tests passing with 100% success rate across domain rules, capacity, state transitions, blocking, and markup integrity (`node --test tests/*.test.js`).
- **Psychological & Physical Safety Guardrails:**
  - *General Public Campus Landmarks Only:* TFDL Commons, MacEwan Food Court, Science Theatres Concourse. No private dorm addresses.
  - *Zero Contact Information Exposure:* No personal phone numbers or private handles.
  - *Instant Mutual Blocking:* Blocking instantly cancels pending invites and mutually hides moments.
  - *Transparent Moderation Disclosure:* Clear UI statement that reports are logged for administrative audit without claiming artificial live moderation.

---

## 📊 Verification & Test Matrix

| Test Suite | Tests Executed | Result | Status |
|---|---|---|---|
| **Match Scoring Rules** | Exact activity match (100 pts), partial scoring, Jaccard peer similarity | 3 / 3 Passed | ✅ Verified |
| **Capacity & Join Constraints** | Full moment prevention, duplicate join blocking, cancelled session blocking | 3 / 3 Passed | ✅ Verified |
| **Invitation State Machine** | Pending-to-accepted transitions, finality enforcement, capacity checks, duplicate invite prevention | 4 / 4 Passed | ✅ Verified |
| **Blocking & Privacy** | Pending invite auto-cancellation, mutual join prevention, invite prevention, unblock recovery | 4 / 4 Passed | ✅ Verified |
| **Prototype Integrity** | Script compilation, meta tags, WCAG tokens, real-time stopwatch, action bindings | 7 / 7 Passed | ✅ Verified |
| **Total Automated Tests** | **21 Total Test Cases** | **21 / 21 Passed (101ms)** | **100% Green** |

---

## 🔮 Future Roadmap (Post-Designathon)

1. **University SSO Integration:** Authenticate via university single sign-on (CAS / Shibboleth) to verify active student enrollment.
2. **Interactive Campus Map Integration:** Integrate lightweight SVG floorplans of campus buildings (e.g. TFDL floors 1–6) highlighting public meeting clusters.
3. **Calendar Protocol Export:** Generate standard `.ics` calendar invitation attachments upon moment confirmation.
4. **Institutional Wellbeing Analytics:** Anonymized, aggregated reporting for university wellness centers to identify peak campus disconnection hours without tracking individual students.

---

## 📚 Academic References

1. **Sandstrom, G. M., & Dunn, E. W. (2014).** *Social interactions and well-being: The surprising power of weak ties.* Personality and Social Psychology Bulletin, 40(7), 910–922. [DOI: 10.1177/0146167214529799](https://doi.org/10.1177/0146167214529799)
2. **Epley, N., & Schroeder, J. (2014).** *Mistakenly seeking solitude.* Journal of Experimental Psychology: General, 143(5), 1980–1999. [DOI: 10.1037/a0037323](https://doi.org/10.1037/a0037323)
3. **Granovetter, M. S. (1973).** *The Strength of Weak Ties.* American Journal of Sociology, 78(6), 1360–1380. [DOI: 10.1086/225469](https://doi.org/10.1086/225469)
4. **Allen, K. A., Kern, M. L., Rozek, C. S., McInerney, D. M., & Slavich, G. M. (2021).** *Belonging: a review of conceptual issues, an integrative framework, and directions for future research.* Australian Journal of Psychology, 73(1), 87–102. [DOI: 10.1080/00049530.2021.1883409](https://doi.org/10.1080/00049530.2021.1883409)
5. **Salarić, D., Fabri, M., & Škunca, H. (2022).** *The Influence of Interaction Design on Relation Making.* In International Conference on Human-Computer Interaction (pp. 411–428). Springer, Cham. [DOI: 10.1007/978-3-031-05412-9_30](https://doi.org/10.1007/978-3-031-05412-9_30)

