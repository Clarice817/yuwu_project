/**
 * 分类页面数据渲染模块
 * 实现前后端分离，通过fetch请求Data.json获取商品数据
 */

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 获取当前页面类别（从title或URL中获取）
    const pageCategory = getPageCategory();
    
    // 加载并渲染商品数据
    loadProducts(pageCategory);
});

/**
 * 获取当前页面类别
 * @returns {string} 类别名称（数码、食品、服饰）
 */
function getPageCategory() {
    // 从页面标题获取
    const title = document.title;
    if (title.includes('数码')) return '数码';
    if (title.includes('食品')) return '食品';
    if (title.includes('服饰')) return '服饰';
    
    // 默认返回数码
    return '数码';
}

/**
 * 从Data.json加载商品数据
 * @param {string} category - 商品类别
 */
function loadProducts(category) {
    fetch('../../搜索框/Data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('网络响应失败');
            }
            return response.json();
        })
        .then(data => {
            // 过滤当前类别的商品
            const categoryProducts = data.filter(product => product.tag === category);
            
            // 渲染商品到页面
            renderProducts(categoryProducts, category);
        })
        .catch(error => {
            console.error('加载商品数据失败:', error);
            // 显示错误提示
            showErrorMessage();
        });
}

/**
 * 渲染商品列表
 * @param {Array} products - 商品数组
 * @param {string} category - 类别名称
 */
function renderProducts(products, category) {
    const container = document.querySelector('.phone-box');
    
    if (!container) {
        console.error('未找到商品容器 .phone-box');
        return;
    }
    
    // 清空容器
    container.innerHTML = '';
    
    // 生成商品HTML
    products.forEach(product => {
        const productHTML = createProductCard(product, category);
        container.innerHTML += productHTML;
    });
    
    // 绑定购物车按钮事件
    bindCartEvents();
}

/**
 * 创建单个商品卡片HTML
 * @param {Object} product - 商品数据
 * @param {string} category - 类别名称
 * @returns {string} 商品卡片HTML字符串
 */
function createProductCard(product, category) {
    // 获取标签样式类名
    const tagClass = getCategoryTagClass(category);
    
    // 生成额外标签
    const extraTags = generateExtraTags(product);
    
    // 生成卖点标题
    const sellingPoint = generateSellingPoint(product);
    
    // 处理价格小数部分
    const priceParts = product.price.toString().split('.');
    const priceInteger = priceParts[0];
    const priceDecimal = priceParts[1] ? '.' + priceParts[1] : '.00';
    
    // 修正图片路径：将 ../image_data/ 转换为 ../../image_data/
    const correctedImagePath = product.image.replace('../image_data/', '../../image_data/');
    
    return `
        <div class="phone-box-item">
            <span class="item-tag ${tagClass}">${category}</span>
            <a href="../good/aGood.html?id=${product.id}" target="_blank">
                <img src="${correctedImagePath}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <div class="product-title">${sellingPoint}</div>
                    <div class="product-price">
                        <span class="price-symbol">¥</span>
                        <span class="price-value">${priceInteger}</span>
                        <span class="price-decimal">${priceDecimal}</span>
                        <span class="original-price">¥${product.originalPrice}</span>
                    </div>
                    <div class="product-sales">已售 ${product.sales}件</div>
                    <div class="product-stock">库存 ${product.stock}件</div>
                    <div class="product-tags">
                        <span class="tag ${tagClass}">${category}</span>
                        ${extraTags}
                    </div>
                </div>
            </a>
            <button class="buy-btn" onclick="addToCart(${product.id})">
                立即加入购物车
                <i class="iconfont icon-shoppingcart"></i>
            </button>
        </div>
    `;
}

/**
 * 获取类别标签样式类名
 * @param {string} category - 类别名称
 * @returns {string} CSS类名
 */
function getCategoryTagClass(category) {
    const classMap = {
        '数码': 'digital',
        '食品': 'food',
        '服饰': 'cloth'
    };
    return classMap[category] || 'digital';
}

/**
 * 生成额外标签
 * @param {Object} product - 商品数据
 * @returns {string} 标签HTML
 */
function generateExtraTags(product) {
    const tags = [];
    
    // 所有商品都有包邮标签
    tags.push('<span class="tag">包邮</span>');
    
    // 根据类别添加特定标签
    if (product.tag === '数码') {
        const digitalTags = ['正品保证', '次日达', '当日达', '分期免息'];
        const randomTag = digitalTags[Math.floor(Math.random() * digitalTags.length)];
        if (randomTag === '次日达' || randomTag === '当日达') {
            tags.push(`<span class="tag shipping">${randomTag}</span>`);
        } else {
            tags.push(`<span class="tag">${randomTag}</span>`);
        }
    } else if (product.tag === '食品') {
        const foodTags = ['新鲜直达', '保质期长', '当日发货'];
        const randomTag = foodTags[Math.floor(Math.random() * foodTags.length)];
        tags.push(`<span class="tag">${randomTag}</span>`);
    } else if (product.tag === '服饰') {
        const clothTags = ['品质保证', '7天无理由', '运费险'];
        const randomTag = clothTags[Math.floor(Math.random() * clothTags.length)];
        tags.push(`<span class="tag">${randomTag}</span>`);
    }
    
    return tags.join('');
}

/**
 * 生成卖点标题
 * @param {Object} product - 商品数据
 * @returns {string} 卖点标题
 */
function generateSellingPoint(product) {
    const sellingPoints = [
        '【爆款推荐】',
        '【新品上市】',
        '【限时优惠】',
        '【热销商品】',
        '【品质精选】'
    ];
    
    const randomPoint = sellingPoints[Math.floor(Math.random() * sellingPoints.length)];
    
    // 根据类别添加描述
    let description = '';
    if (product.tag === '数码') {
        const descriptions = ['高性能', '品质保证', '智能便捷', '轻薄便携'];
        description = descriptions[Math.floor(Math.random() * descriptions.length)];
    } else if (product.tag === '食品') {
        const descriptions = ['新鲜美味', '口感绝佳', '营养健康', '传统工艺'];
        description = descriptions[Math.floor(Math.random() * descriptions.length)];
    } else if (product.tag === '服饰') {
        const descriptions = ['时尚百搭', '舒适透气', '精致做工', '优雅气质'];
        description = descriptions[Math.floor(Math.random() * descriptions.length)];
    }
    
    return `${randomPoint}${product.name} ${description}`;
}

/**
 * 绑定购物车按钮事件
 */
function bindCartEvents() {
    const buttons = document.querySelectorAll('.buy-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            // 这里可以添加购物车逻辑
            alert('商品已添加到购物车！');
        });
    });
}

/**
 * 显示错误消息
 */
function showErrorMessage() {
    const container = document.querySelector('.phone-box');
    if (container) {
        container.innerHTML = '<div style="text-align: center; padding: 50px; color: #999;">商品数据加载失败，请刷新页面重试</div>';
    }
}

/**
 * 添加商品到购物车
 * @param {number} productId - 商品ID
 */
function addToCart(productId) {
    // 获取购物车数据（从localStorage）
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // 检查商品是否已在购物车中
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            quantity: 1
        });
    }
    
    // 保存回localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // 显示提示
    alert('商品已添加到购物车！');
    
    // 更新购物车图标（如果页面有购物车图标）
    updateCartIcon();
}

/**
 * 更新购物车图标显示
 */
function updateCartIcon() {
    const cartIcon = document.querySelector('.shoppingcart');
    if (cartIcon) {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartIcon.textContent = totalItems > 0 ? totalItems : '';
    }
}

// 暴露全局函数供HTML onclick使用
window.addToCart = addToCart;