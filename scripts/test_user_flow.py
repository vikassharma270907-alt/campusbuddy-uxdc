import os
import subprocess
import time
import socket
from playwright.sync_api import sync_playwright

def get_free_port():
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.bind(('127.0.0.1', 0))
    port = s.getsockname()[1]
    s.close()
    return port

port = get_free_port()
env = os.environ.copy()
env["PORT"] = str(port)
env["HOST"] = "127.0.0.1"
proc = subprocess.Popen(["node", "server.js"], env=env)
time.sleep(1)

try:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1280, "height": 800})
        page.goto(f"http://127.0.0.1:{port}/")
        
        # Click "Enter Demo" or "Explore Full Interactive Demo"
        start_btn = page.locator("[data-a='start']").first
        if start_btn.is_visible():
            start_btn.click()
            page.wait_for_timeout(300)
            
        state = page.evaluate("() => ({ tab: S.tab, mode: S.mode, onboarded: S.onboarded })")
        print("State after Enter Demo:", state)
        
        h2s = page.locator("h2").all_text_contents()
        print("H2 headers visible on page:", h2s)
        
        # Check if active tab is Today
        active_tab = page.locator(".tab-btn.on").text_content()
        print("Active tab in nav:", active_tab)
        
        # Take screenshot of the fixed view
        page.screenshot(path="assets/screenshots/demo_fixed_today.png")
        print("Saved assets/screenshots/demo_fixed_today.png!")
        
        browser.close()
finally:
    proc.terminate()
    proc.wait()
