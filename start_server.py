#!/usr/bin/env python
"""
DBIS V1.0 启动脚本
启动Django开发服务器
"""

import os
import sys
import django
from django.core.management import execute_from_command_line

def start_server():
    """启动服务器"""
    print("=" * 60)
    print("DBIS V1.0 启动中...")
    print("=" * 60)
    
    # 设置Django环境
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dbis.settings')
    django.setup()
    
    try:
        print("启动Django开发服务器...")
        print("访问地址: http://127.0.0.1:8000")
        print("按 Ctrl+C 停止服务器")
        print("=" * 60)
        
        # 启动服务器
        execute_from_command_line(['manage.py', 'runserver'])
        
    except KeyboardInterrupt:
        print("\n\n服务器已停止")
        return True
    except Exception as e:
        print(f"\n❌ 服务器启动失败: {e}")
        return False

def main():
    """主函数"""
    print("DBIS V1.0 数据库集成系统")
    print("版本: 1.0")
    print("开发: David")
    print("=" * 60)
    
    if start_server():
        return True
    else:
        print("\n❌ 服务器启动失败!")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
