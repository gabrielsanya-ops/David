#!/bin/bash
# DBIS V1.0 启动脚本 (Linux/Mac)
# 数据库集成系统

echo "============================================================"
echo "DBIS V1.0 数据库集成系统"
echo "版本: 1.0"
echo "开发: David"
echo "============================================================"
echo ""

# 检查Python环境
echo "检查Python环境..."
if ! command -v python3 &> /dev/null; then
    echo "错误: 未找到Python3环境"
    echo "请确保已安装Python 3.8或更高版本"
    exit 1
fi

python3 --version
echo ""

# 检查Django环境
echo "检查Django环境..."
if ! python3 -c "import django" &> /dev/null; then
    echo "错误: 未找到Django环境"
    echo "请运行: pip3 install -r requirements.txt"
    exit 1
fi

python3 -c "import django; print('Django版本:', django.get_version())"
echo ""

# 设置数据库
echo "设置数据库..."
python3 setup_database.py
if [ $? -ne 0 ]; then
    echo "错误: 数据库设置失败"
    exit 1
fi

echo ""

# 启动服务器
echo "启动服务器..."
python3 start_server.py

echo ""
echo "服务器已停止"
