@echo off
title AanuBlooms Handcrafted Boutique & Studio
color 0D
echo ========================================================
echo   🌸 Starting AanuBlooms Boutique & Studio Server 🌸
echo ========================================================
echo.
cd /d "%~dp0backend"
echo [1/2] Launching persistent store server on Port 5000...
start "AanuBlooms Storefront & Backend" cmd /k "title AanuBlooms Server (Port 5000 - Keep This Open) && node server.js"
timeout /t 2 >nul
echo [2/2] Opening boutique at http://localhost:5000...
start http://localhost:5000
echo.
echo ========================================================
echo   ✅ Boutique is Live at: http://localhost:5000
echo   Keep the small server window open while browsing!
echo ========================================================
pause
