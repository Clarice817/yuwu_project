// 商品数据库 - 包含所有商品信息
        const products = [
            // 数码类商品
            { id: 1, name: '蓝牙音箱', tag: '数码', price: 99, originalPrice: 199, sales: '1.2万', stock: 158, image: '../image_data/bluebox2.png' },
            { id: 2, name: '蓝牙耳机', tag: '数码', price: 159, originalPrice: 299, sales: '8562', stock: 236, image: '../image_data/earmachin.png' },
            { id: 3, name: '智能手环', tag: '数码', price: 89, originalPrice: 169, sales: '2.3万', stock: 342, image: '../image_data/watch.png' },
            { id: 4, name: '平板电脑', tag: '数码', price: 1299, originalPrice: 1999, sales: '5630', stock: 89, image: '../image_data/ipad.png' },
            { id: 5, name: '笔记本电脑', tag: '数码', price: 4999, originalPrice: 6999, sales: '1.8万', stock: 67, image: '../image_data/computer.png' },
            { id: 6, name: '机械键盘', tag: '数码', price: 199, originalPrice: 399, sales: '4230', stock: 125, image: '../image_data/keyboard.png' },
            { id: 7, name: '华为手机', tag: '数码', price: 4999, originalPrice: 5999, sales: '1.5万', stock: 188, image: '../image_data/浅黄色系商品图片生成需求 (24).png' },
            { id: 8, name: 'vivo手机', tag: '数码', price: 3999, originalPrice: 4599, sales: '1.2万', stock: 215, image: '../image_data/浅黄色系商品图片生成需求 (25).png' },
            { id: 9, name: '苹果手机', tag: '数码', price: 6999, originalPrice: 7999, sales: '2万', stock: 95, image: '../image_data/浅黄色系商品图片生成需求 (26).png' },
            { id: 10, name: '小米手机', tag: '数码', price: 3499, originalPrice: 3999, sales: '1.8万', stock: 176, image: '../image_data/浅黄色系商品图片生成需求 (27).png' },
            
            // 食品类商品
            { id: 11, name: '本地香蕉', tag: '食品', price: 2.4, originalPrice: 5, sales: '3万', stock: 420, image: '../image_data/bannana.png' },
            { id: 12, name: '奶油饼干', tag: '食品', price: 9.99, originalPrice: 19.9, sales: '2.5万', stock: 580, image: '../image_data/biscuit.png' },
            { id: 13, name: '北海道面包', tag: '食品', price: 15.5, originalPrice: 25, sales: '1.8万', stock: 320, image: '../image_data/bread.png' },
            { id: 14, name: '香肠', tag: '食品', price: 6.6, originalPrice: 12, sales: '4万', stock: 750, image: '../image_data/chang.png' },
            { id: 15, name: '老鸡汤泡面', tag: '食品', price: 34.4, originalPrice: 50, sales: '2.2万', stock: 280, image: '../image_data/noodle.png' },
            { id: 16, name: '新鲜菠萝', tag: '食品', price: 20, originalPrice: 35, sales: '1.5万', stock: 195, image: '../image_data/pinapple.png' },
            
            // 服饰类商品
            { id: 17, name: '冬日大衣', tag: '服饰', price: 647, originalPrice: 999, sales: '8000', stock: 135, image: '../image_data/coat.png' },
            { id: 18, name: '帅气皮衣', tag: '服饰', price: 888, originalPrice: 1299, sales: '6500', stock: 88, image: '../image_data/coat2.png' },
            { id: 19, name: '温柔系连衣裙', tag: '服饰', price: 155, originalPrice: 299, sales: '1.2万', stock: 267, image: '../image_data/dress.png' },
            { id: 20, name: '直筒裤', tag: '服饰', price: 178, originalPrice: 299, sales: '9500', stock: 198, image: '../image_data/pants.png' },
            { id: 21, name: '睡衣', tag: '服饰', price: 218, originalPrice: 399, sales: '7000', stock: 345, image: '../image_data/sleepcloth.png' },
            { id: 22, name: '新中式', tag: '服饰', price: 219, originalPrice: 399, sales: '5500', stock: 156, image: '../image_data/chinesecloth.png' }
        ];

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
        document.addEvent
        Listener('DOMContentLoaded', function() {
            document.getElementById('searchInput').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    handleSearch();
                }
            });

            // 页面加载时显示空状态
            document.getElementById('emptyState').style.display = 'block';
        });
