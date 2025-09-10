#!/usr/bin/env python
"""
DBIS V1.0 测试脚本
测试应用程序的基本功能
"""

import os
import sys
import django
from django.conf import settings
from django.test.utils import get_runner

def test_app():
    """测试应用程序"""
    print("=" * 60)
    print("DBIS V1.0 应用程序测试")
    print("=" * 60)
    
    # 设置Django环境
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dbis.settings')
    django.setup()
    
    # 运行测试
    TestRunner = get_runner(settings)
    test_runner = TestRunner()
    failures = test_runner.run_tests(["stocks", "accounts", "fuel", "administrator"])
    
    if failures:
        print(f"\n❌ 测试失败: {failures} 个测试失败")
        return False
    else:
        print("\n✅ 所有测试通过!")
        return True

def check_models():
    """检查模型"""
    print("\n检查模型...")
    try:
        from stocks.models import StockItem, StockTransaction, StockCategory
        from accounts.models import Account, Transaction, AccountType
        from fuel.models import FuelStation, FuelTransaction, FuelType
        from administrator.models import User, Role, Permission
        
        print("✅ 所有模型导入成功")
        return True
    except Exception as e:
        print(f"❌ 模型导入失败: {e}")
        return False

def check_views():
    """检查视图"""
    print("\n检查视图...")
    try:
        from stocks.views import StockItemListView
        from accounts.views import AccountListView
        from fuel.views import FuelStationListView
        from administrator.views import UserListView
        
        print("✅ 所有视图导入成功")
        return True
    except Exception as e:
        print(f"❌ 视图导入失败: {e}")
        return False

def check_urls():
    """检查URL配置"""
    print("\n检查URL配置...")
    try:
        from django.urls import reverse
        from django.test import Client
        
        client = Client()
        
        # 测试主要URL
        urls_to_test = [
            '/stocks/',
            '/accounts/',
            '/fuel/',
            '/administrator/',
        ]
        
        for url in urls_to_test:
            try:
                response = client.get(url)
                print(f"✅ {url} - 状态码: {response.status_code}")
            except Exception as e:
                print(f"❌ {url} - 错误: {e}")
        
        return True
    except Exception as e:
        print(f"❌ URL检查失败: {e}")
        return False

def main():
    """主函数"""
    print("开始测试 DBIS V1.0 应用程序...")
    
    # 检查模型
    if not check_models():
        return False
    
    # 检查视图
    if not check_views():
        return False
    
    # 检查URL配置
    if not check_urls():
        return False
    
    # 运行测试
    if not test_app():
        return False
    
    print("\n" + "=" * 60)
    print("🎉 DBIS V1.0 应用程序测试完成!")
    print("=" * 60)
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
