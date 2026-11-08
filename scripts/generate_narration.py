"""
CampusBuddy — Voiceover Narration Audio Generator
Generates studio-grade warm, confident, and authentic voiceover audio tracks
using edge-tts neural voice (en-US-AndrewMultilingualNeural).
"""

import asyncio
import os
import edge_tts
from pathlib import Path

# Voice selection: Andrew Multilingual Neural - Warm, Confident, Authentic, Clear
VOICE = "en-US-AndrewMultilingualNeural"
RATE = "+0%"
PITCH = "+0Hz"

OUTPUT_DIR = Path("assets/audio")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

CHAPTERS = [
    {
        "id": "chapter1",
        "title": "The Disconnection Epidemic & CampusBuddy's Mission",
        "text": (
            "Judges and creators, welcome to CampusBuddy: Your campus. Your people. Your moments. "
            "University campuses are bustling with thousands of bright minds. Yet, every single day, "
            "students experience acute social disconnection. It happens in the quiet, mundane moments: "
            "eating lunch alone in a crowded transit lounge, or grinding through a brutal calculus problem "
            "in the library with no one to collaborate with. "
            "Existing social platforms fail students. Algorithmic feeds fuel passive doomscrolling and superficial comparison. "
            "Giant group chats become noisy, uncoordinated bulletin boards. And traditional friend-finding apps feel intimidating, awkward, and high-stakes. "
            "Built for the UXDC Designathon 2026 under the theme Human Connection, CampusBuddy introduces a radically different approach: micro-moments. "
            "Instead of endless feeds, we connect students for short, low-pressure, thirty-to-sixty-minute meetups strictly in verified public campus spaces."
        )
    },
    {
        "id": "chapter2",
        "title": "The Signature 90-Second Journey & Real-Time Stopwatch",
        "text": (
            "The cornerstone of CampusBuddy is the signature 90-Second Micro-Connection Journey. "
            "We made a bold promise: any student can go from feeling completely alone to having a confirmed study partner in under ninety seconds, in just two or three taps. "
            "Let's follow Maya, an incoming first-year biology commuter student sitting in the library. With one tap, she starts the 90-Second Journey. "
            "Look at the top right: a live stopwatch begins ticking in real time. "
            "Behind the scenes, our explainable matching algorithm instantly evaluates open campus moments. Maya sees her top match: Dev's Calculus revision in a quiet corner. "
            "Instead of a mysterious black box, CampusBuddy explicitly explains the match: plus thirty points for shared study intent, plus twenty-five for an afternoon schedule match, and plus twenty for the calculus topic. "
            "Maya taps Join this moment with a single click. Boom! In just fourteen seconds—well under our ninety-second target—Maya is confirmed. "
            "The modal shows the safe public landmark at the Taylor Family Digital Library commons, verified attendees, and an immediate icebreaker question: "
            "What's the topic you keep putting off? with a shuffle button to completely eliminate first-meeting awkwardness."
        )
    },
    {
        "id": "chapter3",
        "title": "Multi-Persona Simulation & Reactive State Machine",
        "text": (
            "To prove that CampusBuddy is a living, production-ready application rather than a static mockup, "
            "we built an interactive Multi-Persona Switcher right into the header. "
            "Watch what happens when we switch from Maya to Tom, an analytical sophomore math student. "
            "The entire interface reactively re-renders from Tom's perspective. In the People tab, classmates are ranked using Jaccard peer similarity and shared courses. "
            "Tom sends an invitation to Maya for a quick coffee chat before their ten a.m. lecture. "
            "When we switch back to Maya, her Invites tab displays a live badge. With one tap, Maya accepts. "
            "Notice the reactive state machine at work: the invitation status instantly shifts from pending to accepted, attendee capacities decrement in real time, "
            "and a confirmation toast fires smoothly—all without a single page reload."
        )
    },
    {
        "id": "chapter4",
        "title": "Comprehensive Features & Psychological Safety Guardrails",
        "text": (
            "Under the hood, CampusBuddy is packed with thoughtfully crafted features designed for authentic connection. "
            "Students can explore campus moments across five clear categories: co-working, lunch, coffee, campus walks, and project brainstorming. "
            "To prevent social anxiety, every moment enforces a strict hard capacity cap between two and eight students. "
            "Once a session is full, the system automatically locks the button to prevent overwhelming crowds. "
            "Crucially, human factors research shows that trust requires uncompromising psychological safety. CampusBuddy delivers on four strict guardrails: "
            "First, 100 percent verified public campus spots—private dorms or unvetted locations are systematically rejected. "
            "Second, zero contact sharing—students connect safely on campus without handing out personal phone numbers or social media accounts. "
            "Third, an instant Profile Visibility toggle allowing students to go invisible with one tap. "
            "And fourth, instant mutual blocking, which cancels mutual pending invites and removes both users from each other's view. "
            "Furthermore, our reporting flow explicitly informs students that issues are logged for human university audit, eliminating deceptive automated moderation claims. "
            "Finally, after each meetup, students complete a private, closed-loop reflection that fine-tunes future recommendations without public vanity metrics."
        )
    },
    {
        "id": "chapter5",
        "title": "How It Was Built: Pure Craftsmanship & Zero Bloat",
        "text": (
            "Now let's examine how CampusBuddy was built. As senior software craftsmen, we made a deliberate architectural choice: pure, dependency-free vanilla web engineering. "
            "There are zero bloated JavaScript frameworks, zero heavy npm runtimes on the client, and zero external CDN vulnerabilities. "
            "CampusBuddy is built entirely with semantic HTML5, modern CSS custom properties, and modular ES6+ JavaScript. "
            "The entire application loads instantaneously, even on low-bandwidth campus Wi-Fi. "
            "We implemented a deterministic micro-state engine that manages view transitions, reactive capacity counters, and modal lifecycles. "
            "On the backend, our hardened Node.js production server delivers native gzip compression, defense-in-depth Content Security Policies, "
            "path traversal protection, SPA fallback routing, and Kubernetes-ready health endpoints. "
            "Most importantly, we back our architecture with an automated test suite featuring sixty passing tests across eight comprehensive suites, "
            "validating everything from match scoring math and capacity bounds to state transitions and RFC-compliant iCalendar exports."
        )
    },
    {
        "id": "chapter6",
        "title": "Design System & The Cool Grey and Dark Palette",
        "text": (
            "Design is not just how it looks; it's how it feels. CampusBuddy features a bespoke design system engineered to exceed WCAG 2.2 AA accessibility standards, "
            "delivering over 4.5 to 1 contrast ratios. "
            "Our unique cool grey and dark theme embraces deep obsidian carbon, precision titanium borders, and luminous mint teal and amber accents. "
            "Every micro-interaction is tuned with tactile feedback—subtle press scaling, glowing focus rings, and smooth glassmorphic backdrops. "
            "With one tap in the header, students can toggle seamlessly between our warm accessible daylight mode and our sleek, OLED-optimized dark theme. "
            "Responsive breakpoints ensure a flawless experience, gracefully transitioning from a desktop sticky control bar to an ergonomic mobile bottom navigation."
        )
    },
    {
        "id": "chapter7",
        "title": "Conclusion & The Future of Belonging",
        "text": (
            "In conclusion, CampusBuddy proves that digital technology doesn't have to alienate us. "
            "By removing the friction of initiation, protecting psychological safety, and celebrating spontaneous micro-moments at safe campus landmarks, "
            "we turn isolated downtime into genuine belonging. "
            "CampusBuddy: Your campus. Your people. Your moments. "
            "Thank you for watching, and we invite you to explore the live interactive prototype on GitHub Pages or deploy your own instance with one click on Render!"
        )
    }
]

async def generate_chapter_audio(chapter):
    filename = OUTPUT_DIR / f"{chapter['id']}.mp3"
    print(f"Generating voice for: {chapter['title']} -> {filename}...")
    comm = edge_tts.Communicate(chapter["text"], voice=VOICE, rate=RATE, pitch=PITCH)
    await comm.save(str(filename))
    size = filename.stat().st_size
    print(f"  Done! ({size} bytes)")
    return filename

async def main():
    print(f"Starting neural narration generation using voice: {VOICE}")
    tasks = [generate_chapter_audio(ch) for ch in CHAPTERS]
    results = await asyncio.gather(*tasks)
    print("\nAll 7 chapters synthesized successfully!")
    print(f"Saved in: {OUTPUT_DIR.resolve()}")

if __name__ == "__main__":
    asyncio.run(main())
