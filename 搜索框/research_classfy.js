// 商品数据库 - 从后端JSON文件获取
let products = [];

// 页面加载时从Data.json获取数据
document.addEventListener('DOMContentLoaded', async function() {
    await loadProductsData();
    
    // 页面加载完成后显示空状态
    document.getElementById('emptyState').style.display = 'block';
});

// 从后端加载商品数据
async function loadProductsData() {
    try {
        const response = await fetch('./Data.json');
        if (!response.ok) {
            throw new Error('数据加载失败');
        }
        products = await response.json();
        console.log('商品数据加载成功，共', products.length, '件商品');
    } catch (error) {
        console.error('加载商品数据失败:', error);
        // 显示错误提示
        showErrorMessage();
    }
}

// 显示错误提示
function showErrorMessage() {
    const emptyState = document.getElementById('emptyState');
    emptyState.style.display = 'block';
    emptyState.innerHTML = `
        <i class="iconfont icon-sousuo" style="font-size: 60px; color: #ff4d4f; margin-bottom: 20px;"></i>
        <p style="color: #999; font-size: 16px;">数据加载失败</p>
        <p style="color: #ccc; font-size: 14px; margin-top: 10px;">请检查Data.json文件是否存在</p>
    `;
}

// 搜索功能
function handleSearch() {
    const keyword = document.getElementById('searchInput').value.trim().toLowerCase();
    
    if (!keyword) {
        // 空搜索，显示空状态
        document.getElementById('emptyState').style.display = 'block';
        document.getElementById('productGrid').style.display = 'none';
        document.getElementById('searchResult').style.display = 'none';
        return;
    }

    // 确保数据已加载
    if (products.length === 0) {
        alert('数据正在加载中，请稍后再试...');
        return;
    }

    // 搜索商品：匹配商品名称或标签
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(keyword) || 
        product.tag.toLowerCase().includes(keyword)
    );

    // 显示搜索结果
    displaySearchResults(filteredProducts, keyword);
}

// 显示搜索结果
function displaySearchResults(products, keyword) {
    const productGrid = document.getElementById('productGrid');
    const emptyState = document.getElementById('emptyState');
    const searchResult = document.getElementById('searchResult');
    const resultCount = document.getElementById('resultCount');
    const searchKeyword = document.getElementById('searchKeyword');

    // 更新搜索结果统计
    resultCount.textContent = products.length;
    searchKeyword.textContent = keyword;
    searchResult.style.display = 'block';

    if (products.length === 0) {
        // 无搜索结果
        productGrid.style.display = 'none';
        emptyState.style.display = 'block';
        emptyState.innerHTML = `
            <i class="iconfont icon-sousuo" style="font-size: 60px; color: #ccc; margin-bottom: 20px;"></i>
            <p style="color: #999; font-size: 16px;">未找到相关商品</p>
            <p style="color: #ccc; font-size: 14px; margin-top: 10px;">换个关键词试试吧</p>
        `;
        return;
    }

    // 有搜索结果，显示商品列表
    emptyState.style.display = 'none';
    productGrid.style.display = 'flex';

    // 生成商品卡片HTML
    productGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <a href="javascript:void(0)" onclick="goToDetail(${product.id})" style="display: block; text-decoration: none; color: inherit;">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <div class="product-title">【${product.tag}推荐】${product.name} 高品质 热销商品</div>
                    <div class="product-price">
                        <span class="price-symbol">¥</span>
                        <span class="price-value">${Math.floor(product.price)}</span>
                        <span class="price-decimal">.${(product.price % 1).toFixed(2).substring(2)}</span>
                        <span class="original-price">¥${product.originalPrice}</span>
                    </div>
                    <div class="product-sales">已售 ${product.sales}件</div>
                    <div class="product-stock">库存 ${product.stock}件</div>
                    <div class="product-tags">
                        <span class="tag ${getTagClass(product.tag)}">${product.tag}</span>
                        <span class="tag">包邮</span>
                        <span class="tag shipping">次日达</span>
                    </div>
                </div>
            </a>
            <button class="buy-btn" onclick="addToCart(${product.id})">
                <i class="iconfont icon-shoppingcart"></i>
                立即加入购物车
            </button>
        </div>
    `).join('');
}

// 获取标签类名
function getTagClass(tagName) {
    const tagMap = {
        '数码': 'digital',
        '食品': 'food',
        '服饰': 'cloth'
    };
    return tagMap[tagName] || '';
}

// 跳转到商品详情
function goToDetail(productId) {
    // 根据商品ID跳转到对应的详情页
    const detailPages = {
        1: '../good/aGood.html',
        7: '../carousel/phone1.html',
        8: '../carousel/phone2.html',
        9: '../carousel/phone3.html',
        10: '../carousel/phone4.html'
    };
    
    const url = detailPages[productId] || `product_detail.html?id=${productId}`;
    window.open(url, '_blank');
}

// Enter键搜索 - 使用DOMContentLoaded确保DOM已加载
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
});
