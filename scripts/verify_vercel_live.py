from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 800})
    page.goto("https://campusbuddy-uxdc.vercel.app/")
    
    start_btn = page.locator("[data-a='start']").first
    if start_btn.is_visible():
        start_btn.click()
        page.wait_for_timeout(500)
        
    state = page.evaluate("() => ({ tab: S.tab, mode: S.mode, onboarded: S.onboarded })")
    print("Vercel live state after start:", state)
    
    h2s = page.locator("h2").all_text_contents()
    print("Vercel live H2s:", h2s)
    
    page.screenshot(path="assets/screenshots/vercel_live_fixed.png")
    print("Captured assets/screenshots/vercel_live_fixed.png!")
    browser.close()
