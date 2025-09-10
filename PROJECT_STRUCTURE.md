# DBIS V1.0 项目结构说明

## 项目概述
DBIS V1.0 (Database Integration System) 是一个基于Django的数据库集成系统，提供完整的库存管理、账户管理、燃料管理和系统管理功能。

## 项目结构

```
dbis/
├── dbis/                    # 主项目目录
│   ├── __init__.py
│   ├── settings.py          # Django设置
│   ├── urls.py             # 主URL配置
│   ├── wsgi.py             # WSGI配置
│   └── asgi.py             # ASGI配置
├── stocks/                  # 库存管理模块
│   ├── __init__.py
│   ├── models.py           # 库存模型
│   ├── views.py            # 库存视图
│   ├── urls.py             # 库存URL配置
│   ├── admin.py            # 库存管理界面
│   ├── serializers.py      # 库存序列化器
│   ├── forms.py            # 库存表单
│   ├── management/         # 管理命令
│   ├── templates/          # 库存模板
│   ├── static/             # 库存静态文件
│   └── tests.py            # 库存测试
├── accounts/                # 账户管理模块
│   ├── __init__.py
│   ├── models.py           # 账户模型
│   ├── views.py            # 账户视图
│   ├── urls.py             # 账户URL配置
│   ├── admin.py            # 账户管理界面
│   ├── serializers.py      # 账户序列化器
│   ├── forms.py            # 账户表单
│   ├── management/         # 管理命令
│   ├── templates/          # 账户模板
│   ├── static/             # 账户静态文件
│   └── tests.py            # 账户测试
├── fuel/                    # 燃料管理模块
│   ├── __init__.py
│   ├── models.py           # 燃料模型
│   ├── views.py            # 燃料视图
│   ├── urls.py             # 燃料URL配置
│   ├── admin.py            # 燃料管理界面
│   ├── serializers.py      # 燃料序列化器
│   ├── forms.py            # 燃料表单
│   ├── management/         # 管理命令
│   ├── templates/          # 燃料模板
│   ├── static/             # 燃料静态文件
│   └── tests.py            # 燃料测试
├── administrator/           # 系统管理模块
│   ├── __init__.py
│   ├── models.py           # 管理模型
│   ├── views.py            # 管理视图
│   ├── urls.py             # 管理URL配置
│   ├── admin.py            # 管理界面
│   ├── serializers.py      # 管理序列化器
│   ├── forms.py            # 管理表单
│   ├── management/         # 管理命令
│   ├── templates/          # 管理模板
│   ├── static/             # 管理静态文件
│   └── tests.py            # 管理测试
├── utils/                   # 工具模块
│   ├── __init__.py
│   ├── helpers.py          # 辅助函数
│   ├── validators.py       # 验证器
│   ├── decorators.py       # 装饰器
│   └── exceptions.py       # 自定义异常
├── manage.py               # Django管理脚本
├── requirements.txt        # 依赖包列表
├── README.md              # 项目说明
├── test_app.py            # 测试脚本
├── setup_database.py      # 数据库设置脚本
├── start_server.py        # 服务器启动脚本
├── start_dbis.bat         # Windows启动脚本
├── start_dbis.ps1         # PowerShell启动脚本
└── start_dbis.sh          # Linux/Mac启动脚本
```

## 模块功能

### 1. 库存管理模块 (stocks)
- **设置**: 库存项目、类别、供应商管理
- **交易**: 入库、出库、调拨、盘点
- **报告**: 库存报表、分析报告

### 2. 账户管理模块 (accounts)
- **设置**: 账户类型、科目设置
- **交易**: 收入、支出、转账记录
- **报告**: 财务报表、账户余额

### 3. 燃料管理模块 (fuel)
- **设置**: 燃料站、燃料类型管理
- **交易**: 燃料销售、库存管理
- **报告**: 销售报表、库存报告

### 4. 系统管理模块 (administrator)
- **用户管理**: 用户、角色、权限
- **系统设置**: 配置管理、日志查看
- **数据管理**: 备份、恢复、导入导出

## 技术特性

### 后端技术
- **Django 4.2**: Web框架
- **Django REST Framework**: API开发
- **SQLite**: 默认数据库
- **Django Admin**: 管理界面

### 前端技术
- **Bootstrap 5**: UI框架
- **jQuery**: JavaScript库
- **Chart.js**: 图表库
- **DataTables**: 表格插件

### 功能特性
- **响应式设计**: 支持移动设备
- **多语言支持**: 中文界面
- **权限控制**: 基于角色的访问控制
- **数据验证**: 完整的数据验证
- **错误处理**: 友好的错误提示
- **日志记录**: 完整的操作日志

## 安装和运行

### 1. 环境要求
- Python 3.8+
- Django 4.2+
- 现代浏览器

### 2. 安装步骤
```bash
# 克隆项目
git clone <repository-url>
cd dbis

# 安装依赖
pip install -r requirements.txt

# 设置数据库
python setup_database.py

# 启动服务器
python start_server.py
```

### 3. 快速启动
- **Windows**: 双击 `start_dbis.bat`
- **PowerShell**: 运行 `start_dbis.ps1`
- **Linux/Mac**: 运行 `./start_dbis.sh`

## 访问地址
- **主应用**: http://127.0.0.1:8000
- **管理界面**: http://127.0.0.1:8000/admin
- **API文档**: http://127.0.0.1:8000/api/

## 默认账户
- **用户名**: admin
- **密码**: admin123
- **邮箱**: admin@dbis.com

## 开发说明

### 1. 代码结构
- 遵循Django最佳实践
- 模块化设计，易于扩展
- 完整的测试覆盖
- 详细的文档注释

### 2. 扩展开发
- 添加新模块: 复制现有模块结构
- 自定义功能: 在utils模块中添加
- 数据库迁移: 使用Django迁移系统
- 前端定制: 修改templates和static文件

### 3. 部署建议
- 生产环境使用PostgreSQL或MySQL
- 配置静态文件服务
- 启用HTTPS
- 设置定期备份

## 许可证
本项目采用MIT许可证，详见LICENSE文件。

## 联系方式
- **开发者**: David
- **邮箱**: admin@dbis.com
- **版本**: 1.0
- **更新日期**: 2024年
