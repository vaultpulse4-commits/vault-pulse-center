# ================================================================
# SIMPLE WORKFLOW - First Time Setup
# Jalankan sekali untuk setup GitHub connection
# ================================================================

Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "  VAULT PULSE CENTER - First Time GitHub Setup" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

Set-Location "d:\PROJECT Fastwork\vault-pulse-center"

Write-Host "Step 1: Fix Git Remote..." -ForegroundColor Yellow

# Remove existing remote (jika ada)
$remoteExists = git remote -v 2>&1
if ($remoteExists -match "origin") {
    Write-Host "  → Removing existing remote..." -ForegroundColor Gray
    git remote remove origin 2>$null
}

# Add remote
Write-Host "  → Adding GitHub remote..." -ForegroundColor Gray
git remote add origin https://github.com/digimom462-cell/vault-pulse-center.git

Write-Host "  ✓ Git remote configured!" -ForegroundColor Green
Write-Host ""

Write-Host "Step 2: Remove .env from git..." -ForegroundColor Yellow
git rm --cached server/.env 2>$null
Write-Host "  ✓ .env removed!" -ForegroundColor Green
Write-Host ""

Write-Host "Step 3: Stage all files..." -ForegroundColor Yellow
git add .
Write-Host "  ✓ Files staged!" -ForegroundColor Green
Write-Host ""

Write-Host "Step 4: Commit..." -ForegroundColor Yellow
git commit -m "initial: ready for deployment - vault pulse center"
Write-Host "  ✓ Committed!" -ForegroundColor Green
Write-Host ""

Write-Host "Step 5: Push to GitHub..." -ForegroundColor Yellow
Write-Host "  → Creating main branch..." -ForegroundColor Gray
git branch -M main

Write-Host "  → Pushing to GitHub (this may take 1-2 minutes)..." -ForegroundColor Gray
git push -u origin main

Write-Host ""
Write-Host "================================================================" -ForegroundColor Green
Write-Host "  ✓ SUCCESS! Code pushed to GitHub!" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Verify here:" -ForegroundColor Cyan
Write-Host "https://github.com/digimom462-cell/vault-pulse-center" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next: Deploy to DomaiNesia following DOMAINESIA_OPTIMAL_STRATEGY.md" -ForegroundColor Yellow
Write-Host ""
Write-Host "For future edits, use: .\quick-push.ps1" -ForegroundColor Magenta
Write-Host ""

Read-Host "Press ENTER to exit"
