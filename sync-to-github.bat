@echo off
cd /d "%~dp0"
git add .
git commit -m "Auto-sync: $(date /t) $(time /t)" || echo "No changes to commit"
git push origin main
echo Sync complete! Check https://github.com/gproatechnology/GProA_CHValueGrowth
pause
