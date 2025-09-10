# DBIS V1.0 启动脚本 (PowerShell)
# 数据库集成系统

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "DBIS V1.0 数据库集成系统" -ForegroundColor Yellow
Write-Host "版本: 1.0" -ForegroundColor Yellow
Write-Host "开发: David" -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# 检查Python环境
Write-Host "检查Python环境..." -ForegroundColor Green
try {
    $pythonVersion = python --version 2>&1
    Write-Host "Python版本: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "错误: 未找到Python环境" -ForegroundColor Red
    Write-Host "请确保已安装Python 3.8或更高版本" -ForegroundColor Red
    Read-Host "按任意键退出"
    exit 1
}

# 检查Django环境
Write-Host ""
Write-Host "检查Django环境..." -ForegroundColor Green
try {
    $djangoVersion = python -c "import django; print('Django版本:', django.get_version())" 2>&1
    Write-Host $djangoVersion -ForegroundColor Green
} catch {
    Write-Host "错误: 未找到Django环境" -ForegroundColor Red
    Write-Host "请运行: pip install -r requirements.txt" -ForegroundColor Red
    Read-Host "按任意键退出"
    exit 1
}

# 设置数据库
Write-Host ""
Write-Host "设置数据库..." -ForegroundColor Green
try {
    python setup_database.py
    if ($LASTEXITCODE -ne 0) {
        throw "数据库设置失败"
    }
} catch {
    Write-Host "错误: 数据库设置失败" -ForegroundColor Red
    Read-Host "按任意键退出"
    exit 1
}

# 启动服务器
Write-Host ""
Write-Host "启动服务器..." -ForegroundColor Green
try {
    python start_server.py
} catch {
    Write-Host "错误: 服务器启动失败" -ForegroundColor Red
    Read-Host "按任意键退出"
    exit 1
}

Read-Host "按任意键退出"
