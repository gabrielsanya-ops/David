#!/bin/bash
# Deployment script for DbisV1.0 Management Information System
# Automatically pushes changes from Cursor to GitHub repository

set -e  # Exit on any error

# Configuration
REPO_URL="https://github.com/gabrielsanya-ops/David.git"
BRANCH="master"
PROJECT_NAME="DbisV1.0 Management Information System"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if git is initialized
check_git_status() {
    if [ ! -d ".git" ]; then
        print_error "Git repository not initialized!"
        print_status "Initializing git repository..."
        git init
    fi
}

# Function to check if remote origin is set
check_remote_origin() {
    if ! git remote get-url origin > /dev/null 2>&1; then
        print_status "Setting up remote origin..."
        git remote add origin "$REPO_URL"
    else
        CURRENT_URL=$(git remote get-url origin)
        if [ "$CURRENT_URL" != "$REPO_URL" ]; then
            print_warning "Remote origin URL mismatch. Updating..."
            git remote set-url origin "$REPO_URL"
        fi
    fi
}

# Function to stage and commit changes
commit_changes() {
    print_status "Checking for changes..."
    
    # Check if there are any changes
    if git diff --quiet && git diff --cached --quiet; then
        print_warning "No changes to commit."
        return 1
    fi
    
    # Add all changes
    print_status "Staging changes..."
    git add .
    
    # Get list of changed files
    CHANGED_FILES=$(git diff --cached --name-only)
    
    # Create commit message
    COMMIT_MSG="Update: $(date '+%Y-%m-%d %H:%M:%S')
    
Files changed:
$(echo "$CHANGED_FILES" | sed 's/^/- /')
    
Deployed from Cursor IDE"
    
    print_status "Committing changes..."
    git commit -m "$COMMIT_MSG"
    
    return 0
}

# Function to push to GitHub
push_to_github() {
    print_status "Pushing to GitHub..."
    
    # Check if branch exists on remote
    if git ls-remote --heads origin "$BRANCH" | grep -q "$BRANCH"; then
        print_status "Branch '$BRANCH' exists on remote. Pushing changes..."
        git push origin "$BRANCH"
    else
        print_status "Creating new branch '$BRANCH' on remote..."
        git push -u origin "$BRANCH"
    fi
}

# Function to show deployment summary
show_summary() {
    print_success "Deployment completed successfully!"
    echo ""
    print_status "Repository: $REPO_URL"
    print_status "Branch: $BRANCH"
    print_status "Last commit: $(git log -1 --pretty=format:'%h - %s (%cr)')"
    echo ""
    print_status "You can view your project at:"
    print_status "https://github.com/gabrielsanya-ops/David"
}

# Main deployment function
deploy() {
    print_status "Starting deployment of $PROJECT_NAME..."
    echo ""
    
    # Check prerequisites
    check_git_status
    check_remote_origin
    
    # Commit changes
    if commit_changes; then
        # Push to GitHub
        push_to_github
        
        # Show summary
        show_summary
    else
        print_warning "No changes to deploy."
    fi
}

# Function to show help
show_help() {
    echo "DbisV1.0 Deployment Script"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -h, --help     Show this help message"
    echo "  -f, --force    Force deployment even if no changes"
    echo "  -s, --status   Show git status"
    echo "  -l, --log      Show recent commits"
    echo ""
    echo "Examples:"
    echo "  $0              # Deploy changes to GitHub"
    echo "  $0 --status     # Check git status"
    echo "  $0 --log        # Show recent commits"
}

# Function to show git status
show_status() {
    print_status "Git Status:"
    git status
    echo ""
    print_status "Recent commits:"
    git log --oneline -5
}

# Function to show recent commits
show_log() {
    print_status "Recent commits:"
    git log --oneline -10
}

# Parse command line arguments
case "${1:-}" in
    -h|--help)
        show_help
        exit 0
        ;;
    -f|--force)
        print_status "Force deployment mode..."
        git add .
        git commit -m "Force update: $(date '+%Y-%m-%d %H:%M:%S')" || true
        push_to_github
        show_summary
        ;;
    -s|--status)
        show_status
        ;;
    -l|--log)
        show_log
        ;;
    "")
        deploy
        ;;
    *)
        print_error "Unknown option: $1"
        show_help
        exit 1
        ;;
esac
