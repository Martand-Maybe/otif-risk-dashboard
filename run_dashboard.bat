@echo off
cls
echo ===================================================
echo        OTIF Risk Dashboard Launcher
echo ===================================================
echo.

:: Navigate to project directory
cd /d "%~dp0otif-dashboard"

:: Check/Install dependencies
if not exist "node_modules\" (
    echo Installing dependencies...
    echo.
    call npm install
)

:: Build the project
echo Building dashboard...
call npm run build
if errorlevel 1 (
    echo.
    echo Build failed!
    pause
    exit
)

echo.
echo ===================================================
echo Dashboard ready! Opening browser...
echo Server: http://localhost:4173
echo.
echo KEEP THIS WINDOW OPEN while using the dashboard
echo Close this window to stop the server
echo ===================================================
echo.

:: Open browser after a short delay
start /min cmd /c "timeout /t 2 >nul && start http://localhost:4173"

:: Start server (keeps window open)
call npm run preview

pause
