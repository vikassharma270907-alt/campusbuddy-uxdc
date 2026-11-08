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
        time.sleep(1)
        
        info = page.evaluate("() => ({ me: S.me, myNext: S.acts.find(a => a.ps.includes(S.me) && a.st === 'open'), acts: S.acts.map(a => ({ id: a.id, ps: a.ps, st: a.st })) })")
        print(f"Info from page: me={info.get('me')}, myNext={info.get('myNext')}")
        
        has_capsule = page.locator(".live-activity-capsule").count() > 0
        if has_capsule:
            capsule = page.locator(".live-activity-capsule")
            capsule.screenshot(path="assets/screenshots/capsule_fixed.png")
            print("Captured assets/screenshots/capsule_fixed.png!")
        
        page.screenshot(path="assets/screenshots/today_page_fixed.png")
        print("Captured assets/screenshots/today_page_fixed.png!")
        browser.close()
finally:
    proc.terminate()
    proc.wait()
