import os
import subprocess
import time
import socket
import urllib.request
from playwright.sync_api import sync_playwright

def get_free_port():
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.bind(('127.0.0.1', 0))
    port = s.getsockname()[1]
    s.close()
    return port

port = get_free_port()
print(f"Starting server on port {port}...")
env = os.environ.copy()
env["PORT"] = str(port)
env["HOST"] = "127.0.0.1"
proc = subprocess.Popen(["node", "server.js"], env=env)

try:
    for _ in range(30):
        try:
            with urllib.request.urlopen(f"http://127.0.0.1:{port}/health", timeout=1) as res:
                if res.status == 200:
                    break
        except Exception:
            time.sleep(0.1)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1280, "height": 800})
        page.on("console", lambda msg: print(f"BROWSER LOG: {msg.text}"))
        page.on("pageerror", lambda err: print(f"BROWSER ERROR: {err}"))
        
        page.goto(f"http://127.0.0.1:{port}/campusbuddy.html", wait_until="domcontentloaded")
        time.sleep(0.5)
        
        # Click enter demo if on landing page
        if page.locator('[data-a="start"]').count() > 0:
            page.click('[data-a="start"]')
            time.sleep(0.5)
            
        capsule = page.locator(".live-activity-capsule")
        capsule_count = capsule.count()
        print(f"Capsule count after enter demo: {capsule_count}")
        if capsule_count > 0:
            capsule.first.screenshot(path="assets/screenshots/capsule_fixed.png")
            print("Captured assets/screenshots/capsule_fixed.png!")
        
        page.screenshot(path="assets/screenshots/today_page_fixed.png")
        print("Captured assets/screenshots/today_page_fixed.png!")
        browser.close()
finally:
    proc.terminate()
    proc.wait()
