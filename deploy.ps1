# PowerShell Deployment Script for DbisV1.0 Management Information System
# Automatically pushes changes from Cursor to GitHub repository

param(
    [switch]$Help,
    [switch]$Force,
    [switch]$Status,
    [switch]$Log
)

# Configuration
$REPO_URL = "https://github.com/gabrielsanya-ops/David.git"
$BRANCH = "master"
$PROJECT_NAME = "DbisV1.0 Management Information System"

# Colors for output
$Colors = @{
    Red = "Red"
    Green = "Green"
    Yellow = "Yellow"
    Blue = "Blue"
    White = "White"
}

function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor $Colors.Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor $Colors.Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor $Colors.Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor $Colors.Red
}

function Test-GitStatus {
    if (-not (Test-Path ".git")) {
        Write-Error "Git repository not initialized!"
        Write-Status "Initializing git repository..."
        git init
    }
}

function Test-RemoteOrigin {
    try {
        $currentUrl = git remote get-url origin 2>$null
        if (-not $currentUrl) {
            Write-Status "Setting up remote origin..."
            git remote add origin $REPO_URL
        } elseif ($currentUrl -ne $REPO_URL) {
            Write-Warning "Remote origin URL mismatch. Updating..."
            git remote set-url origin $REPO_URL
        }
    } catch {
        Write-Status "Setting up remote origin..."
        git remote add origin $REPO_URL
    }
}

function Submit-Changes {
    Write-Status "Checking for changes..."
    
    $hasChanges = $false
    
    # Check for unstaged changes
    $unstagedChanges = git diff --name-only
    if ($unstagedChanges) {
        $hasChanges = $true
    }
    
    # Check for staged changes
    $stagedChanges = git diff --cached --name-only
    if ($stagedChanges) {
        $hasChanges = $true
    }
    
    if (-not $hasChanges) {
        Write-Warning "No changes to commit."
        return $false
    }
    
    # Stage all changes
    Write-Status "Staging changes..."
    git add .
    
    # Create commit message
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $commitMessage = @"
Update: $timestamp

Deployed from Cursor IDE
"@
    
    Write-Status "Committing changes..."
    git commit -m $commitMessage
    
    return $true
}

function Push-ToGitHub {
    Write-Status "Pushing to GitHub..."
    
    # Check if branch exists on remote
    $remoteBranches = git ls-remote --heads origin $BRANCH
    if ($remoteBranches) {
        Write-Status "Branch '$BRANCH' exists on remote. Pushing changes..."
        git push origin $BRANCH
    } else {
        Write-Status "Creating new branch '$BRANCH' on remote..."
        git push -u origin $BRANCH
    }
}

function Show-Summary {
    Write-Success "Deployment completed successfully!"
    Write-Host ""
    Write-Status "Repository: $REPO_URL"
    Write-Status "Branch: $BRANCH"
    
    $lastCommit = git log -1 --pretty=format:"%h - %s (%cr)"
    Write-Status "Last commit: $lastCommit"
    Write-Host ""
    Write-Status "You can view your project at:"
    Write-Status "https://github.com/gabrielsanya-ops/David"
}

function Show-Help {
    Write-Host "DbisV1.0 Deployment Script" -ForegroundColor $Colors.Green
    Write-Host ""
    Write-Host "Usage: .\deploy.ps1 [OPTIONS]"
    Write-Host ""
    Write-Host "Options:"
    Write-Host "  -Help      Show this help message"
    Write-Host "  -Force     Force deployment even if no changes"
    Write-Host "  -Status    Show git status"
    Write-Host "  -Log       Show recent commits"
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  .\deploy.ps1              # Deploy changes to GitHub"
    Write-Host "  .\deploy.ps1 -Status      # Check git status"
    Write-Host "  .\deploy.ps1 -Log         # Show recent commits"
}

function Show-Status {
    Write-Status "Git Status:"
    git status
    Write-Host ""
    Write-Status "Recent commits:"
    git log --oneline -5
}

function Show-Log {
    Write-Status "Recent commits:"
    git log --oneline -10
}

# Main execution
if ($Help) {
    Show-Help
    exit 0
}

if ($Status) {
    Show-Status
    exit 0
}

if ($Log) {
    Show-Log
    exit 0
}

if ($Force) {
    Write-Status "Force deployment mode..."
    git add .
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    git commit -m "Force update: $timestamp" 2>$null
    Push-ToGitHub
    Show-Summary
    exit 0
}

# Normal deployment
Write-Status "Starting deployment of $PROJECT_NAME..."
Write-Host ""

# Check prerequisites
Test-GitStatus
Test-RemoteOrigin

# Commit changes
if (Submit-Changes) {
    # Push to GitHub
    Push-ToGitHub
    
    # Show summary
    Show-Summary
} else {
    Write-Warning "No changes to deploy."
}
