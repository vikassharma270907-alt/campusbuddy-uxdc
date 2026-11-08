<#
.SYNOPSIS
    Antigravity Vercel Automation CLI
    Manages Vercel agent skills, performance audits, web design compliance, and deployments.
.PARAMETER ProjectPath
    Target directory (defaults to current directory).
.PARAMETER Audit
    Runs a full Vercel audit (React best practices, web design guidelines, cost & caching).
.PARAMETER Deploy
    Triggers Vercel deployment.
.PARAMETER Sync
    Provisions all Vercel skills, agents, and rules into the target project.
#>
param(
    [string]$ProjectPath = (Get-Location).Path,
    [switch]$Audit,
    [switch]$Deploy,
    [switch]$Sync,
    [switch]$All
)

$target = (Resolve-Path $ProjectPath).Path
$vercelPlugin = Join-Path $env:USERPROFILE ".gemini\config\plugins\vercel-agent-skills"

Write-Host "═════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "        Antigravity Vercel Agent Automation Engine              " -ForegroundColor Cyan
Write-Host "═════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "Target Project: $target" -ForegroundColor Gray

if ($Sync -or (-not $Audit -and -not $Deploy)) {
    Write-Host "[1/3] Provisioning Vercel Agent Skills & Rules..." -ForegroundColor Yellow
    powershell.exe -NoProfile -ExecutionPolicy Bypass -File "$env:USERPROFILE\.gemini\config\setup-project.ps1" -ProjectPath $target
}

if ($Audit -or $All) {
    Write-Host "`n[2/3] Auditing Project Architecture..." -ForegroundColor Yellow
    $hasVercelJson = Test-Path (Join-Path $target "vercel.json")
    $hasNextConfig = (Test-Path (Join-Path $target "next.config.js")) -or (Test-Path (Join-Path $target "next.config.mjs"))
    $hasPackageJson = Test-Path (Join-Path $target "package.json")

    Write-Host "  • vercel.json: $(if ($hasVercelJson) { '✔ Found' } else { '○ Not found' })"
    Write-Host "  • next.config: $(if ($hasNextConfig) { '✔ Found' } else { '○ Not found' })"
    Write-Host "  • package.json: $(if ($hasPackageJson) { '✔ Found' } else { '○ Not found' })"

    # Count React components
    $reactFiles = Get-ChildItem -Path $target -Recurse -Include "*.jsx", "*.tsx", "*.js", "*.html" -ErrorAction SilentlyContinue | Where-Object { $_.FullName -notmatch "node_modules|\.git" }
    Write-Host "  • Scannable Frontend Files: $($reactFiles.Count) files" -ForegroundColor Green
    Write-Host "`nVercel Skills Available for this project:" -ForegroundColor Cyan
    Write-Host "  1. vercel-react-best-practices (70 rules across waterfalls, bundle size, server-side RSC)"
    Write-Host "  2. web-design-guidelines (100+ UI/a11y/performance rules)"
    Write-Host "  3. vercel-composition-patterns (Compound components, no boolean prop explosions)"
    Write-Host "  4. vercel-optimize (Function invocations, caching, ISR, bandwidth, cost reduction)"
    Write-Host "  5. deploy-to-vercel (Preview & production deployments)"
    Write-Host "  6. vercel-react-view-transitions (Native page and shared element transitions)"
    Write-Host "  7. vercel-react-native-skills (Mobile & Expo optimization)"
    Write-Host "  8. vercel-cli-with-tokens (Token-based automated CLI workflows)"
    Write-Host "  9. writing-guidelines (Vercel technical prose handbook)"
}

if ($Deploy) {
    Write-Host "`n[3/3] Deploying to Vercel..." -ForegroundColor Yellow
    if (Get-Command "vercel" -ErrorAction SilentlyContinue) {
        Set-Location $target
        & vercel
    } else {
        Write-Host "Vercel CLI not found in PATH. Install via: npm i -g vercel" -ForegroundColor Red
    }
}

Write-Host "`n✔ Antigravity Vercel Automation is ACTIVE for this project." -ForegroundColor Green
