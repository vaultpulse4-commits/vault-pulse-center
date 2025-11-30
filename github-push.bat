@echo off
REM ================================================================
REM VAULT PULSE CENTER - GitHub Push Script
REM Safely removes .env and pushes to GitHub
REM ================================================================

setlocal enabledelayedexpansion

cd /d "d:\PROJECT Fastwork\vault-pulse-center"

echo.
echo ================================================================
echo  VAULT PULSE CENTER - GitHub Push Preparation
echo ================================================================
echo.

echo [1/5] Checking git status...
git status
echo.

echo [2/5] Removing server/.env from git (keeping local copy)...
git rm --cached server/.env
echo.

echo [3/5] Committing the removal...
git add .gitignore server/.gitignore
git commit -m "security: remove .env from git history, improve gitignore"
echo.

echo [4/5] Verifying clean state...
git status
echo.

echo [5/5] Ready to push! Press ENTER to push to GitHub...
pause

echo Pushing to GitHub...
git push origin main

echo.
echo ================================================================
echo  SUCCESS! Code pushed to GitHub!
echo ================================================================
echo.
echo Verify here:
echo https://github.com/digimom462-cell/vault-pulse-center
echo.
echo Next step: Login to DomaiNesia cPanel and follow
echo DOMAINESIA_OPTIMAL_STRATEGY.md
echo.
pause
