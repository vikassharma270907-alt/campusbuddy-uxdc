"""
CampusBuddy — Automated Video Walkthrough Recorder
Records high-definition 1080p footage of the live prototype in Playwright Chromium,
executes the full judging journey, and combines with the neural voiceover via FFmpeg.
"""

import asyncio
import os
import shutil
import subprocess
from pathlib import Path
from playwright.async_api import async_playwright

ROOT_DIR = Path(__file__).resolve().parent.parent
TEMP_VIDEO_DIR = ROOT_DIR / "assets" / "raw_video_temp"
AUDIO_FILE = ROOT_DIR / "assets" / "audio" / "campusbuddy_3min_voice.mp3"
OUTPUT_MP4 = ROOT_DIR / "campusbuddy_showcase.mp4"
PROTOTYPE_URL = f"file:///{str(ROOT_DIR / 'campusbuddy.html').replace(os.sep, '/')}"

async def smooth_mouse_move(page, selector, steps=15):
    """Smoothly moves cursor to an element to simulate natural presentation pointer."""
    try:
        box = await page.locator(selector).first.bounding_box()
        if box:
            x = box["x"] + box["width"] / 2
            y = box["y"] + box["height"] / 2
            await page.mouse.move(x, y, steps=steps)
            await asyncio.sleep(0.4)
    except Exception as e:
        print(f"Warning on mouse move to {selector}: {e}")

async def run_walkthrough():
    if TEMP_VIDEO_DIR.exists():
        shutil.rmtree(TEMP_VIDEO_DIR)
    TEMP_VIDEO_DIR.mkdir(parents=True, exist_ok=True)

    print(f"Launching Playwright Chromium (1920x1080)...")
    print(f"Loading Prototype: {PROTOTYPE_URL}")

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={"width": 1920, "height": 1080},
            record_video_dir=str(TEMP_VIDEO_DIR),
            record_video_size={"width": 1920, "height": 1080}
        )
        page = await context.new_page()

        # 1. Landing & Problem Introduction (0:00 - 0:22)
        print("Act 1: Landing Page & Problem Framing (0:00 - 0:22)...")
        await page.goto(PROTOTYPE_URL, wait_until="networkidle")
        await asyncio.sleep(3)
        await page.mouse.wheel(0, 300)
        await asyncio.sleep(4)
        await smooth_mouse_move(page, ".journey-callout, button:has-text('See the 90-Second Journey')")
        await asyncio.sleep(4)
        await page.mouse.wheel(0, -300)
        await asyncio.sleep(5)

        # 2. Trigger 90-Second Journey & Stopwatch (0:22 - 0:52)
        print("Act 1b: 90-Second Journey & Real-Time Stopwatch (0:22 - 0:52)...")
        journey_btn = page.locator("button:has-text('See the 90-Second Journey'), button:has-text('Find someone to study with')").first
        if await journey_btn.is_visible():
            await journey_btn.click()
        else:
            await page.evaluate("window.A && window.A.startJourney && window.A.startJourney()")
        
        await asyncio.sleep(2)
        # Let stopwatch tick and highlight match breakdown
        await page.mouse.wheel(0, 150)
        await asyncio.sleep(6)
        await smooth_mouse_move(page, "button:has-text('Join this moment')")
        await asyncio.sleep(4)

        # Tap Join this moment
        join_btn = page.locator("button:has-text('Join this moment')").first
        if await join_btn.is_visible():
            await join_btn.click()
        await asyncio.sleep(3)

        # 3. Confirmed Meetup Modal & Icebreakers (0:52 - 1:18)
        print("Act 1c: Confirmed Meetup Modal & Icebreaker Shuffling (0:52 - 1:18)...")
        await asyncio.sleep(4)
        # Shuffle icebreaker
        shuffle_btn = page.locator("button:has-text('Shuffle'), button:has-text('⟳')").first
        if await shuffle_btn.is_visible():
            await shuffle_btn.click()
            await asyncio.sleep(3)
            await shuffle_btn.click()
            await asyncio.sleep(3)

        # Copy meeting details
        copy_btn = page.locator("button:has-text('Copy meeting details'), button:has-text('Copy Details')").first
        if await copy_btn.is_visible():
            await copy_btn.click()
            await asyncio.sleep(2)

        # Close modal
        close_btn = page.locator("button:has-text('Done'), button:has-text('Close')").first
        if await close_btn.is_visible():
            await close_btn.click()
        await asyncio.sleep(3)

        # 4. Multi-Persona Switcher & State Machine (1:18 - 1:48)
        print("Act 2: Multi-Persona Roleplay & Real-Time Invitations (1:18 - 1:48)...")
        await page.mouse.wheel(0, -500)
        await asyncio.sleep(2)

        # Switch to Tom
        persona_select = page.locator("#personaSwitcher, select[aria-label*='persona'], select").first
        if await persona_select.is_visible():
            await persona_select.select_option("tom")
        else:
            await page.evaluate("window.A && window.A.switchPersona && window.A.switchPersona('tom')")
        await asyncio.sleep(4)

        # View People tab as Tom
        people_tab = page.locator("button:has-text('People'), [data-tab='people']").first
        if await people_tab.is_visible():
            await people_tab.click()
        else:
            await page.evaluate("window.A && window.A.switchTab && window.A.switchTab('people')")
        await asyncio.sleep(5)
        await page.mouse.wheel(0, 200)
        await asyncio.sleep(4)

        # Switch back to Maya
        if await persona_select.is_visible():
            await persona_select.select_option("maya")
        else:
            await page.evaluate("window.A && window.A.switchPersona && window.A.switchPersona('maya')")
        await asyncio.sleep(3)

        # View Invites tab
        invites_tab = page.locator("button:has-text('Invites'), [data-tab='invites']").first
        if await invites_tab.is_visible():
            await invites_tab.click()
        else:
            await page.evaluate("window.A && window.A.switchTab && window.A.switchTab('invites')")
        await asyncio.sleep(4)

        # Accept Tom's invite
        accept_btn = page.locator("button:has-text('Accept')").first
        if await accept_btn.is_visible():
            await accept_btn.click()
            await asyncio.sleep(4)

        # 5. Discover Tab & Categorical Filtering (1:48 - 2:18)
        print("Act 3: Discover Tab, Category Filters & Capacity Locks (1:48 - 2:18)...")
        discover_tab = page.locator("button:has-text('Discover'), [data-tab='discover']").first
        if await discover_tab.is_visible():
            await discover_tab.click()
        else:
            await page.evaluate("window.A && window.A.switchTab && window.A.switchTab('discover')")
        await asyncio.sleep(3)

        # Filter by Coffee
        coffee_pill = page.locator("button:has-text('Coffee'), [data-filter='coffee']").first
        if await coffee_pill.is_visible():
            await coffee_pill.click()
            await asyncio.sleep(4)

        # Filter by All
        all_pill = page.locator("button:has-text('All'), [data-filter='all']").first
        if await all_pill.is_visible():
            await all_pill.click()
            await asyncio.sleep(3)

        # Scroll to show capacity limit
        await page.mouse.wheel(0, 300)
        await asyncio.sleep(5)
        await page.mouse.wheel(0, -300)
        await asyncio.sleep(3)

        # 6. Psychological Safety & Privacy Guardrails (2:18 - 2:48)
        print("Act 4: Psychological Safety, Privacy & Mutual Blocking (2:18 - 2:48)...")
        safety_tab = page.locator("button:has-text('Safety'), [data-tab='safety']").first
        if await safety_tab.is_visible():
            await safety_tab.click()
        else:
            await page.evaluate("window.A && window.A.switchTab && window.A.switchTab('safety')")
        await asyncio.sleep(4)
        await page.mouse.wheel(0, 250)
        await asyncio.sleep(4)

        # Toggle Profile Invisibility
        invis_toggle = page.locator("input[type='checkbox'], #profileVisibilityToggle, button:has-text('Hide')").first
        if await invis_toggle.is_visible():
            await invis_toggle.click()
            await asyncio.sleep(3)
            await invis_toggle.click()
            await asyncio.sleep(3)

        await page.mouse.wheel(0, 250)
        await asyncio.sleep(4)
        await page.mouse.wheel(0, -500)
        await asyncio.sleep(2)

        # 7. Plans, Theme Toggle & Conclusion (2:48 - 3:18)
        print("Act 5: Plans, Theme Toggle & Conclusion (2:48 - 3:18)...")
        plans_tab = page.locator("button:has-text('Plans'), [data-tab='plans']").first
        if await plans_tab.is_visible():
            await plans_tab.click()
        else:
            await page.evaluate("window.A && window.A.switchTab && window.A.switchTab('plans')")
        await asyncio.sleep(4)

        # Toggle Theme: Dark -> Light -> Dark
        theme_btn = page.locator("button[aria-label*='theme'], button:has-text('theme'), #themeToggle").first
        if await theme_btn.is_visible():
            print("Demonstrating accessible theme toggle...")
            await theme_btn.click()
            await asyncio.sleep(4)
            await theme_btn.click()
            await asyncio.sleep(4)
        else:
            await page.evaluate("window.A && window.A.toggleTheme && window.A.toggleTheme()")
            await asyncio.sleep(4)
            await page.evaluate("window.A && window.A.toggleTheme && window.A.toggleTheme()")
            await asyncio.sleep(4)

        # Return to Home tab for finale
        home_tab = page.locator("button:has-text('Home'), [data-tab='home']").first
        if await home_tab.is_visible():
            await home_tab.click()
        else:
            await page.evaluate("window.A && window.A.switchTab && window.A.switchTab('home')")
        await asyncio.sleep(6)

        # Final hold
        print("Closing browser context to finalize video capture...")
        await context.close()
        await browser.close()

    # Find the recorded webm
    recorded_files = list(TEMP_VIDEO_DIR.glob("*.webm"))
    if not recorded_files:
        raise RuntimeError("No recorded video found in temp dir!")
    raw_video = recorded_files[0]
    print(f"Raw video recorded: {raw_video} ({raw_video.stat().st_size} bytes)")

    # Combine video and audio with FFmpeg
    print("Combining video with neural voiceover narration via FFmpeg...")
    ffmpeg_cmd = [
        "ffmpeg", "-y",
        "-i", str(raw_video),
        "-i", str(AUDIO_FILE),
        "-c:v", "libx264",
        "-preset", "medium",
        "-crf", "22",
        "-pix_fmt", "yuv420p",
        "-c:a", "aac",
        "-b:a", "192k",
        "-shortest",
        str(OUTPUT_MP4)
    ]
    res = subprocess.run(ffmpeg_cmd, capture_output=True, text=True)
    if res.returncode != 0:
        print("FFmpeg stderr:", res.stderr)
        raise RuntimeError(f"FFmpeg failed with code {res.returncode}")

    print(f"\n=======================================================")
    print(f"SUCCESS: Generated {OUTPUT_MP4} ({OUTPUT_MP4.stat().st_size} bytes)")
    print(f"=======================================================\n")

    # Clean up temp webm
    shutil.rmtree(TEMP_VIDEO_DIR, ignore_errors=True)

if __name__ == "__main__":
    asyncio.run(run_walkthrough())
