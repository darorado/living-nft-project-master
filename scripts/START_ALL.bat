@echo off
title 🧬 LIVING NFT - Start All Services
echo.
echo ========================================
echo 🎯 MISSION: Start Complete Living NFT System
echo ========================================
echo.
echo 🚀 STARTING ALL SERVICES...
echo.

REM Navigate to project root
cd /d "%~dp0"

echo.
echo 📦 Step 1: Check Dependencies...
echo Checking if all required tools are installed...

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please run INSTALL_VISUAL_STUDIO_TOOLS.bat first.
    pause
    exit /b 1
) else (
    echo ✅ Node.js found
)

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please run INSTALL_VISUAL_STUDIO_TOOLS.bat first.
    pause
    exit /b 1
) else (
    echo ✅ npm found
)

echo.
echo 📦 Step 2: Install Dependencies...
echo Installing contracts dependencies...
cd contracts
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install contracts dependencies
    pause
    exit /b 1
) else (
    echo ✅ Contracts dependencies installed
)

echo Installing backend dependencies...
cd ..\backend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
) else (
    echo ✅ Backend dependencies installed
)

echo Installing frontend dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
) else (
    echo ✅ Frontend dependencies installed
)

echo Installing mobile dependencies...
cd ..\mobile
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install mobile dependencies
    pause
    exit /b 1
) else (
    echo ✅ Mobile dependencies installed
)

echo.
echo 📦 Step 3: Compile Smart Contracts...
cd ..\contracts
call npm run compile
if %errorlevel% neq 0 (
    echo ❌ Failed to compile contracts
    pause
    exit /b 1
) else (
    echo ✅ Smart contracts compiled
)

echo.
echo 📦 Step 4: Start Blockchain Node...
echo Starting Hardhat local blockchain...
start "Hardhat Node" cmd /k "cd /d %~dp0contracts && npm run node"
timeout /t 5 >nul

echo.
echo 📦 Step 5: Deploy Smart Contracts...
echo Deploying contracts to local network...
call npm run deploy:local
if %errorlevel% neq 0 (
    echo ❌ Failed to deploy contracts
    pause
    exit /b 1
) else (
    echo ✅ Smart contracts deployed
)

echo.
echo 📦 Step 6: Start Backend Server...
echo Starting tRPC backend server...
start "Backend Server" cmd /k "cd /d %~dp0backend && npm run dev"
timeout /t 3 >nul

echo.
echo 📦 Step 7: Start Frontend Server...
echo Starting Next.js frontend...
start "Frontend Server" cmd /k "cd /d %~dp0frontend && npm run dev"
timeout /t 3 >nul

echo.
echo 📦 Step 8: Start Mobile Development Server...
echo Starting Expo mobile server...
start "Mobile Server" cmd /k "cd /d %~dp0mobile && npm start"
timeout /t 3 >nul

echo.
echo ========================================
echo ✅ ALL SERVICES STARTED SUCCESSFULLY!
echo ========================================
echo.
echo 🎯 Living NFT System is now running!
echo.
echo 🌐 Access URLs:
echo    Frontend:      http://localhost:3000
echo    Backend:       http://localhost:3001
echo    Blockchain:    http://localhost:8545
echo    Mobile:        Scan QR code with Expo Go
echo.
echo 📱 Mobile Setup:
echo 1. Install Expo Go app on your phone
echo 2. Scan the QR code from the mobile terminal
echo 3. Open the app and connect your wallet
echo.
echo 🎮 Quick Start:
echo 1. Open http://localhost:3000 in your browser
echo 2. Connect your wallet (MetaMask)
echo 3. Mint your first Living NFT
echo 4. Watch it evolve in real-time!
echo.
echo 🔧 Development Tools:
echo - Frontend: Next.js + React + Three.js
echo - Backend: tRPC + Express + Redis
echo - Mobile: React Native + Expo + AR
echo - Blockchain: Hardhat + Solidity + VRF
echo.
echo 🎉 Ready for Living NFT Development!
echo.
echo ⚠️  Keep this window open to run all services
echo    Closing this window will stop all servers
echo.
pause
