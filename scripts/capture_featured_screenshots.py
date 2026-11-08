#!/usr/bin/env python3
import asyncio
import os
import subprocess
import time
import socket
import urllib.request
from pathlib import Path
from playwright.async_api import async_playwright

ROOT_DIR = Path(__file__).resolve().parent.parent
SCREENSHOTS_DIR = ROOT_DIR / "assets" / "screenshots"

def get_free_port():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(('127.0.0.1', 0))
        return s.getsockname()[1]

PORT = get_free_port()
BASE_URL = f"http://127.0.0.1:{PORT}"

async def main():
    SCREENSHOTS_DIR.mkdir(parents=True, exist_ok=True)
    server_process = subprocess.Popen(
        ["node", "server.js"],
        cwd=str(ROOT_DIR),
        env={**os.environ, "PORT": str(PORT), "HOST": "127.0.0.1"},
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        shell=(os.name == 'nt')
    )
    
    # Wait for server
    for _ in range(30):
        try:
            with urllib.request.urlopen(f"{BASE_URL}/health", timeout=1) as resp:
                if resp.status == 200:
                    break
        except Exception:
            time.sleep(0.2)

    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            context = await browser.new_context(viewport={"width": 1440, "height": 900})
            page = await context.new_page()

            # 1. Open app and go into demo
            await page.goto(f"{BASE_URL}/campusbuddy.html", wait_until="networkidle")
            start_btn = page.locator('[data-a="start"]').first
            if await start_btn.count() > 0:
                await start_btn.click()
                await page.wait_for_timeout(300)

            ob_btn = page.locator('[data-a="obdone"]').first
            if await ob_btn.count() > 0:
                await ob_btn.click()
                await page.wait_for_timeout(300)

            # 2. Capture Judge Guided Tour banner with step 2
            tour_step_2 = page.locator('[data-a="tour_step"][data-v="2"]').first
            if await tour_step_2.count() > 0:
                await tour_step_2.click()
                await page.wait_for_timeout(300)
                await page.screenshot(path=str(SCREENSHOTS_DIR / "08_judge_guided_tour.png"))
                print("Captured 08_judge_guided_tour.png")

            # 3. Capture Campus Vibe Timeline on Today tab
            await page.locator('[data-a="tab"][data-v="today"]').first.click()
            await page.wait_for_timeout(300)
            vibe_card = page.locator('.vibe-card[data-v="afternoon"]').first
            if await vibe_card.count() > 0:
                await vibe_card.click()
                await page.wait_for_timeout(200)
            await page.screenshot(path=str(SCREENSHOTS_DIR / "09_campus_vibe_timeline.png"))
            print("Captured 09_campus_vibe_timeline.png")

            # 4. Capture Campus Radar Map in Discover view
            await page.locator('[data-a="tab"][data-v="discover"]').first.click()
            await page.wait_for_timeout(300)
            map_toggle = page.locator('[data-a="toggle_view"][data-v="map"]').first
            if await map_toggle.count() > 0:
                await map_toggle.click()
                await page.wait_for_timeout(400)
            await page.screenshot(path=str(SCREENSHOTS_DIR / "10_campus_radar_map.png"))
            print("Captured 10_campus_radar_map.png")

            # 5. Capture Meetup Confirmed with Spot Landmark Compass Guide
            await page.locator('[data-a="tab"][data-v="today"]').first.click()
            await page.wait_for_timeout(300)
            join_btn = page.locator('[data-a="join"]').first
            if await join_btn.count() > 0:
                await join_btn.click()
                await page.wait_for_timeout(400)
                await page.screenshot(path=str(SCREENSHOTS_DIR / "11_meetup_confirmed_compass.png"))
                print("Captured 11_meetup_confirmed_compass.png")
                await page.locator('[data-a="modal_close"]').first.click()
                await page.wait_for_timeout(200)

            # 6. Capture Command Palette (⌘K)
            cmd_btn = page.locator('[data-a="modal"][data-v="shortcuts"]').first
            if await cmd_btn.count() > 0:
                await cmd_btn.click()
                await page.wait_for_timeout(300)
                cmd_input = page.locator("#cmd-input")
                if await cmd_input.count() > 0:
                    await cmd_input.fill("map")
                    await page.wait_for_timeout(200)
                await page.screenshot(path=str(SCREENSHOTS_DIR / "12_command_palette.png"))
                print("Captured 12_command_palette.png")

            await browser.close()
    finally:
        server_process.terminate()
        try:
            server_process.wait(timeout=3)
        except Exception:
            server_process.kill()

if __name__ == '__main__':
    asyncio.run(main())
