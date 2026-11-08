# CampusBuddy — Research & Evidence-Based Foundations
**Event:** UXDC Designathon 2026 (University of Calgary UI/UX Club)  
**Track:** Experienced Track  
**Focus:** Grounding the Problem Space, Target Personas, and Interaction Design in Peer-Reviewed Literature  

---

## 1. Problem Space & Academic Context

University campuses are paradoxically dense environments where thousands of students are physically proximate yet report acute feelings of social disconnection. Rather than long-term isolation caused by a total absence of peers, research reveals that disconnection frequently manifests in **micro-moments of friction**:
- Eating lunch alone between classes without an easy, low-risk way to sit with someone.
- Tackling a difficult problem set in the library without knowing who else in the lecture hall is studying Chapter 4.
- Commuter or first-year students who arrive on campus for class and leave immediately because there is no structured, lightweight entryway into peer groups.

### Critical Research Guardrails
> [!IMPORTANT]
> **Product Claims Boundary:** CampusBuddy is a low-barrier interaction design prototype. We make **no claim** that CampusBuddy treats depression, reduces clinically diagnosed loneliness, or replaces institutional student mental health counseling. Furthermore, all algorithm match scores are design defaults created for intuitive user demonstration and are **not** clinically or psychometrically validated.

---

## 2. Peer-Reviewed Academic Citations & Design Implications

CampusBuddy’s feature architecture is directly informed by seminal and contemporary behavioral science research:

### 1. The Value of Casual Micro-Interactions (Weak Ties)
- **Citation:** Sandstrom, G. M., & Dunn, E. W. (2014). *Social interactions and well-being: The surprising power of weak ties.* Personality and Social Psychology Bulletin, 40(7), 910–922. [DOI: 10.1177/0146167214529799](https://doi.org/10.1177/0146167214529799)
- **Key Finding:** Individuals who engaged in a greater number of casual, weak-tie interactions (such as greeting a barista or chatting briefly with an acquaintance) experienced greater daily positive affect and a stronger subjective sense of belonging than those who kept to themselves.
- **CampusBuddy Architectural Implication:** Moments do not require lifelong friendship commitments. Facilitating 30-to-45-minute casual meetups (e.g., "Coffee before 10am lecture", "Calculus revision in TFDL") creates regular weak-tie activation with zero emotional pressure.

---

### 2. The Misprediction of Social Engagement Cost
- **Citation:** Epley, N., & Schroeder, J. (2014). *Mistakenly seeking solitude.* Journal of Experimental Psychology: General, 143(5), 1980–1999. [DOI: 10.1037/a0037323](https://doi.org/10.1037/a0037323)
- **Key Finding:** Commuters systematically predicted that attempting to converse with a stranger would be unpleasant and awkward; in empirical trials, however, participants assigned to connect reported significantly more positive commutes with zero negative backlash from conversation partners.
- **CampusBuddy Architectural Implication:** Students often desire connection but overestimate the friction and awkwardness of initiation. CampusBuddy reduces this barrier by providing:
  1. **Pre-defined shared intent** (both students opted in for calculus or lunch).
  2. **Built-in icebreaker prompts** (e.g., *"What's the topic you keep putting off?"*) to eliminate the initial 30 seconds of awkwardness.
  3. **Verified public locations** (TFDL commons, MacEwan food court) to ensure complete psychological safety.

---

### 3. Structural Information Diffusion via Weak Ties
- **Citation:** Granovetter, M. S. (1973). *The Strength of Weak Ties.* American Journal of Sociology, 78(6), 1360–1380. [DOI: 10.1086/225469](https://doi.org/10.1086/225469)
- **Key Finding:** Strong ties (close friends, family) form dense, insular cliques that recycle the same information. Weak ties act as critical bridges across social clusters, exposing individuals to novel opportunities, ideas, and academic perspectives.
- **CampusBuddy Architectural Implication:** CampusBuddy explicitly values peer diversity. In the matching model, students outside a user's primary social graph receive novelty credit, encouraging students from different sections, faculties, or years to study together.

---

### 4. Belonging as an Essential Need & Relational Framework
- **Citation:** Allen, K. A., Kern, M. L., Rozek, C. S., McInerney, D. M., & Slavich, G. M. (2021). *Belonging: a review of conceptual issues, an integrative framework, and directions for future research.* Australian Journal of Psychology / Frontiers in Psychology, 73(1), 87–102. [DOI: 10.1080/00049530.2021.1883409](https://doi.org/10.1080/00049530.2021.1883409)
- **Key Finding:** Belonging is a fundamental human drive shaped dynamically by social competencies, opportunities to connect, and relational perceptions. Opportunities must feel safe, accessible, and aligned with individual context.
- **CampusBuddy Architectural Implication:** CampusBuddy's profile calibration allows students to define their own interaction comfort zone (e.g., "Quiet company", "Study-focused", "Small groups") rather than forcing introverted students into chaotic party environments.

---

### 5. Interaction Design Interventions in Relationship Formation
- **Citation:** Salarić, D., Fabri, M., & Škunca, H. (2022). *The Influence of Interaction Design on Relation Making.* In International Conference on Human-Computer Interaction (pp. 411–428). Springer, Cham. [DOI: 10.1007/978-3-031-05412-9_30](https://doi.org/10.1007/978-3-031-05412-9_30)
- **Key Finding:** Digital platforms that lack affordances for trust and transparency often result in unstable, fleeting user interactions. Design interventions that make matching explainable and enforce safety guardrails significantly increase user trust.
- **CampusBuddy Architectural Implication:** CampusBuddy displays plain-language matching rationales (*"Dev studies Computer Science too (+15)"*, *"You share an interest in calculus (+20)"*) and enforces verified public locations and immediate blocking/reporting.

---

### 6. Survey Data and Student Loneliness Context
- **Reference / Context:** Active Minds & TimelyCare (2024). *Student Mental Health and Loneliness Survey.* Reported in collegiate health press releases with sample finding: `64.7% of surveyed college students report experiencing loneliness`.
  > [!NOTE]
  > *Methodological Note:* While this 64.7% figure reflects an active commercial/non-profit survey cohort (`n ≈ 1,100`), CampusBuddy treats collegiate loneliness statistics as multi-factorial. In academic literature, student loneliness rates range between 25% (Student Academic Experience Survey 2023, UK) and >50% (National College Health Assessment). Vulnerable cohorts consistently include first-year transitions, commuter students, and international exchange students.

---

## 3. Evidence-Grounded Target Personas (Fictionalized)

All personas depicted below are **fictional composite profiles** constructed to represent specific empirical pain points identified in campus literature:

| Persona | Academic & Living Context | Critical Disconnection Moment | How CampusBuddy Directly Addresses It |
|---|---|---|---|
| **Maya (First-Year Biology)** | Lives off-campus; first semester; heavy STEM course load. | Sitting alone on the second floor of the library staring at a tough calculus problem set; hesitates to approach strangers. | **The 90-Second Study Sprint:** In 2 taps, finds a 60-minute calculus session hosted by Dev at TFDL with a transparent 75% fit score. |
| **Dev (Commuter Computer Science)** | Commutes 45 mins each way; attends lectures and has 2-hour midday gaps. | Eats lunch alone or waits around silently in transit lounges between classes. | **Time-Bound Lunch & Coworking:** Can post a 45-minute food court lunch moment so other students nearby can join spontaneously. |
| **Ines (Third-Year Design)** | Senior student; enjoys creative hobbies (film, photo walks, exhibitions). | Friends have conflicting schedules; wants low-commitment company for campus walks and creative events. | **Topic-Based Social Moments:** Posts a 40-minute "Golden-hour photo walk around Prairie Chicken", welcoming newcomers. |
| **Tom (Second-Year Mathematics)** | Analytical, structured; prefers quiet, purposeful study sessions. | Dislikes large crowded clubs or loud events; prefers 1-on-1 or pair study. | **Style & Capacity Filters:** Sets interaction style to "Study-focused" and caps moment capacity at 2 or 3 attendees. |
| **Zoe (Exchange Student, Biology)** | International exchange student; navigating new campus geography. | Lacks established childhood or high-school networks; experiences culture shock. | **Safe Public Exploration:** Joins casual campus exploration and tabletop games at Rozsa Student Lounge. |

---

## 4. Primary Research Framework (For Live Campus Deployment)

To supplement secondary academic literature, the following survey instrument is prepared for future live student cohorts:

### Quantitative Survey Protocol (`[N respondents]` placeholder)
- **Target Population:** Undergraduate & Graduate students across multiple faculties.
- **Instrument Items:**
  1. *Frequency of campus loneliness:* "How often do you find yourself eating or studying alone on campus when you would have preferred company?" (Likert 1–5).
  2. *Barrier identification:* "What is your primary hesitation when joining a campus meetup?" (Options: Awkwardness/uncertainty, schedule mismatch, safety concerns, lack of clear topic).
  3. *Maximum acceptable time to arrange a meetup:* (Options: <2 minutes, 5–10 minutes, >30 minutes).

### Qualitative Interview Findings (`[N = 0 recorded; template for live deployment]`)
- *Interview Question:* "Walk us through the last time you wanted someone to study or grab lunch with on campus. What did you do?"
- *Observed Feedback / Pattern:* `[Placeholder for campus testing notes: students consistently report that standard group chats (Discord, WhatsApp) are too noisy, while dating apps feel inappropriately high-stakes and socially risky]`.

---

## 5. Summary of Design Requirements Derived from Research

| Research Finding | Interaction Design Decision in CampusBuddy |
|---|---|
| Overestimating social awkwardness (Epley & Schroeder, 2014) | Embed conversation icebreakers directly into confirmation modals. |
| High value of casual weak ties (Sandstrom & Dunn, 2014) | Cap moments at 30–60 minutes to maintain low commitment. |
| Need for trust & stability in digital interactions (Salarić et al., 2022) | Full explainability: transparent match weights (+30/+25/+20/+15/+10). |
| Physical & psychological safety prerequisites (Allen et al., 2021) | Strict restriction to verified, well-lit, public campus landmarks (TFDL, MSC, ST). |

