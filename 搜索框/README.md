# 搜索功能后端数据使用说明

## 概述
现在搜索功能已经改为从后端 `Data.json` 文件获取商品数据，实现了前后端分离的数据管理方式。

## 文件说明
- `Data.json` - 后端商品数据文件（标准JSON格式）
- `research_classfy.js` - 搜索功能JavaScript（已改为通过fetch获取数据）
- `server.py` - Python本地开发服务器

## 启动方法

### 方法一：使用Python服务器（推荐）

1. **确保已安装Python**
   - 访问 https://www.python.org 下载并安装Python 3.x版本

2. **启动服务器**
   ```bash
   # 在项目根目录下运行
   python server.py
   ```

3. **访问页面**
   - 服务器会自动打开浏览器
   - 或手动访问: http://localhost:8000/搜索框/research_classify.html

### 方法二：使用VS Code Live Server插件

1. 安装 "Live Server" 插件
2. 右键点击 `research_classify.html`
3. 选择 "Open with Live Server"

### 方法三：使用其他Web服务器

如果您熟悉其他Web服务器（如Apache、Nginx、Node.js等），也可以配置使用。

## 数据格式

`Data.json` 使用标准JSON格式，包含以下字段：

```json
{
    "id": 1,                          // 商品ID（唯一）
    "name": "蓝牙音箱",                // 商品名称
    "tag": "数码",                     // 商品标签/分类
    "price": 99,                       // 当前价格
    "originalPrice": 199,              // 原价
    "sales": "1.2万",                  // 销量
    "stock": 158,                      // 库存
    "image": "../image_data/bluebox2.png"  // 图片路径
}
```

## 搜索功能说明

1. **关键词搜索**：支持按商品名称或标签搜索
2. **实时加载**：页面加载时自动从后端获取数据
3. **错误处理**：数据加载失败时会显示友好提示

## 常见问题

### Q1: 为什么需要服务器？
**A**: 浏览器出于安全考虑，不允许JavaScript通过fetch读取本地文件（file://协议）。必须通过HTTP协议访问。

### Q2: 如何添加新商品？
**A**: 编辑 `Data.json` 文件，按照现有格式添加新的商品对象即可。注意：
- 确保JSON格式正确（可以使用在线JSON验证工具）
- id必须唯一且递增
- 所有必填字段都要完整

### Q3: 数据加载失败怎么办？
**A**: 
1. 检查服务器是否正常启动
2. 检查Data.json文件是否存在且格式正确
3. 打开浏览器控制台（F12）查看错误信息

### Q4: 可以部署到真正的服务器吗？
**A**: 可以！这个方案完全兼容生产环境。只需要：
1. 将Data.json部署到服务器
2. 修改fetch的URL路径指向服务器地址
3. 配置好CORS（跨域资源共享）

## 技术细节

### JavaScript主要改动

```javascript
// 从后端加载数据
async function loadProductsData() {
    const response = await fetch('./Data.json');
    products = await response.json();
}

// 搜索时直接使用products数组
function handleSearch() {
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(keyword) || 
        product.tag.toLowerCase().includes(keyword)
    );
    displaySearchResults(filteredProducts, keyword);
}
```

### CORS配置

服务器已配置CORS头部，允许跨域请求：
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

## 下一步优化建议

1. **添加搜索API** - 在后端实现搜索接口，避免传输全部数据
2. **添加分页功能** - 当商品数量较多时分页展示
3. **添加筛选排序** - 按价格、销量、库存等排序
4. **添加缓存机制** - 减少重复请求
5. **使用数据库** - 当数据量大时使用真正的数据库

## 联系方式

如有问题，请联系开发团队。
