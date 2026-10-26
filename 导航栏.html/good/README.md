# 分类页面 - 前后端分离说明

## 概述

本次更新将商品分类页面（服饰、食品、数码）从硬编码数据改为通过 fetch 请求从 `Data.json` 动态获取数据，实现了前后端分离。

## 文件结构

```
导航栏.html/good/
├── cloth_classify.html    # 服饰分类页面
├── food_classify.html     # 食品分类页面
├── sm_classify.html       # 数码分类页面
├── classify.css           # 公共样式文件
├── classify.js          # 数据渲染脚本（新增）
└── README.md            # 说明文档

搜索框/
└── Data.json            # 商品数据（模拟后端接口）
```

## 核心改动

### 1. 新增 classify.js

实现了以下功能：

- **自动识别页面类别**：根据页面标题自动判断当前是数码、食品还是服饰页面
- **fetch 数据请求**：从 `../../搜索框/Data.json` 获取商品数据
- **数据过滤**：根据商品标签（tag）过滤出当前类别的商品
- **动态渲染**：生成商品卡片HTML并插入页面
- **购物车功能**：支持添加商品到购物车（使用 localStorage 存储）

### 2. 修改 HTML 文件

三个分类页面的改动相同：

**改动前：**
```html
<div class="phone-box">
    <div class="phone-box-item">
        <!-- 硬编码的商品数据 -->
    </div>
    <!-- 更多商品... -->
</div>
```

**改动后：**
```html
<div class="phone-box">
    <!-- 商品数据将通过JS动态加载 -->
</div>

<!-- 引入数据渲染脚本 -->
<script src="./classify.js"></script>
```

## 工作原理

### 数据流程

```
页面加载 → DOMContentLoaded → 识别类别 → fetch请求 → 数据过滤 → 渲染商品
```

### 数据格式

`Data.json` 中的商品对象结构：

```json
{
    "id": 1,
    "name": "蓝牙音箱",
    "tag": "数码",
    "price": 99,
    "originalPrice": 199,
    "sales": "1.2万",
    "stock": 158,
    "image": "../image_data/bluebox2.png"
}
```

### 类别映射

- `tag: "数码"` → 数码类（蓝色标签）
- `tag: "食品"` → 食品类（绿色标签）
- `tag: "服饰"` → 服饰类（粉色标签）

## 运行方式

### ⚠️ 重要提示

由于浏览器安全机制（CORS策略），**不能直接通过 file:// 协议打开页面**，必须通过本地服务器访问。

### 方法一：使用 VS Code Live Server（推荐）

1. 在 VS Code 中安装 Live Server 插件
2. 右键点击任意 HTML 文件
3. 选择 "Open with Live Server"
4. 访问路径格式：`http://127.0.0.1:5500/导航栏.html/good/sm_classify.html`

### 方法二：使用 Python 服务器

```bash
# 在项目根目录下执行
python -m http.server 5500
```

然后访问：`http://localhost:5500/导航栏.html/good/sm_classify.html`

## 功能特性

### 1. 数据驱动

- 商品数据统一在 `Data.json` 中管理
- 修改数据无需改动页面代码
- 便于后续对接真实后端接口

### 2. 动态标签生成

- 根据商品类别自动匹配标签颜色
- 随机生成卖点标题（如【爆款推荐】、【新品上市】等）
- 自动添加包邮、服务承诺等额外标签

### 3. 购物车功能

- 点击"立即加入购物车"按钮会触发 `addToCart()` 函数
- 购物车数据存储在 `localStorage` 中
- 支持跨页面购物车数据共享

### 4. 错误处理

- 网络请求失败时显示友好提示
- 控制台输出错误信息便于调试

## API 接口说明

### 当前数据源

```
GET ../../搜索框/Data.json
```

### 后续对接真实接口

只需修改 `classify.js` 中的 `loadProducts()` 函数：

```javascript
function loadProducts(category) {
    // 修改为真实接口地址
    fetch(`https://api.example.com/products?category=${category}`)
        .then(response => response.json())
        .then(data => {
            // 如果接口返回的数据格式不同，需要调整过滤逻辑
            const categoryProducts = data.filter(product => product.tag === category);
            renderProducts(categoryProducts, category);
        })
        .catch(error => {
            console.error('加载商品数据失败:', error);
            showErrorMessage();
        });
}
```

## 调试技巧

### 1. 查看网络请求

打开浏览器开发者工具（F12），切换到 Network 标签，刷新页面，可以看到对 `Data.json` 的请求。

### 2. 查看控制台日志

在 Console 中可以看到：
- 页面类别识别结果
- 数据请求状态
- 商品渲染数量

### 3. 测试购物车

在控制台执行：
```javascript
// 查看购物车数据
JSON.parse(localStorage.getItem('cart'))

// 清空购物车
localStorage.removeItem('cart')
```

## 注意事项

1. **数据路径**：确保 `Data.json` 的相对路径正确
2. **图片路径**：商品图片路径需要根据页面位置调整
3. **跨域问题**：必须通过本地服务器访问，不能直接打开文件
4. **浏览器兼容**：使用了 ES6 语法（如箭头函数、const/let），需要现代浏览器

## 后续优化建议

1. **加载状态**：添加 loading 动画，提升用户体验
2. **分页功能**：商品较多时实现分页或懒加载
3. **搜索功能**：在分类页面添加搜索框
4. **排序功能**：支持按价格、销量等排序
5. **缓存优化**：使用 sessionStorage 或 IndexedDB 缓存数据
6. **错误重试**：网络失败时提供重试按钮

## 技术栈

- 原生 JavaScript（Vanilla JS）
- Fetch API
- localStorage
- CSS3

## 更新日志

### 2024-XX-XX
- ✅ 创建 classify.js 实现数据动态加载
- ✅ 修改三个分类页面移除硬编码数据
- ✅ 支持购物车功能
- ✅ 添加错误处理机制
- ✅ 编写说明文档
