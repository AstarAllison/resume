// ===========================
// 全局变量
// ===========================

let currentSection = 'home';
let currentVersion = 'general';
let showcaseSliders = {};

// ===========================
// DOM 加载完成后初始化
// ===========================

document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initVersionSwitcher();
    initShowcaseSliders();
    initSkillBars();
    initPortfolioFilter();
    initPDFViewer();
    initVersionTransition();
    initLoadingAnimation();
    
    // 默认显示首页
    showSection('home');
});

// ===========================
// 加载动画（简洁，HR友好）
// ===========================

function initLoadingAnimation() {
    // 创建加载动画
    const loader = document.createElement('div');
    loader.id = 'pageLoader';
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: white;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        transition: opacity 0.5s ease;
    `;
    
    loader.innerHTML = `
        <div style="text-align: center;">
            <div style="
                width: 40px;
                height: 40px;
                border: 3px solid #f0f0f0;
                border-top: 3px solid #6c63ff;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 16px;
            "></div>
            <p style="color: #636e9c; font-weight: 600;">加载中...</p>
        </div>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;
    
    document.body.appendChild(loader);
    
    // 页面加载完成后隐藏
    window.addEventListener('load', function() {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                if (loader.parentNode) {
                    loader.parentNode.removeChild(loader);
                }
            }, 500);
        }, 800);
    });
}

// ===========================
// 版本切换 - 添加渐变过渡效果
// ===========================

function initVersionTransition() {
    // 创建版本切换过渡层
    const transitionOverlay = document.createElement('div');
    transitionOverlay.id = 'versionTransitionOverlay';
    transitionOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.4s ease;
    `;
    document.body.appendChild(transitionOverlay);
}

function switchVersionWithTransition(version) {
    const overlay = document.getElementById('versionTransitionOverlay');
    if (!overlay) return;
    
    // 设置过渡层颜色
    let gradient = '';
    switch(version) {
        case 'general':
            gradient = 'linear-gradient(135deg, rgba(108, 99, 255, 0.15) 0%, rgba(255, 101, 132, 0.15) 100%)';
            break;
        case 'game':
            gradient = 'linear-gradient(135deg, rgba(155, 89, 182, 0.2) 0%, rgba(231, 76, 60, 0.2) 100%)';
            break;
        case 'finance':
            gradient = 'linear-gradient(135deg, rgba(30, 58, 138, 0.2) 0%, rgba(212, 175, 55, 0.2) 100%)';
            break;
    }
    
    overlay.style.background = gradient;
    
    // 显示过渡层
    overlay.style.opacity = '1';
    
    // 延迟切换版本
    setTimeout(() => {
        switchVersion(version);
        
        // 隐藏过渡层
        setTimeout(() => {
            overlay.style.opacity = '0';
        }, 100);
    }, 300);
}

// ===========================
// 导航功能
// ===========================

function initNavigation() {
    // 侧边导航点击
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            showSection(sectionId);
            
            // 更新活跃状态
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // PDF section 点击跳转
    const pdfSections = document.querySelectorAll('.pdf-section.clickable');
    pdfSections.forEach(section => {
        section.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            if (target) {
                showSection(target);
                
                // 更新导航活跃状态
                navLinks.forEach(l => l.classList.remove('active'));
                const targetLink = document.querySelector(`.nav-link[data-section="${target}"]`);
                if (targetLink) {
                    targetLink.classList.add('active');
                }
            }
        });
    });
}

function showSection(sectionId) {
    // 获取所有section
    const sections = document.querySelectorAll('.section');
    const currentActiveSection = document.querySelector('.section.active');
    
    // 如果当前section存在，先淡出
    if (currentActiveSection) {
        currentActiveSection.style.opacity = '0';
        currentActiveSection.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            currentActiveSection.classList.remove('active');
            
            // 显示目标section（淡入）
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.classList.add('active');
                
                // 强制重排，确保过渡生效
                targetSection.offsetHeight;
                
                targetSection.style.opacity = '1';
                targetSection.style.transform = 'translateY(0)';
                
                // 触发动画
                triggerAnimations(sectionId);
                
                // 滚动到顶部
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        }, 300); // 等待淡出动画完成
    } else {
        // 如果没有当前活跃section，直接显示
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            targetSection.style.opacity = '1';
            targetSection.style.transform = 'translateY(0)';
            
            // 触发动画
            triggerAnimations(sectionId);
        }
    }
    
    // 更新当前section
    currentSection = sectionId;
}

// ===========================
// 版本切换功能
// ===========================

function initVersionSwitcher() {
    const versionBtns = document.querySelectorAll('.version-btn');
    versionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const version = this.getAttribute('data-version');
            
            // 使用过渡效果切换版本
            switchVersionWithTransition(version);
            
            // 更新按钮活跃状态
            versionBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function switchVersion(version) {
    currentVersion = version;
    
    // 移除所有版本类
    document.body.classList.remove('version-game', 'version-finance');
    
    // 添加当前版本类
    if (version === 'game') {
        document.body.classList.add('version-game');
    } else if (version === 'finance') {
        document.body.classList.add('version-finance');
    }
    
    // 根据版本改变配色
    const root = document.documentElement;
    
    switch(version) {
        case 'general':
            // 通用版：活力紫蓝 + 珊瑚粉 + 温暖黄
            root.style.setProperty('--primary', '#6c63ff');
            root.style.setProperty('--secondary', '#ff6584');
            root.style.setProperty('--accent', '#ffd32a');
            break;
            
        case 'game':
            // 游戏行业版：紫色 + 红色 + 黄色
            root.style.setProperty('--primary', '#9b59b6');
            root.style.setProperty('--secondary', '#e74c3c');
            root.style.setProperty('--accent', '#f1c40f');
            break;
            
        case 'finance':
            // 金融专业版：深蓝 + 金色
            root.style.setProperty('--primary', '#1e3a8a');
            root.style.setProperty('--secondary', '#d4af37');
            root.style.setProperty('--accent', '#4facfe');
            break;
    }
    
    // 显示提示
    const versionNames = {
        'general': '通用版',
        'game': '游戏行业版',
        'finance': '金融专业版'
    };
    
    showNotification(`已切换到${versionNames[version]}`);
    
    // 更新页面内容（根据版本）
    updateContentByVersion(version);
}

function updateContentByVersion(version) {
    // 根据版本更新页面内容
    const subtitle = document.querySelector('.hero-subtitle');
    const description = document.querySelectorAll('.hero-description');
    const gameExperience = document.querySelector('.game-experience');
    const gameSkills = document.querySelector('.game-skills');
    
    if (!subtitle) return;
    
    // 显示/隐藏游戏相关内容
    if (gameExperience) {
        if (version === 'game') {
            gameExperience.style.display = 'block';
        } else {
            gameExperience.style.display = 'none';
        }
    }
    
    if (gameSkills) {
        if (version === 'game') {
            gameSkills.style.display = 'block';
        } else {
            gameSkills.style.display = 'none';
        }
    }
    
    switch(version) {
        case 'general':
            subtitle.textContent = '金融学硕士 | 数据分析 · 审计实务 · 产品策划';
            break;
            
        case 'game':
            subtitle.textContent = '金融学硕士 | 游戏策划 · 游戏运营 · 数据分析';
            if (description[0]) {
                description[0].innerHTML = `
                    你好！我是一名即将毕业的金融学硕士，对游戏行业充满热情。
                    我有丰富的游戏经验，擅长王者荣耀（王者10星）、重返未来1999、雀魂麻将等。
                    关注游戏行业动态，对游戏剧情、美术风格、叙事设计有独特见解。
                `;
            }
            break;
            
        case 'finance':
            subtitle.textContent = '金融学硕士 | 财务审计 · 金融分析 · 风险管理';
            if (description[0]) {
                description[0].innerHTML = `
                    你好！我是一名即将毕业的金融学硕士，毕业于上海对外经贸大学金融学（数字金融实验班）。
                    我具备扎实的金融专业背景，在<strong>德勤中国上海所</strong>担任审计实习生，
                    熟悉审计流程、财务分析和风险管理。
                `;
            }
            break;
    }
}

// ===========================
// 展示滑块功能（工作实习、项目经历等）
// ===========================

function initShowcaseSliders() {
    // 为所有展示滑块初始化
    const sliders = document.querySelectorAll('.showcase-slider');
    
    sliders.forEach(slider => {
        const sliderId = slider.id;
        const container = slider.querySelector('.slider-container');
        const slides = slider.querySelectorAll('.slide');
        const prevBtn = slider.querySelector('.slider-prev');
        const nextBtn = slider.querySelector('.slider-next');
        const dotsContainer = slider.querySelector('.slider-dots');
        
        if (!container || slides.length === 0) return;
        
        // 创建dots
        if (dotsContainer) {
            slides.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                if (index === 0) dot.classList.add('active');
                dot.setAttribute('data-slide', index);
                
                dot.addEventListener('click', () => {
                    goToSlide(sliderId, index);
                });
                
                dotsContainer.appendChild(dot);
            });
        }
        
        // 存储slider状态
        showcaseSliders[sliderId] = {
            currentSlide: 0,
            totalSlides: slides.length,
            container: container,
            slides: slides
        };
        
        // 添加事件监听
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide(sliderId);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide(sliderId);
            });
        }
    });
}

function goToSlide(sliderId, slideIndex) {
    const sliderData = showcaseSliders[sliderId];
    if (!sliderData) return;
    
    const { slides, totalSlides } = sliderData;
    
    // 确保索引在有效范围内
    if (slideIndex < 0) slideIndex = totalSlides - 1;
    if (slideIndex >= totalSlides) slideIndex = 0;
    
    // 移除所有active类
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // 添加active类到目标slide
    slides[slideIndex].classList.add('active');
    
    // 更新dots
    const slider = document.getElementById(sliderId);
    if (slider) {
        const dots = slider.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            if (index === slideIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // 更新当前slide索引
    showcaseSliders[sliderId].currentSlide = slideIndex;
}

function prevSlide(sliderId) {
    const sliderData = showcaseSliders[sliderId];
    if (!sliderData) return;
    
    let newIndex = sliderData.currentSlide - 1;
    if (newIndex < 0) newIndex = sliderData.totalSlides - 1;
    
    goToSlide(sliderId, newIndex);
}

function nextSlide(sliderId) {
    const sliderData = showcaseSliders[sliderId];
    if (!sliderData) return;
    
    let newIndex = sliderData.currentSlide + 1;
    if (newIndex >= sliderData.totalSlides) newIndex = 0;
    
    goToSlide(sliderId, newIndex);
}

// ===========================
// 技能条动画
// ===========================

function initSkillBars() {
    // 使用Intersection Observer监听技能条是否进入视口
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target;
                const width = skillBar.getAttribute('data-width');
                skillBar.style.width = width + '%';
                observer.unobserve(skillBar);
            }
        });
    }, {
        threshold: 0.5
    });
    
    skillBars.forEach(bar => {
        observer.observe(bar);
    });
}

// ===========================
// 作品集筛选功能
// ===========================

function initPortfolioFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // 更新按钮活跃状态
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 筛选作品
            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// ===========================
// PDF查看器功能
// ===========================

function initPDFViewer() {
    const viewBtn = document.getElementById('viewResume');
    const downloadBtn = document.getElementById('downloadResumeBtn');
    
    if (viewBtn) {
        viewBtn.addEventListener('click', function() {
            // TODO: 实现PDF查看功能
            showNotification('PDF查看功能待实现，请先上传PDF文件');
        });
    }
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // TODO: 实现PDF下载功能
            showNotification('PDF下载功能待实现，请先上传PDF文件');
        });
    }
}

// ===========================
// 动画触发
// ===========================

function triggerAnimations(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    
    // 为section内的卡片添加动画
    const cards = section.querySelectorAll('.experience-card, .project-card, .campus-card, .award-card, .portfolio-item');
    
    cards.forEach((card, index) => {
        // 初始状态
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        // 依次淡入
        setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// ===========================
// 通知功能
// ===========================

function showNotification(message) {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #6c63ff 0%, #8a84ff 100%);
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(108, 99, 255, 0.3);
        z-index: 10000;
        font-weight: 600;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    // 添加动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // 3秒后移除通知
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// ===========================
// 平滑滚动
// ===========================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}
