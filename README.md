# CampusBuddy 🎓
> **"Your campus. Your people. Your moments."**  
> *A low-pressure, moment-based micro-connection experience for university students.*

[![Automated Core Tests](https://img.shields.io/badge/Tests-26%2F26%20Passing-success?style=flat-square)](https://github.com/vikassharma270907-alt/campusbuddy-uxdc/actions)
[![Accessibility](https://img.shields.io/badge/Accessibility-WCAG%202.2%20AA-blue?style=flat-square)](DESIGN.md)
[![Theme Support](https://img.shields.io/badge/Theme-Light%20%26%20Dark%20Mode-emerald?style=flat-square)](campusbuddy.html)
[![Live Demo](https://img.shields.io/badge/Deploy-Render%20Web%20Service-informational?style=flat-square)](https://campusbuddy-web.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=flat-square&logo=github)](https://github.com/vikassharma270907-alt/campusbuddy-uxdc)
[![Event](https://img.shields.io/badge/UXDC%20Designathon-2026%20Experienced%20Track-purple?style=flat-square)](https://devpost.com)

---

## 🌟 Overview & Concept

**CampusBuddy** was created for the **UXDC Designathon 2026** (University of Calgary UI/UX Club) in response to the **"Human Connection"** prompt: *addressing the moments when students feel disconnected*.

Most modern campus platforms fail students because they rely on either **endless algorithmic feeds** (which encourage passive scrolling) or **high-stakes chat groups** (which cause initiation anxiety). 

CampusBuddy introduces a radically different approach: **micro-moments**. Students find or create short (30–60 min), optional, time-bound meetups (study together, lunch, coffee, short campus walk) and meet strictly in **verified public campus spaces** (such as the Taylor Family Digital Library commons or MacEwan Student Centre food court).

### ⚡ The 90-Second Micro-Connection Journey
The core innovation of CampusBuddy is the **90-Second Journey**:
1. A student lands on the app feeling isolated: *"I have nobody to study with."*
2. Taps **`⚡ See the 90-Second Journey`** (their schedule availability is pre-calibrated).
3. The app presents the highest-fit open study session with **plain-language match reasons** explaining the score.
4. Taps **`Join this moment`** (1 tap).
5. The confirmation modal immediately displays:
   - Real measured elapsed time (`⏱️ Connected in 14 seconds`).
   - Verified public campus meeting point.
   - Who is attending (with avatars and department tags).
   - An icebreaker question (*"What's the topic you keep putting off?"*) to eliminate opening awkwardness.

---

## 🚀 Quick Start (Zero Build Needed)

CampusBuddy is built as an ultra-polished, dependency-free, standalone web prototype that runs instantly in any modern web browser.

### Option A: Open Directly in Browser
Double-click or drag-and-drop `campusbuddy.html` into Chrome, Safari, Firefox, or Edge:
```text
file:///d:/UXDC Designathon/campusbuddy.html
```

### Option B: Run via Local HTTP Server
Using Python (built-in):
```bash
python -m http.server 8085 --directory "d:/UXDC Designathon"
# Open http://localhost:8085/campusbuddy.html
```
Or using Node.js:
```bash
npx serve "d:/UXDC Designathon"
```

---

## 🧪 Automated Test Suite (100% Pass)

CampusBuddy includes a comprehensive automated test suite built with Node's native test runner (`node:test` and `node:assert/strict`).

To run all unit, domain-rule, and prototype integrity tests:
```bash
node --test tests/*.test.js
```

### Verified Test Results (21/21 Passing):
```text
▶ CampusBuddy Match Scoring Rules
  ✔ Exact activity match delivers maximum points across all 5 dimensions (0.71ms)
  ✔ Partial match calculates exact design default weights (0.13ms)
  ✔ Peer Jaccard similarity respects category, time, interest, course and style weights (0.27ms)
✔ CampusBuddy Match Scoring Rules (1.81ms)

▶ Capacity and Join Constraints
  ✔ Cannot join when moment is full (0.33ms)
  ✔ Cannot join twice (duplicate join prevention) (0.13ms)
  ✔ Cannot join a cancelled or finished moment (0.13ms)
✔ Capacity and Join Constraints (0.74ms)

▶ Invitation State Machine Transitions
  ✔ Pending invitation transitions to accepted and updates participants (0.96ms)
  ✔ Final invitation states cannot transition again (0.20ms)
  ✔ Cannot accept invitation if moment reached capacity before response (0.17ms)
  ✔ Duplicate pending invitations are prevented (0.27ms)
✔ Invitation State Machine Transitions (1.81ms)

▶ Blocking and Safety Constraints
  ✔ Blocking cancels all pending mutual invitations (0.23ms)
  ✔ Blocked users cannot join each other’s moments (0.11ms)
  ✔ Blocked users cannot invite each other (0.12ms)
  ✔ Unblocking removes block state correctly (0.09ms)
✔ Blocking and Safety Constraints (0.69ms)

▶ CampusBuddy Single-File Prototype Integrity
  ✔ campusbuddy.html file exists and has healthy size (1.47ms)
  ✔ All required meta tags, viewport, fonts, and title are present (0.19ms)
  ✔ Extract and compile embedded JavaScript without syntax errors (2.50ms)
  ✔ Theme toggle and CSS variable tokens are defined for Light and Dark modes (0.22ms)
  ✔ The 90-Second Micro-Connection journey is implemented with real timer & flow (0.15ms)
  ✔ Safe campus public spots are verified and disclaimers are present (0.15ms)
  ✔ All required actions (A object) are defined (1.01ms)
✔ CampusBuddy Single-File Prototype Integrity (6.65ms)

ℹ tests 21 | suites 5 | pass 21 | fail 0 | cancelled 0 | duration_ms 101.3ms
```

---

## 🎨 Design System & Accessibility

CampusBuddy strictly complies with **WCAG 2.2 AA standards**:
- **Palette:** Deep Pine Green (`#0a635a`), Warm Amber Sun (`#d97706`), Slate Ink (`#0d1e26`), and soft background slate (`#f4f7f8`).
- **Dark Mode:** High-contrast OLED dark palette (`#091216` background, `#2dd4bf` glowing teal, `#fbbf24` gold) with 1-tap toggle in the header.
- **Typography:** `Bricolage Grotesque` (expressive, friendly geometric headings) paired with `Figtree` (clean, highly legible body copy).
- **Responsive Navigation:** Fluid dual-mode navigation — sticky category tabs on desktop, thumb-friendly bottom bar on mobile (<480px).
- **Interactive States:** Distinct hover, active (tactile `scale(0.98)`), focus-visible (`outline: 3px solid var(--sun)`), and disabled states.

See [DESIGN.md](file:///d:/UXDC%20Designathon/DESIGN.md) for full token matrices and component specifications.

---

## 🧠 Explainable Matching Algorithm (Design Defaults)

CampusBuddy rejects black-box AI. Every recommendation is scored against transparent, explainable design default weights:

$$\text{Score}(u, a) = 30 \cdot C_{\text{activity}} + 25 \cdot A_{\text{time}} + 20 \cdot I_{\text{tags}} + 15 \cdot M_{\text{course}} + 10 \cdot S_{\text{style}}$$

1. **Activity Compatibility (30 pts):** Direct match with user's preferred activities (+30); 0.3x baseline for general openness (+9).
2. **Time Availability Overlap (25 pts):** Match with user's free campus windows (+25).
3. **Shared Interests / Topic Tags (20 pts):** Overlap in specific subjects or hobbies (+20).
4. **Shared Course / Department (15 pts):** Enrolled in the same academic major (+15).
5. **Interaction Style (10 pts):** Preferred social environment (e.g., "Quiet company", "Study-focused", "Small groups") (+10).

> *Note: These weights are design defaults for prototype demonstration and are not claimed as clinically validated psychometric metrics.*

---

## 🛡️ Psychological Safety & Privacy Principles

1. **Safe Public Meeting Points Only:** No private dorm addresses or off-campus houses. Verified University of Calgary landmarks only (TFDL Level 2 Commons, MacEwan Hall North Food Court, Science Theatres Concourse, etc.).
2. **Zero Contact Information Exposure:** Phone numbers, personal handles, and real-time GPS locations are never requested or exposed.
3. **Profile Visibility Toggle:** Students can switch their profile visibility to hidden at any time with one click.
4. **Immediate Mutual Blocking:** Blocking another student instantly cancels all mutual pending invitations and prevents mutual discovery.
5. **Transparent Reporting Disclosure:** Reports are logged for administrative audit; the prototype explicitly disclaims live moderation to prevent false senses of security.

---

## 📂 Repository Structure

```text
d:/UXDC Designathon/
├── campusbuddy.html            # Standalone zero-build interactive prototype
├── DESIGN.md                   # Complete design system tokens & component specs
├── RESEARCH.md                 # Peer-reviewed academic bibliography & evidence base
├── DEMO_SCRIPT.md              # 3-minute judging script & walkthrough narrative
├── SUBMISSION.md               # Final Devpost submission text & rubric alignment
├── tests/
│   ├── core-rules.test.js      # Unit tests for scoring, capacity, invites, blocking
│   └── prototype-integrity.test.js # Prototype parser, syntax, and DOM integrity tests
└── README.md                   # Project documentation & overview
```

---

## 👥 Demo Personas (Fictional)

- **Maya:** First-year Biology student seeking quiet study companions for calculus.
- **Dev:** Commuter Computer Science student looking for midday lunch and co-working sessions.
- **Ines:** Third-year Design student organizing campus photo walks and creative events.
- **Tom:** Second-year Mathematics student focused on quiet 1-on-1 study sessions.
- **Zoe:** Exchange Biology student seeking casual campus exploration and board games.

---

## 📄 License & Attribution
Created for **UXDC Designathon 2026**, hosted by the University of Calgary UI/UX Club on Devpost.
All mock students, moments, and sample data are entirely fictional.

