@echo off
echo ============================================================
echo DBIS V1.0 数据库集成系统
echo 版本: 1.0
echo 开发: David
echo ============================================================
echo.

echo 检查Python环境...
python --version
if %errorlevel% neq 0 (
    echo 错误: 未找到Python环境
    echo 请确保已安装Python 3.8或更高版本
    pause
    exit /b 1
)

echo.
echo 检查Django环境...
python -c "import django; print('Django版本:', django.get_version())"
if %errorlevel% neq 0 (
    echo 错误: 未找到Django环境
    echo 请运行: pip install -r requirements.txt
    pause
    exit /b 1
)

echo.
echo 设置数据库...
python setup_database.py
if %errorlevel% neq 0 (
    echo 错误: 数据库设置失败
    pause
    exit /b 1
)

echo.
echo 启动服务器...
python start_server.py

pause
