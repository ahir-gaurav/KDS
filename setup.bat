@echo off
echo ==========================================
echo KICKS DON'T STINK - MASTER INSTALLER
echo ==========================================

echo [1/3] Installing Backend Dependencies...
cd backend
call npm install
cd ..

echo [2/3] Installing Frontend Dependencies...
cd frontend
call npm install
cd ..

echo [3/3] Installing Admin Dependencies...
cd admin
call npm install
cd ..

echo ==========================================
echo ALL SYSTEMS GO. READY FOR DEPLOYMENT.
echo ==========================================
pause
