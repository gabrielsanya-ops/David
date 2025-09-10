# Deployment Guide for DbisV1.0 Management Information System

## 🚀 Quick Deployment Rules

This guide provides automated deployment rules for pushing your DbisV1.0 Management Information System from Cursor IDE to your GitHub repository.

## 📋 Prerequisites

- Git installed and configured
- GitHub account with access to `gabrielsanya-ops/David` repository
- Cursor IDE (or any code editor)

## 🔧 Deployment Methods

### Method 1: Automated Scripts (Recommended)

#### For Windows (PowerShell)
```powershell
# Navigate to project directory
cd "G:\OwnApplications\13.David\Tumaini"

# Run deployment script
.\deploy.ps1

# With options
.\deploy.ps1 -Status    # Check git status
.\deploy.ps1 -Log       # Show recent commits
.\deploy.ps1 -Force     # Force deployment
.\deploy.ps1 -Help      # Show help
```

#### For Windows (Command Prompt)
```cmd
# Navigate to project directory
cd "G:\OwnApplications\13.David\Tumaini"

# Run deployment script
deploy.bat
```

#### For Linux/Mac (Bash)
```bash
# Navigate to project directory
cd "/path/to/Tumaini"

# Make script executable
chmod +x deploy.sh

# Run deployment script
./deploy.sh

# With options
./deploy.sh --status    # Check git status
./deploy.sh --log       # Show recent commits
./deploy.sh --force     # Force deployment
./deploy.sh --help      # Show help
```

### Method 2: Manual Git Commands

```bash
# Check status
git status

# Add all changes
git add .

# Commit changes
git commit -m "Update: $(date '+%Y-%m-%d %H:%M:%S') - Deployed from Cursor"

# Push to GitHub
git push origin master
```

### Method 3: Cursor IDE Integration

1. **Open Terminal in Cursor**: `Ctrl+`` (backtick)
2. **Run deployment script**: `.\deploy.ps1` (Windows) or `./deploy.sh` (Linux/Mac)
3. **Or use Git commands**: Follow Method 2 above

## 🔄 Automated CI/CD Pipeline

The project includes a GitHub Actions workflow that automatically:

- ✅ Validates HTML, CSS, and JavaScript
- ✅ Tests application startup
- ✅ Builds the application
- ✅ Deploys to GitHub Pages
- ✅ Creates deployment summaries

### Workflow Triggers

- **Push to master/main branch**: Automatic deployment
- **Pull requests**: Validation and testing
- **Manual trigger**: Via GitHub Actions tab

### Live Deployment

Once deployed, your application will be available at:
- **GitHub Pages**: `https://gabrielsanya-ops.github.io/David`
- **Repository**: `https://github.com/gabrielsanya-ops/David`

## 📁 Project Structure

```
Tumaini/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions CI/CD
├── deploy.sh                   # Linux/Mac deployment script
├── deploy.bat                  # Windows CMD deployment script
├── deploy.ps1                  # Windows PowerShell deployment script
├── index.html                  # Main application file
├── styles.css                  # Application styles
├── script.js                   # Application logic
├── package.json                # Node.js dependencies
└── .gitignore                  # Git ignore rules
```

## 🎯 Deployment Rules Summary

### Rule 1: Always Commit Before Push
```bash
git add .
git commit -m "Descriptive commit message"
git push origin master
```

### Rule 2: Use Deployment Scripts
- **Windows**: `.\deploy.ps1`
- **Linux/Mac**: `./deploy.sh`
- **CMD**: `deploy.bat`

### Rule 3: Check Status Before Deploying
```bash
git status
git log --oneline -5
```

### Rule 4: Automated Validation
The GitHub Actions workflow automatically validates:
- HTML structure
- CSS syntax
- JavaScript syntax
- Application startup

## 🔍 Troubleshooting

### Common Issues

1. **"Repository not found"**
   - Check repository URL: `https://github.com/gabrielsanya-ops/David.git`
   - Verify GitHub access permissions

2. **"No changes to commit"**
   - Check if files are modified: `git status`
   - Use `--force` flag if needed: `.\deploy.ps1 -Force`

3. **"Authentication failed"**
   - Use HTTPS instead of SSH: `git remote set-url origin https://github.com/gabrielsanya-ops/David.git`
   - Or configure SSH keys

4. **"Branch not found"**
   - Create branch: `git checkout -b master`
   - Push with upstream: `git push -u origin master`

### Debug Commands

```bash
# Check git configuration
git config --list

# Check remote URLs
git remote -v

# Check branch status
git branch -a

# Check recent commits
git log --oneline -10

# Check file changes
git diff --name-only
```

## 📊 Deployment Status

### Success Indicators
- ✅ Git push successful
- ✅ GitHub Actions workflow passed
- ✅ Application accessible at GitHub Pages
- ✅ No validation errors

### Monitoring
- **GitHub Actions**: Check Actions tab in repository
- **GitHub Pages**: Check Pages settings in repository
- **Live Site**: Visit `https://gabrielsanya-ops.github.io/David`

## 🚀 Quick Start Commands

```bash
# One-time setup
git init
git remote add origin https://github.com/gabrielsanya-ops/David.git

# Daily deployment
.\deploy.ps1                    # Windows PowerShell
./deploy.sh                     # Linux/Mac
deploy.bat                      # Windows CMD

# Check status
git status
git log --oneline -5
```

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review GitHub Actions logs
3. Verify repository permissions
4. Check network connectivity

---

**Repository**: `https://github.com/gabrielsanya-ops/David.git`  
**Live Site**: `https://gabrielsanya-ops.github.io/David`  
**Last Updated**: $(date '+%Y-%m-%d %H:%M:%S')
