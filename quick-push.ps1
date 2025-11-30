# ================================================================
# QUICK PUSH - Daily Workflow
# Gunakan ini setiap kali mau push perubahan
# ================================================================

param(
    [string]$message = ""
)

Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "  QUICK PUSH - Vault Pulse Center" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

Set-Location "d:\PROJECT Fastwork\vault-pulse-center"

# Check for changes
Write-Host "Checking for changes..." -ForegroundColor Yellow
$status = git status --short

if ($status) {
    Write-Host "Changes detected:" -ForegroundColor Green
    git status --short
    Write-Host ""
    
    # Ask for commit message if not provided
    if ($message -eq "") {
        Write-Host "Enter commit message (or press ENTER for 'update: changes'): " -ForegroundColor Cyan -NoNewline
        $message = Read-Host
        if ($message -eq "") {
            $message = "update: changes"
        }
    }
    
    Write-Host ""
    Write-Host "Step 1: Staging files..." -ForegroundColor Yellow
    git add .
    Write-Host "  ✓ Staged!" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "Step 2: Committing..." -ForegroundColor Yellow
    git commit -m $message
    Write-Host "  ✓ Committed: $message" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "Step 3: Pushing to GitHub..." -ForegroundColor Yellow
    git push origin main
    
    Write-Host ""
    Write-Host "================================================================" -ForegroundColor Green
    Write-Host "  ✓ SUCCESS! Changes pushed to GitHub!" -ForegroundColor Green
    Write-Host "================================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next: Deploy to DomaiNesia" -ForegroundColor Yellow
    Write-Host "  Option 1: cPanel → Setup Node.js App → Restart" -ForegroundColor Gray
    Write-Host "  Option 2: cPanel Terminal → git pull && npm run build" -ForegroundColor Gray
    Write-Host ""
    
} else {
    Write-Host "No changes detected. Nothing to push!" -ForegroundColor Yellow
    Write-Host ""
}

Read-Host "Press ENTER to exit"
