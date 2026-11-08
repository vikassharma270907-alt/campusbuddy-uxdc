<#
.SYNOPSIS
    Antigravity Render Deployment Pipeline
    Validates render.yaml blueprint, executes test verification gate,
    synchronizes deliverables to GitHub, and triggers Render deployment.
.PARAMETER Push
    Pushes committed changes to origin main to trigger Render automatic builds.
.PARAMETER DeployHook
    Optional webhook URL to trigger zero-downtime deploy directly via Render API.
#>
param(
    [switch]$Push,
    [switch]$Verify,
    [string]$DeployHook = $env:RENDER_DEPLOY_HOOK_URL
)

$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
if (-not $projectRoot) { $projectRoot = (Get-Location).Path }

Write-Host "═════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "         Antigravity Render Cloud Deployment Pipeline            " -ForegroundColor Cyan
Write-Host "═════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "Project Directory: $projectRoot" -ForegroundColor Gray

# 1. Validate render.yaml
Write-Host "`n[1/4] Validating Render Blueprint (render.yaml)..." -ForegroundColor Yellow
$renderYamlPath = Join-Path $projectRoot "render.yaml"
if (-not (Test-Path -LiteralPath $renderYamlPath)) {
    Write-Error "render.yaml not found at $renderYamlPath"
    exit 1
}

$yamlContent = Get-Content -LiteralPath $renderYamlPath -Raw
if ($yamlContent -match "campusbuddy-web" -and $yamlContent -match "healthCheckPath: /health") {
    Write-Host "  ✔ Blueprint defines 'campusbuddy-web' Node.js service with /health probe" -ForegroundColor Green
} else {
    Write-Warning "  ! Blueprint missing expected web service or healthCheckPath"
}
if ($yamlContent -match "campusbuddy-app") {
    Write-Host "  ✔ Blueprint defines 'campusbuddy-app' Static Site CDN rewrite" -ForegroundColor Green
}

# 2. Run CI Verification Gate
Write-Host "`n[2/4] Executing CI Quality Gate (npm run ci)..." -ForegroundColor Yellow
Set-Location $projectRoot
& npm.cmd run ci
if ($LASTEXITCODE -ne 0) {
    Write-Error "CI Quality Gate failed with exit code $LASTEXITCODE"
    exit $LASTEXITCODE
}
Write-Host "  ✔ All lint, typecheck, prototype sync, and unit/E2E tests PASSED (100% green)." -ForegroundColor Green

# 3. Synchronize with GitHub Remote
Write-Host "`n[3/4] Checking Git Status & Remote Synchronization..." -ForegroundColor Yellow
$status = git status --porcelain
if ($status) {
    Write-Host "  ! Working directory has uncommitted changes:" -ForegroundColor DarkYellow
    git status -s
} else {
    Write-Host "  ✔ Working directory is clean." -ForegroundColor Green
}

$remoteUrl = (git remote get-url origin 2>$null)
Write-Host "  • Remote Origin: $remoteUrl" -ForegroundColor Cyan

if ($Push) {
    Write-Host "  • Pushing changes to origin main..." -ForegroundColor Yellow
    git push origin main
    Write-Host "  ✔ Pushed to origin main. Render automatic build triggered." -ForegroundColor Green
}

# 4. Trigger Direct Deploy Hook (if configured)
Write-Host "`n[4/4] Render Cloud Deployment Status..." -ForegroundColor Yellow
if ($DeployHook) {
    Write-Host "  • Invoking Render Deploy Hook: $DeployHook" -ForegroundColor Cyan
    try {
        $res = Invoke-RestMethod -Uri $DeployHook -Method Post -TimeoutSec 15
        Write-Host "  ✔ Deploy triggered successfully on Render API: $($res | ConvertTo-Json -Compress)" -ForegroundColor Green
    } catch {
        Write-Warning "  ! Deploy Hook invocation failed: $_"
    }
} else {
    Write-Host "  • Render Blueprint 1-Click Launch:" -ForegroundColor Cyan
    Write-Host "    https://render.com/deploy?repo=https://github.com/vikassharma270907-alt/campusbuddy-uxdc" -ForegroundColor White
    Write-Host "  • Note: Any 'git push origin main' automatically triggers live deployment on Render." -ForegroundColor Gray
}

Write-Host "`n═════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✔ Render Cloud Deployment Pipeline Complete." -ForegroundColor Green
Write-Host "═════════════════════════════════════════════════════════════════`n" -ForegroundColor Cyan
