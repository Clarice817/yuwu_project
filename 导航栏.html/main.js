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
    