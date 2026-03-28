@echo off
echo Pornesc serverul web...
cd /d "%~dp0"
python server_web.py
echo.
echo Server oprit. Apasa o tasta pentru a inchide fereastra.
pause > nul