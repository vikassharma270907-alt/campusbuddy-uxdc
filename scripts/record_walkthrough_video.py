"""
CampusBuddy — Automated Video Walkthrough Recorder
Records high-definition 1080p footage of the live prototype in Playwright Chromium,
executes the full judging journey, and combines with the neural voiceover via FFmpeg.
"""

import asyncio
import os
import shutil
import subprocess
import tempfile
from pathlib import Path
from playwright.async_api import async_playwright

ROOT_DIR = Path(__file__).resolve().parent.parent
AUDIO_FILE = ROOT_DIR / "assets" / "audio" / "campusbuddy_3min_voice.mp3"
OUTPUT_MP4 = ROOT_DIR / "campusbuddy_showcase.mp4"
PORT = 8085
PROTOTYPE_URL = f"http://127.0.0.1:{PORT}/"

async def smooth_mouse_move(page, selector, steps=15):
    """Smoothly moves cursor to an element to simulate natural presentation pointer."""
    try:
        locator = page.locator(selector).first
        if await locator.is_visible():
            box = await locator.bounding_box()
            if box:
                x = box["x"] + box["width"] / 2
                y = box["y"] + box["height"] / 2
                await page.mouse.move(x, y, steps=steps)
                await asyncio.sleep(0.4)
    except Exception:
        pass

async def run_walkthrough():
    temp_video_dir = Path(tempfile.mkdtemp(prefix="cb_record_"))
    print(f"Temporary recording directory: {temp_video_dir}", flush=True)
    print(f"Audio file: {AUDIO_FILE} ({AUDIO_FILE.stat().st_size} bytes)", flush=True)
    print(f"Starting Node.js HTTP server on port {PORT}...", flush=True)
    server_process = subprocess.Popen(
        ["node", "server.js"],
        cwd=str(ROOT_DIR),
        env={**os.environ, "PORT": str(PORT), "HOST": "127.0.0.1"},
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    await asyncio.sleep(1.5)
    print(f"Launching Playwright Chromium (1920x1080)...", flush=True)
    print(f"Loading Prototype: {PROTOTYPE_URL}", flush=True)

    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            context = await browser.new_context(
                viewport={"width": 1920, "height": 1080},
                record_video_dir=str(temp_video_dir),
                record_video_size={"width": 1920, "height": 1080}
            )
            page = await context.new_page()

            # 1. Landing & Problem Introduction (0:00 - 0:24)
            print("Act 1: Landing Page & Problem Framing (0:00 - 0:24)...", flush=True)
            await page.goto(PROTOTYPE_URL, wait_until="networkidle")
            await asyncio.sleep(5)
            await page.mouse.wheel(0, 260)
            await asyncio.sleep(6)
            await smooth_mouse_move(page, "[data-a='study']")
            await asyncio.sleep(6)
            await page.mouse.wheel(0, -260)
            await asyncio.sleep(6)

            # 2. Trigger 90-Second Journey & Stopwatch (0:24 - 0:54)
            print("Act 1b: 90-Second Journey & Real-Time Stopwatch (0:24 - 0:54)...", flush=True)
            await page.evaluate("window.A && window.A.study && window.A.study()")
            await asyncio.sleep(4)
            
            # Let stopwatch tick and highlight match breakdown
            await page.mouse.wheel(0, 180)
            await asyncio.sleep(10)
            await smooth_mouse_move(page, "[data-a='join'][data-v='a1']")
            await asyncio.sleep(5)

            # Tap Join this moment
            print("Joining calculus moment a1...", flush=True)
            await page.evaluate("window.A && window.A.join && window.A.join('a1')")
            await asyncio.sleep(4)

            # 3. Confirmed Meetup Modal & Icebreakers (0:54 - 1:20)
            print("Act 1c: Confirmed Meetup Modal & Icebreaker Shuffling (0:54 - 1:20)...", flush=True)
            await asyncio.sleep(6)
            
            # Shuffle icebreaker 2 times
            print("Shuffling icebreaker...", flush=True)
            await page.evaluate("window.A && window.A.shuffle_starter && window.A.shuffle_starter('study')")
            await asyncio.sleep(4)
            await page.evaluate("window.A && window.A.shuffle_starter && window.A.shuffle_starter('study')")
            await asyncio.sleep(5)

            # Copy meeting details
            try:
                copy_btn = page.locator("[data-a='copy-details'], button:has-text('Copy meeting details')").first
                if await copy_btn.is_visible():
                    await copy_btn.click()
                    await asyncio.sleep(3)
            except Exception:
                pass

            # Close modal cleanly
            print("Closing confirmation modal...", flush=True)
            await page.evaluate("window.A && window.A.modal_close && window.A.modal_close()")
            await asyncio.sleep(4)

            # 4. Multi-Persona Switcher & State Machine (1:20 - 1:52)
            print("Act 2: Multi-Persona Roleplay & Real-Time Invitations (1:20 - 1:52)...", flush=True)
            await page.mouse.wheel(0, -400)
            await asyncio.sleep(2)

            # Switch persona to Tom
            print("Switching persona to Tom...", flush=True)
            await page.evaluate("window.A && window.A.user && window.A.user('tom')")
            await asyncio.sleep(5)

            # View People tab as Tom
            print("Navigating to People tab...", flush=True)
            await page.evaluate("window.A && window.A.tab && window.A.tab('people')")
            await asyncio.sleep(6)
            await page.mouse.wheel(0, 220)
            await asyncio.sleep(6)

            # Switch persona back to Maya
            print("Switching persona back to Maya...", flush=True)
            await page.evaluate("window.A && window.A.user && window.A.user('maya')")
            await asyncio.sleep(4)

            # View Invites tab
            print("Navigating to Invites tab...", flush=True)
            await page.evaluate("window.A && window.A.tab && window.A.tab('invites')")
            await asyncio.sleep(6)

            # Accept Tom's invite
            print("Accepting invitation...", flush=True)
            await page.evaluate("window.A && window.A.accept && window.A.accept('i1')")
            await asyncio.sleep(6)

            # 5. Discover Tab & Categorical Filtering (1:52 - 2:20)
            print("Act 3: Discover Tab, Category Filters & Capacity Locks (1:52 - 2:20)...", flush=True)
            await page.evaluate("window.A && window.A.tab && window.A.tab('discover')")
            await asyncio.sleep(5)

            # Filter by Coffee
            print("Filtering by Coffee...", flush=True)
            await page.evaluate("window.A && window.A.filter && window.A.filter('coffee')")
            await asyncio.sleep(6)

            # Filter by All
            print("Filtering by All...", flush=True)
            await page.evaluate("window.A && window.A.filter && window.A.filter('all')")
            await asyncio.sleep(5)

            # Scroll to show capacity limit and full moments
            await page.mouse.wheel(0, 320)
            await asyncio.sleep(8)
            await page.mouse.wheel(0, -320)
            await asyncio.sleep(4)

            # 6. Psychological Safety & Privacy Guardrails (2:20 - 2:50)
            print("Act 4: Psychological Safety, Privacy & Mutual Blocking (2:20 - 2:50)...", flush=True)
            await page.evaluate("window.A && window.A.tab && window.A.tab('safety')")
            await asyncio.sleep(6)
            await page.mouse.wheel(0, 260)
            await asyncio.sleep(6)

            # Toggle Profile Invisibility
            print("Toggling Profile Invisibility...", flush=True)
            await page.evaluate("window.A && window.A.vis && window.A.vis()")
            await asyncio.sleep(4)
            await page.evaluate("window.A && window.A.vis && window.A.vis()")
            await asyncio.sleep(4)

            await page.mouse.wheel(0, 260)
            await asyncio.sleep(6)
            await page.mouse.wheel(0, -520)
            await asyncio.sleep(3)

            # 7. Plans, Theme Toggle & Conclusion (2:50 - 3:20)
            print("Act 5: Plans, Theme Toggle & Conclusion (2:50 - 3:20)...", flush=True)
            await page.evaluate("window.A && window.A.tab && window.A.tab('plans')")
            await asyncio.sleep(6)

            # Toggle Theme: Dark -> Light -> Dark
            print("Demonstrating accessible theme toggle...", flush=True)
            await page.evaluate("window.A && window.A.theme && window.A.theme()")
            await asyncio.sleep(6)
            await page.evaluate("window.A && window.A.theme && window.A.theme()")
            await asyncio.sleep(6)

            # Return to Home tab for grand finale hold
            print("Returning to Home tab for finale...", flush=True)
            await page.evaluate("window.A && window.A.tab && window.A.tab('home')")
            await asyncio.sleep(12)

            # Final hold
            print("Closing browser context to finalize video capture...", flush=True)
            await context.close()
            await browser.close()

        # Find the recorded webm
        recorded_files = list(temp_video_dir.glob("*.webm"))
        if not recorded_files:
            raise RuntimeError("No recorded video found in temp dir!")
        raw_video = recorded_files[0]
        print(f"Raw video recorded: {raw_video} ({raw_video.stat().st_size} bytes)", flush=True)

        # Combine video and audio with FFmpeg
        print("Combining video with neural voiceover narration via FFmpeg...", flush=True)
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
            print("FFmpeg stderr:", res.stderr, flush=True)
            raise RuntimeError(f"FFmpeg failed with code {res.returncode}")

        print(f"\n=======================================================", flush=True)
        print(f"SUCCESS: Generated {OUTPUT_MP4} ({OUTPUT_MP4.stat().st_size} bytes)", flush=True)
        print(f"=======================================================\n", flush=True)

    finally:
        try:
            shutil.rmtree(temp_video_dir, ignore_errors=True)
        except Exception:
            pass
        if server_process:
            server_process.terminate()

if __name__ == "__main__":
    asyncio.run(run_walkthrough())
