# ================================================================
# VAULT PULSE CENTER - GitHub Push Script (PowerShell)
# Safely removes .env and pushes to GitHub
# ================================================================

Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "  VAULT PULSE CENTER - GitHub Push Preparation" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to project
cd "d:\PROJECT Fastwork\vault-pulse-center"

# Step 1: Check status
Write-Host "[1/5] Checking git status..." -ForegroundColor Yellow
git status
Write-Host ""

# Step 2: Remove .env from git
Write-Host "[2/5] Removing server/.env from git (keeping local copy)..." -ForegroundColor Yellow
git rm --cached server/.env
Write-Host ""

# Step 3: Commit changes
Write-Host "[3/5] Committing the removal..." -ForegroundColor Yellow
git add .gitignore server/.gitignore
git commit -m "security: remove .env from git history, improve gitignore"
Write-Host ""

# Step 4: Verify clean state
Write-Host "[4/5] Verifying clean state..." -ForegroundColor Yellow
git status
Write-Host ""

# Step 5: Push to GitHub
Write-Host "[5/5] Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "Press ENTER to continue..." -ForegroundColor Magenta
Read-Host

git push origin main

Write-Host ""
Write-Host "================================================================" -ForegroundColor Green
Write-Host "  SUCCESS! Code pushed to GitHub!" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Verify here:" -ForegroundColor Cyan
Write-Host "https://github.com/digimom462-cell/vault-pulse-center" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next step: Login to DomaiNesia cPanel and follow" -ForegroundColor Yellow
Write-Host "DOMAINESIA_OPTIMAL_STRATEGY.md" -ForegroundColor Yellow
Write-Host ""

Read-Host "Press ENTER to exit"
