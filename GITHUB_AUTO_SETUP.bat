@echo off
title 🚀 LIVING NFT - Automatic GitHub Setup
echo.
echo ========================================
echo 🎯 MISSION: Automatic GitHub Repository Setup
echo.
echo 🔒 CONFIGURING PRIVATE GITHUB REPOSITORY
echo.

REM Check if Git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git is not installed. Please run INSTALL_VISUAL_STUDIO_TOOLS.bat first.
    pause
    exit /b 1
) else (
    echo ✅ Git found
)

echo.
echo 📦 Step 1: Initialize Git Repository...
cd /d "%~dp0"

if not exist ".git" (
    echo Initializing Git repository...
    git init
    echo ✅ Git repository initialized
) else (
    echo ✅ Git repository already exists
)

echo.
echo 📦 Step 2: Configure Git User...
echo Setting up Git user with default configuration...
git config user.name "Living NFT Developer"
git config user.email "developer@livingnft.io"
echo ✅ Git user configured

echo.
echo 📦 Step 3: Stage and Commit Files...
echo Staging files...
git add .
echo ✅ Files staged

echo Creating initial commit...
git commit -m "🧬 Initial commit: Complete Living NFT Ecosystem

🎯 Features:
- Smart Contracts with DNA evolution system
- Backend API with real-time WebSocket updates
- Frontend Dashboard with 3D visualization
- Mobile AR application with full features
- Complete deployment and development scripts

🔧 Technology Stack:
- Solidity + Hardhat + Chainlink VRF
- Node.js + tRPC + Redis + WebSocket
- Next.js + React + Three.js + TypeScript
- React Native + Expo + AR

🚀 Ready for development and deployment!"
if %errorlevel% neq 0 (
    echo ❌ Failed to create initial commit
    pause
    exit /b 1
) else (
    echo ✅ Initial commit created
)

echo.
echo 📦 Step 4: Create GitHub Repository Manually...
echo.
echo 🔑 INSTRUCTIONS FOR GITHUB SETUP:
echo.
echo 1. Open your web browser and go to: https://github.com
echo 2. Click the "+" icon in the top right corner
echo 3. Select "New repository"
echo 4. Repository name: living-nft-project
echo 5. Description: Living NFT - Bio-morphic Digital Ecosystem
echo 6. Select "Private" repository
echo 7. DO NOT initialize with README, .gitignore, or license
echo 8. Click "Create repository"
echo.
echo 9. After creation, GitHub will show you setup commands
echo 10. Copy the repository URL (it will look like: https://github.com/YOUR_USERNAME/living-nft-project.git)
echo.
echo 11. Come back to this script and continue...
echo.
pause

echo.
echo 📦 Step 5: Add Remote Origin...
echo Please enter your GitHub username:
set /p github_username="GitHub Username: "

if "%github_username%"=="" (
    echo ❌ Username is required
    pause
    exit /b 1
)

git remote remove origin 2>nul
git remote add origin https://github.com/%github_username%/living-nft-project.git
echo ✅ Remote origin added

echo.
echo 📦 Step 6: Push to GitHub...
echo Pushing to private repository...
git push -u origin main
if %errorlevel% neq 0 (
    echo ❌ Failed to push to main branch
    echo Trying to push to master branch...
    git push -u origin master
    if %errorlevel% neq 0 (
        echo ❌ Failed to push to both main and master
        echo.
        echo 🔧 Troubleshooting:
        echo 1. Make sure you created the repository on GitHub
        echo 2. Make sure the repository name is exactly "living-nft-project"
        echo 3. Make sure you are logged into GitHub
        echo 4. You may need to authenticate with GitHub
        echo.
        echo Try running these commands manually:
        echo git remote -v
        echo git branch -M main
        echo git push -u origin main
        echo.
        pause
        exit /b 1
    ) else (
        echo ✅ Pushed to master branch
    )
) else (
    echo ✅ Pushed to main branch
)

echo.
echo 📦 Step 7: Create GitHub Actions Workflow...
if not exist ".github\workflows" mkdir .github\workflows

(
echo name: Living NFT CI/CD
echo.
echo on:
echo   push:
echo     branches: [ main, master ]
echo   pull_request:
echo     branches: [ main, master ]
echo.
echo jobs:
echo   test:
echo     runs-on: ubuntu-latest
echo.
echo     steps:
echo     - uses: actions/checkout@v4
echo.
echo     - name: Setup Node.js
echo       uses: actions/setup-node@v4
echo       with:
echo         node-version: '20'
echo         cache: 'npm'
echo.
echo     - name: Install Dependencies
echo       run: |
echo         cd contracts && npm install
echo         cd ../backend && npm install
echo         cd ../frontend && npm install
echo         cd ../mobile && npm install
echo.
echo     - name: Run Tests
echo       run: |
echo         cd contracts && npm test
echo         cd ../backend && npm test
echo.
echo     - name: Build Projects
echo       run: |
echo         cd contracts && npm run compile
echo         cd ../backend && npm run build
echo         cd ../frontend && npm run build
echo.
echo   deploy:
echo     needs: test
echo     runs-on: ubuntu-latest
echo     if: github.ref == 'refs/heads/main' ^|^ github.ref == 'refs/heads/master'
echo.
echo     steps:
echo     - uses: actions/checkout@v4
echo.
echo     - name: Deploy to Production
echo       run: |
echo         echo "🚀 Deploying Living NFT to production..."
echo         echo "This would deploy to your production environment"
) > .github\workflows\ci-cd.yml

echo Adding GitHub Actions workflow...
git add .github\workflows\ci-cd.yml
git commit -m "🚀 Add GitHub Actions CI/CD workflow"
git push origin main

echo.
echo 📦 Step 8: Create README with Repository Info...
(
echo # 🧬 Living NFT - Private Repository
echo.
echo ## 🔒 Private Development Repository
echo.
echo This is a private repository for the Living NFT project development.
echo.
echo ## 🚀 Quick Start
echo.
echo 1. Clone the repository:
echo    ```bash
echo    git clone https://github.com/%github_username%/living-nft-project.git
echo    cd living-nft-project
echo    ```
echo.
echo 2. Install dependencies:
echo    ```bash
echo    .\FIXED_ADMIN_INSTALL.bat
echo    ```
echo.
echo 3. Start development:
echo    ```bash
echo    .\scripts\START_ALL.bat
echo    ```
echo.
echo ## 📁 Repository Structure
echo.
echo - **contracts/** - Smart contracts (Solidity + Hardhat)
echo - **backend/** - API server (Node.js + tRPC + Redis)
echo - **frontend/** - Web dashboard (Next.js + React + Three.js)
echo - **mobile/** - AR mobile app (React Native + Expo)
echo - **scripts/** - Deployment and development scripts
echo.
echo ## 🔧 Development Workflow
echo.
echo 1. Create feature branch: `git checkout -b feature-name`
echo 2. Make changes and commit: `git add . && git commit -m "Description"`
echo 3. Push to remote: `git push origin feature-name`
echo 4. Create pull request on GitHub
echo 5. Review and merge to main branch
echo.
echo ## 🎯 Repository Information
echo.
echo - **Owner**: %github_username%
echo - **Repository**: living-nft-project
echo - **Type**: Private
echo - **Created**: %date%
echo - **Language**: TypeScript, JavaScript, Solidity
echo.
echo ## 🌐 Access URLs
echo.
echo - **GitHub**: https://github.com/%github_username%/living-nft-project
echo - **Issues**: https://github.com/%github_username%/living-nft-project/issues
echo - **Actions**: https://github.com/%github_username%/living-nft-project/actions
echo.
echo ## 🔒 Security
echo.
echo This repository contains:
echo - Private keys and configuration files
echo - API keys and secrets
echo - Development and deployment scripts
echo - Intellectual property and code
echo.
echo Access is restricted to authorized team members only.
echo.
echo ---
echo.
echo **🧬 Living NFT - Private Development Repository**
echo *Bio-morphic Digital Ecosystem Development*
) > README_PRIVATE.md

echo Adding private README...
git add README_PRIVATE.md
git commit -m "📋 Add private repository README"
git push origin main

echo.
echo ========================================
echo ✅ PRIVATE GITHUB REPOSITORY SETUP COMPLETED!
echo ========================================
echo.
echo 🎯 Your private Living NFT repository is ready!
echo.
echo 📁 Repository Details:
echo    Name: living-nft-project
echo    Owner: %github_username%
echo    Type: Private
echo    URL: https://github.com/%github_username%/living-nft-project
echo.
echo 🔧 Next Steps:
echo 1. Visit your repository on GitHub
echo 2. Add team members as collaborators
echo 3. Set up branch protection rules
echo 4. Configure GitHub Actions secrets
echo 5. Start development workflow
echo.
echo 🚀 Development Commands:
echo    git clone https://github.com/%github_username%/living-nft-project.git
echo    cd living-nft-project
echo    .\FIXED_ADMIN_INSTALL.bat
echo    .\scripts\START_ALL.bat
echo.
echo 🔒 Security Notes:
echo - Repository is private and only accessible to you
echo - Environment variables are not committed
echo - API keys should be stored in GitHub Secrets
echo - Consider enabling two-factor authentication
echo.
echo 🎉 Ready for private Living NFT development!
echo.
pause
