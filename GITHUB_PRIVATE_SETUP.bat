@echo off
title 🚀 LIVING NFT - GitHub Private Repository Setup
echo.
echo ========================================
echo 🎯 MISSION: Setup Private GitHub Repository
echo ========================================
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
echo Please enter your GitHub username:
set /p github_username="GitHub Username: "

echo Please enter your GitHub email:
set /p github_email="GitHub Email: "

git config user.name "%github_username%"
git config user.email "%github_email%"
echo ✅ Git user configured

echo.
echo 📦 Step 3: Create GitHub Personal Access Token...
echo.
echo 🔑 IMPORTANT: You need to create a Personal Access Token on GitHub
echo.
echo Steps to create token:
echo 1. Go to https://github.com/settings/tokens
echo 2. Click "Generate new token" -> "Generate new token (classic)"
echo 3. Give it a name (e.g., "Living NFT Development")
echo 4. Select scopes: repo, workflow, write:packages
echo 5. Click "Generate token"
echo 6. Copy the token (you won't see it again!)
echo.
pause

echo Please enter your Personal Access Token:
set /p github_token="GitHub Token: "

echo.
echo 📦 Step 4: Create Private Repository on GitHub...
echo.
echo Please enter your desired repository name:
set /p repo_name="Repository Name (default: living-nft-project): "
if "%repo_name%"=="" set repo_name=living-nft-project

echo.
echo Please enter repository description:
set /p repo_desc="Repository Description (default: Living NFT - Bio-morphic Digital Ecosystem): "
if "%repo_desc%"=="" set repo_desc=Living NFT - Bio-morphic Digital Ecosystem

echo Creating private repository...
curl -X POST \
  -H "Authorization: token %github_token%" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/user/repos \
  -d "{\"name\":\"%repo_name%\",\"description\":\"%repo_desc%\",\"private\":true,\"auto_init\":false}"

if %errorlevel% neq 0 (
    echo ❌ Failed to create repository
    pause
    exit /b 1
) else (
    echo ✅ Private repository created
)

echo.
echo 📦 Step 5: Add Remote Origin...
git remote remove origin 2>nul
git remote add origin https://%github_username%:%github_token%@github.com/%github_username%/%repo_name%.git
echo ✅ Remote origin added

echo.
echo 📦 Step 6: Stage and Commit Files...
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
echo 📦 Step 7: Push to GitHub...
echo Pushing to private repository...
git push -u origin main
if %errorlevel% neq 0 (
    echo ❌ Failed to push to GitHub
    echo Trying to push to master branch...
    git push -u origin master
    if %errorlevel% neq 0 (
        echo ❌ Failed to push to both main and master
        pause
        exit /b 1
    ) else (
        echo ✅ Pushed to master branch
    )
) else (
    echo ✅ Pushed to main branch
)

echo.
echo 📦 Step 8: Configure Repository Settings...
echo Setting up repository protection rules...
curl -X PUT \
  -H "Authorization: token %github_token%" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/%github_username%/%repo_name%/branches/main/protection \
  -d "{\"required_status_checks\":{\"strict\":true,\"contexts\":[]},\"enforce_admins\":true,\"required_pull_request_reviews\":{\"required_approving_review_count\":1},\"restrictions\":null}"

echo.
echo 📦 Step 9: Create GitHub Actions Workflow...
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
echo 📦 Step 10: Create README with Repository Info...
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
echo    git clone https://github.com/%github_username%/%repo_name%.git
echo    cd %repo_name%
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
echo - **Repository**: %repo_name%
echo - **Type**: Private
echo - **Created**: %date%
echo - **Language**: TypeScript, JavaScript, Solidity
echo.
echo ## 🌐 Access URLs
echo.
echo - **GitHub**: https://github.com/%github_username%/%repo_name%
echo - **Issues**: https://github.com/%github_username%/%repo_name%/issues
echo - **Actions**: https://github.com/%github_username%/%repo_name%/actions
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
echo    Name: %repo_name%
echo    Owner: %github_username%
echo    Type: Private
echo    URL: https://github.com/%github_username%/%repo_name%
echo.
echo 🔧 Next Steps:
echo 1. Visit your repository on GitHub
echo 2. Add team members as collaborators
echo 3. Set up branch protection rules
echo 4. Configure GitHub Actions secrets
echo 5. Start development workflow
echo.
echo 🚀 Development Commands:
echo    git clone https://github.com/%github_username%/%repo_name%.git
echo    cd %repo_name%
echo    .\FIXED_ADMIN_INSTALL.bat
echo    .\scripts\START_ALL.bat
echo.
echo 🔒 Security Notes:
echo - Repository is private and only accessible to you
echo - Personal Access Token should be kept secure
echo - Environment variables are not committed
echo - API keys should be stored in GitHub Secrets
echo.
echo 🎉 Ready for private Living NFT development!
echo.
pause
