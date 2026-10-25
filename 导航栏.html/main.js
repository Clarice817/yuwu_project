// <!-- 轮播图自动播放脚本 -->
    
        document.addEventListener('DOMContentLoaded', function () {
            var track = document.querySelector('.carousel-track');
            var images = document.querySelectorAll('.carousel-track img');
            var indicators = document.querySelectorAll('.indicators span');
            var container = document.querySelector('.carousel-container');

            var totalSlides = images.length;
            var currentIndex = 0;
            var autoPlayTimer;

            // 更新轮播图位置和指示器状态
            function updateCarousel() {
                track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
                for (var i = 0; i < indicators.length; i++) {
                    if (i === currentIndex) {
                        indicators[i].classList.add('active');
                    } else {
                        indicators[i].classList.remove('active');
                    }
                }
            }

            // 切换到下一张
            function nextSlide() {
                currentIndex = (currentIndex + 1) % totalSlides;
                updateCarousel();
            }

            // 开启自动播放（每3秒切换一次）
            function startAutoPlay() {
                autoPlayTimer = setInterval(nextSlide, 3000);
            }

            // 停止自动播放
            function stopAutoPlay() {
                clearInterval(autoPlayTimer);
            }

            // 绑定指示器点击事件
            for (var i = 0; i < indicators.length; i++) {
                (function (index) {
                    indicators[index].addEventListener('click', function () {
                        currentIndex = index;
                        updateCarousel();
                        stopAutoPlay();
                        startAutoPlay();
                    });
                })(i);
            }

            // 鼠标悬停时暂停，离开时恢复
            container.addEventListener('mouseenter', stopAutoPlay);
            container.addEventListener('mouseleave', startAutoPlay);

            // 初始化
            updateCarousel();
            startAutoPlay();
        });
    
    // 购物车数据管理 - 全局函数
    // 从 localStorage 获取购物车数据
    window.getCartData = function() {
        var data = localStorage.getItem('yw_cart');
        if (data) {
            return JSON.parse(data);
        }
        return [];
    };

    // 保存购物车数据到 localStorage
    window.saveCartData = function(cartItems) {
        localStorage.setItem('yw_cart', JSON.stringify(cartItems));
    };

    // 初始化演示购物车数据（仅首次访问时）
    window.initDemoCart = function() {
        var existing = localStorage.getItem('yw_cart');
        if (!existing) {
            var demoCart = [
                {
                    name: '小米笔记本电脑 Pro 14英寸轻薄本',
                    price: 4999,
                    img: '../image_data/浅黄色系商品图片生成需求 (24).png',
                    quantity: 1
                },
                {
                    name: '小米智能手表 运动健康监测',
                    price: 299,
                    img: '../image_data/浅黄色系商品图片生成需求 (25).png',
                    quantity: 2
                },
                {
                    name: '小米蓝牙耳机 无线降噪',
                    price: 199,
                    img: '../image_data/浅黄色系商品图片生成需求 (26).png',
                    quantity: 1
                }
            ];
            window.saveCartData(demoCart);
        }
    };

    // 添加商品到购物车
    window.addToCart = function(product) {
        var cart = window.getCartData();
        var found = false;
        for (var i = 0; i < cart.length; i++) {
            if (cart[i].name === product.name) {
                cart[i].quantity += 1;
                found = true;
                break;
            }
        }
        if (!found) {
            cart.push({
                name: product.name,
                price: product.price,
                img: product.img,
                quantity: 1
            });
        }
        window.saveCartData(cart);
        // 刷新当前页面的购物车显示
        if (typeof window.refreshCartDisplay === 'function') {
            window.refreshCartDisplay();
        }
    };

    // 清空购物车
    window.clearCart = function() {
        localStorage.removeItem('yw_cart');
    };

    // 购物车侧边栏交互脚本
    document.addEventListener('DOMContentLoaded', function() {
        const cartTrigger = document.querySelector('.cart-trigger');
        const cartSidebar = document.querySelector('.cart-sidebar');
        const cartOverlay = document.querySelector('.cart-overlay');
        const closeBtn = document.querySelector('.close-btn');
        
        // 打开购物车侧边栏
        function openCartSidebar(e) {
            e.preventDefault();
            cartSidebar.classList.add('active');
            cartOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // 防止背景滚动
        }
        
        // 关闭购物车侧边栏
        function closeCartSidebar() {
            cartSidebar.classList.remove('active');
            cartOverlay.classList.remove('active');
            document.body.style.overflow = ''; // 恢复背景滚动
        }
        
        // 将关闭函数暴露到全局作用域
        window.closeCartSidebar = closeCartSidebar;
        
        // 绑定事件
        if (cartTrigger) {
            cartTrigger.addEventListener('click', openCartSidebar);
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', closeCartSidebar);
        }
        
        if (cartOverlay) {
            cartOverlay.addEventListener('click', closeCartSidebar);
        }

        // 从 localStorage 加载购物车数据并渲染
        window.refreshCartDisplay = function() {
            var cart = window.getCartData();
            var cartContent = document.querySelector('.cart-sidebar-content');
            
            if (cart.length === 0) {
                cartContent.innerHTML = `
                    <div class="empty-cart">
                        <div class="empty-cart-icon">🛒</div>
                        <div class="empty-cart-text">购物车还是空的</div>
                        <button class="empty-cart-btn" onclick="closeCartSidebar()">去购物</button>
                    </div>
                `;
                updateCartSummary(0, 0);
                return;
            }

            var html = '';
            var totalQuantity = 0;
            var totalPrice = 0;

            for (var i = 0; i < cart.length; i++) {
                var item = cart[i];
                var subtotal = item.price * item.quantity;
                totalQuantity += item.quantity;
                totalPrice += subtotal;

                html += `
                    <div class="cart-item" data-index="${i}">
                        <div class="cart-item-img">
                            <img src="${item.img}" alt="${item.name}">
                        </div>
                        <div class="cart-item-info">
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-price">¥${item.price}</div>
                            <div class="cart-item-quantity">
                                <button onclick="changeQuantity(${i}, -1)">-</button>
                                <span>${item.quantity}</span>
                                <button onclick="changeQuantity(${i}, 1)">+</button>
                            </div>
                        </div>
                    </div>
                `;
            }

            cartContent.innerHTML = html;
            updateCartSummary(totalQuantity, totalPrice);
        };

        // 全局数量增减函数
        window.changeQuantity = function(index, delta) {
            var cart = window.getCartData();
            if (index < 0 || index >= cart.length) return;

            cart[index].quantity += delta;

            if (cart[index].quantity <= 0) {
                // 删除商品
                var itemEl = document.querySelector(`.cart-item[data-index="${index}"]`);
                if (itemEl) {
                    itemEl.style.transition = 'all 0.3s ease';
                    itemEl.style.opacity = '0';
                    itemEl.style.transform = 'translateX(100%)';
                    setTimeout(function() {
                        cart.splice(index, 1);
                        window.saveCartData(cart);
                        window.refreshCartDisplay();
                    }, 300);
                }
                return;
            }

            window.saveCartData(cart);
            window.refreshCartDisplay();
        };

        // 更新购物车汇总信息
        function updateCartSummary(totalQuantity, totalPrice) {
            const summaryRows = document.querySelectorAll('.cart-summary-row');
            if (summaryRows[0]) {
                summaryRows[0].querySelector('span:last-child').textContent = totalQuantity + '件';
            }
            if (summaryRows[2]) {
                summaryRows[2].querySelector('.price').textContent = '¥' + totalPrice;
            }
        }

        // 页面加载时初始化购物车显示
        // 先初始化演示数据
        if (typeof window.initDemoCart === 'function') {
            window.initDemoCart();
        }
        window.refreshCartDisplay();
    });