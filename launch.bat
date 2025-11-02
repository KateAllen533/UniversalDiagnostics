@echo off
echo Starting Universal Diagnostics Server...
echo.
echo This will start the development server and open your browser automatically.
echo.
timeout /t 2 /nobreak >nul

REM Set DATABASE_URL if not already set
if not defined DATABASE_URL (
    set DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy_db
)

echo Starting server...
start /b npm run dev

REM Wait for server to start
timeout /t 8 /nobreak >nul

REM Open browser
echo Opening browser...
start http://localhost:5000

echo.
echo Server is starting in the background.
echo Open http://localhost:5000 in your browser if it didn't open automatically.
echo.
echo Press any key to exit this window (server will keep running)...
pause >nul

