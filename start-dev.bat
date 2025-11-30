@echo off
echo ========================================
echo Starting Vault Pulse Center
echo ========================================
echo.
echo Starting Backend Server...
echo.

cd server
start cmd /k "npm run dev"

timeout /t 3 /nobreak >nul

cd ..
echo.
echo Starting Frontend Development Server...
echo.
start cmd /k "npm run dev"

echo.
echo ========================================
echo Servers Started!
echo ========================================
echo.
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit this window...
echo (Servers will continue running in separate windows)
pause >nul
