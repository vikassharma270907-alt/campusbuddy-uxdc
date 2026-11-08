# CampusBuddy: build brief for the next builder or agent

Paste this whole file into your coding agent, and attach `campusbuddy.html` (the reference prototype) and, if you have it, the submission pack.

## Context

- Event: UXDC Designathon 2026 (University of Calgary UI/UX club, hosted on Devpost). Submissions close Nov 8, 2026, 12:00 pm MST (12:30 am IST on Nov 9). Confirm the exact deadline on the Devpost page.
- It is a **design** competition. Experienced-track rubric: User Research & Problem Validation, Solution Concept, UX & Interaction Design, Visual Design & Consistency, Feasibility & Impact. Judges are product designers and a human-factors researcher.
- Theme (verify against the Designathon 2.0 Handbook before building): "Human Connection", the moments when students feel disconnected.
- Product: **CampusBuddy**, "Your campus. Your people. Your moments." Students find or create short, optional, time-bound *moments* (study together, lunch, coffee, a walk) and meet in public campus spots.

## What matters most

1. **The moment-based connection experience is the innovation.** Make it exceptional. Do not build a generic chatbot or an endless social feed. AI is optional and must never send invitations or act for the user.
2. **The 90-second journey:** one student goes from "I have nobody to study with" to "I've found someone to study with" in under 90 seconds. Landing, tap "Study together" (free-time chips already set), see the best match with plain-language reasons, tap Join, see the confirmation with public meeting point, who's coming, a conversation starter and the elapsed seconds. Keep it to two or three taps.
3. Visual and interaction quality of that path: hierarchy, spacing, empty and full states, keyboard and screen-reader use, mobile first, light and dark mode, WCAG AA contrast at minimum.

## The reference prototype

`campusbuddy.html` is a single-file, no-build demo (vanilla JS, state in localStorage with an in-memory fallback). It already has: demo mode with fictional students and moments, a persona switcher (to accept an invitation as a second student), the 90-second study flow, discovery with filters, create with validation, explainable matching, invitations, join and capacity rules, confirmation, plans and private feedback, block, report, and profile visibility. It has no real login, database, notifications or AI.

Rules to preserve if you port it:
- **Match score (design defaults, not validated science):** activity compatibility 30, availability 25, shared interests 20, course 15, interaction style 10. Return reasons for each recommendation.
- **Invitation states:** `pending` can become `accepted`, `declined` or `cancelled`. Everything else is final. Block duplicates. Block accepting into a full, cancelled or finished moment.
- **Capacity and blocking:** no joining or inviting into a full moment; blocked users don't see or invite each other and their pending invitations are cancelled.
- **Safety:** only general public meeting points; never expose contact details or precise locations; reports are logged, and the UI must not claim live moderation.

## Work order

1. Inspect the workspace and open the prototype. Keep it working at every step.
2. Polish the 90-second path first, until it feels like a funded product. Then use the remaining time on the rest.
3. Write a short design system: colour, type and spacing tokens, light and dark modes, components with default, pressed, disabled and error states. This feeds the Figma file the team must also build.
4. Only migrate to Next.js + Supabase if there is clearly time. Otherwise improve the single file. A working demo beats an unfinished stack.
5. Write tests for the match scoring, invitation transitions, capacity, duplicate join and blocking, then run them and fix failures.
6. Review the running app in a browser at desktop and mobile widths. Fix overflow, contrast and focus problems.
7. Write README, DESIGN.md, RESEARCH.md, DEMO_SCRIPT.md and SUBMISSION.md.

## Hard rules

- Never invent user research, survey results, test results or citations. Use placeholders such as `[N respondents]` where real data is missing.
- Never claim a feature works or a test passed unless you ran it and saw the output.
- Never claim the app reduces loneliness or improves mental health, and never call the match weights validated.
- Label every demo person and moment as fictional.
- Don't deploy publicly, spend money or commit secrets without the owner's approval.
- Cite only papers you can verify. Safe starting set: Sandstrom & Dunn (2014), *PSPB*, "Social interactions and well-being: The surprising power of weak ties"; Epley & Schroeder (2014), *JEP: General*, "Mistakenly seeking solitude"; Granovetter (1973), "The Strength of Weak Ties"; Allen et al. (2021), a review of belonging. Treat the "64.7% of students feel lonely" figure as unverified until you find the source.

## Done means

- The 90-second journey runs end to end, and the elapsed time shown is real.
- The core flows work: create, discover, match with reasons, invite, accept, join, confirm, feedback, block, report.
- Core tests pass and you can show the output.
- Mobile and desktop both work.
- A short report states what runs, what was tested, what is missing and what the owner must supply (survey and test numbers, Figma link, team names).
