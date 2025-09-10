@echo off
REM Deployment script for DbisV1.0 Management Information System
REM Automatically pushes changes from Cursor to GitHub repository

setlocal enabledelayedexpansion

REM Configuration
set REPO_URL=https://github.com/gabrielsanya-ops/David.git
set BRANCH=master
set PROJECT_NAME=DbisV1.0 Management Information System

REM Colors (Windows doesn't support colors in batch, but we can use echo)
set INFO=[INFO]
set SUCCESS=[SUCCESS]
set WARNING=[WARNING]
set ERROR=[ERROR]

echo %INFO% Starting deployment of %PROJECT_NAME%...
echo.

REM Check if git is initialized
if not exist ".git" (
    echo %ERROR% Git repository not initialized!
    echo %INFO% Initializing git repository...
    git init
)

REM Check if remote origin is set
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo %INFO% Setting up remote origin...
    git remote add origin %REPO_URL%
) else (
    for /f "tokens=*" %%i in ('git remote get-url origin') do set CURRENT_URL=%%i
    if not "!CURRENT_URL!"=="%REPO_URL%" (
        echo %WARNING% Remote origin URL mismatch. Updating...
        git remote set-url origin %REPO_URL%
    )
)

REM Check for changes
echo %INFO% Checking for changes...
git diff --quiet
if errorlevel 1 (
    set HAS_CHANGES=1
) else (
    git diff --cached --quiet
    if errorlevel 1 (
        set HAS_CHANGES=1
    ) else (
        set HAS_CHANGES=0
    )
)

if %HAS_CHANGES%==0 (
    echo %WARNING% No changes to commit.
    goto :end
)

REM Stage changes
echo %INFO% Staging changes...
git add .

REM Get current date and time
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YY=%dt:~2,2%" & set "YYYY=%dt:~0,4%" & set "MM=%dt:~4,2%" & set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%" & set "Min=%dt:~10,2%" & set "Sec=%dt:~12,2%"
set "timestamp=%YYYY%-%MM%-%DD% %HH%:%Min%:%Sec%"

REM Create commit message
echo %INFO% Committing changes...
git commit -m "Update: %timestamp% - Deployed from Cursor IDE"

REM Push to GitHub
echo %INFO% Pushing to GitHub...
git ls-remote --heads origin %BRANCH% | findstr %BRANCH% >nul
if errorlevel 1 (
    echo %INFO% Creating new branch '%BRANCH%' on remote...
    git push -u origin %BRANCH%
) else (
    echo %INFO% Branch '%BRANCH%' exists on remote. Pushing changes...
    git push origin %BRANCH%
)

REM Show summary
echo.
echo %SUCCESS% Deployment completed successfully!
echo.
echo %INFO% Repository: %REPO_URL%
echo %INFO% Branch: %BRANCH%
for /f "tokens=*" %%i in ('git log -1 --pretty=format:"%%h - %%s (%%cr)"') do echo %INFO% Last commit: %%i
echo.
echo %INFO% You can view your project at:
echo %INFO% https://github.com/gabrielsanya-ops/David

:end
pause
