#!/usr/bin/env python
"""
DBIS V1.0 数据库迁移脚本
创建数据库表和执行初始数据迁移
"""

import os
import sys
import django
from django.core.management import execute_from_command_line

def setup_database():
    """设置数据库"""
    print("=" * 60)
    print("DBIS V1.0 数据库设置")
    print("=" * 60)
    
    # 设置Django环境
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dbis.settings')
    django.setup()
    
    try:
        # 创建迁移文件
        print("1. 创建迁移文件...")
        execute_from_command_line(['manage.py', 'makemigrations'])
        
        # 执行迁移
        print("2. 执行数据库迁移...")
        execute_from_command_line(['manage.py', 'migrate'])
        
        # 创建超级用户
        print("3. 创建超级用户...")
        execute_from_command_line(['manage.py', 'createsuperuser', '--noinput', '--username', 'admin', '--email', 'admin@dbis.com'])
        
        # 加载初始数据
        print("4. 加载初始数据...")
        execute_from_command_line(['manage.py', 'loaddata', 'initial_data.json'])
        
        print("\n✅ 数据库设置完成!")
        return True
        
    except Exception as e:
        print(f"\n❌ 数据库设置失败: {e}")
        return False

def main():
    """主函数"""
    print("开始设置 DBIS V1.0 数据库...")
    
    if setup_database():
        print("\n" + "=" * 60)
        print("🎉 数据库设置完成!")
        print("=" * 60)
        print("现在可以运行以下命令启动应用程序:")
        print("python manage.py runserver")
        print("=" * 60)
        return True
    else:
        print("\n❌ 数据库设置失败!")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
