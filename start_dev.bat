@echo off
title AanuBlooms Full-Stack Dev Mode
color 0B
echo ========================================================
echo   🌸 Starting AanuBlooms (Backend + Vite Dev Server) 🌸
echo ========================================================
echo.
cd /d "%~dp0backend"
echo [1/3] Starting Backend Server (Port 5000)...
start "AanuBlooms Backend (Port 5000)" cmd /k "title AanuBlooms API (Port 5000) && node server.js"
timeout /t 2 >nul

cd /d "%~dp0frontend"
echo [2/3] Starting Vite Frontend Server (Port 5173)...
start "AanuBlooms Vite Dev (Port 5173)" cmd /k "title AanuBlooms Vite (Port 5173) && npm run dev"
timeout /t 3 >nul

echo [3/3] Opening browser at http://localhost:5173...
start http://localhost:5173
echo.
echo ========================================================
echo   ✅ Both servers started!
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:5000
echo   Keep the two command windows open!
echo ========================================================
pause
