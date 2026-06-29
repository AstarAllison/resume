// ===========================
// 全局变量
// ===========================

let currentSection = 'home';
let currentVersion = 'general';

// ===========================
// DOM 加载完成后初始化
// ===========================

document.addEventListener('DOMContentLoaded', function() {
    initVersionModal();
    initNavigation();
    initVersionSwitcher();
    initPortfolioFilter();
    initPDFViewer();
    initBackToTop();
    initClickableCards();
    initRippleEffect();
    initBackgroundEffect();
    initSkillItemClicks();
    initPortfolioHoverRedesign();
    initHomeAvatar();

    handleHashOnLoad();
});

// ===========================
// 首页右上角头像 — 仅大屏显示
// ===========================

function initHomeAvatar() {
    const avatar = document.querySelector('.home-avatar-corner');
    if (!avatar) return;
    function toggle() {
        avatar.style.display = window.innerWidth > 1024 ? 'block' : 'none';
    }
    toggle();
    window.addEventListener('resize', toggle);
}

// ===========================
// 版本选择弹窗 — 只用 localStorage，首次才弹
// ===========================

function initVersionModal() {
    const modal = document.getElementById('versionModal');
    if (!modal) return;

    // 已经选过版本 → 直接应用并隐藏弹窗
    const savedVersion = localStorage.getItem('resumeVersion');
    if (savedVersion) {
        modal.classList.add('hidden');
        switchVersion(savedVersion);
        updateVersionNavBtn(savedVersion);
        return;
    }

    // 首次访问 → 显示弹窗
    modal.classList.remove('hidden');

    const btns = modal.querySelectorAll('.version-modal-btn');
    btns.forEach(btn => {
        btn.addEventListener('click', function() {
            const version = this.getAttribute('data-version');
            switchVersion(version);
            updateVersionNavBtn(version);
            localStorage.setItem('resumeVersion', version);
            modal.classList.add('hidden');
        });
    });
}

function updateVersionNavBtn(version) {
    document.querySelectorAll('.version-btn').forEach(b => b.classList.remove('active'));
    const target = document.querySelector(`.version-btn[data-version="${version}"]`);
    if (target) target.classList.add('active');
}

// ===========================
// 处理 URL hash
// ===========================

function handleHashOnLoad() {
    const hash = window.location.hash.replace('#', '');
    if (hash && document.getElementById(hash)) {
        showSection(hash);
        updateNavHighlight(hash);
    } else {
        showSection('home');
    }
}

// ===========================
// 导航
// ===========================

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            showSection(sectionId);
            updateNavHighlight(sectionId);
            history.pushState(null, null, '#' + sectionId);
        });
    });

    // PDF 模块点击跳转对应板块
    const pdfSections = document.querySelectorAll('.pdf-section');
    pdfSections.forEach(section => {
        section.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            if (target && document.getElementById(target)) {
                showSection(target);
                updateNavHighlight(target);
                history.pushState(null, null, '#' + target);
            }
        });
    });

    // 技能标签点击跳转
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        tag.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            if (target && document.getElementById(target)) {
                showSection(target);
                updateNavHighlight(target);
                history.pushState(null, null, '#' + target);
            }
        });
    });
}

function updateNavHighlight(sectionId) {
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    const targetLink = document.querySelector(`.nav-link[data-section="${sectionId}"]`);
    if (targetLink) targetLink.classList.add('active');
}

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(sectionId);
    if (target) {
        target.classList.add('active');
        triggerAnimations(sectionId);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    currentSection = sectionId;
}

// ===========================
// 可点击卡片 → 跳转详情页
// ===========================

function initClickableCards() {
    // 处理 [data-detail] 卡片（经历/项目/校园等模块）
    const cards = document.querySelectorAll('[data-detail]');
    cards.forEach(card => {
        card.addEventListener('click', function() {
            const url = this.getAttribute('data-detail');
            if (!url) return;
            let returnSection = this.getAttribute('data-return-section');
            if (!returnSection) {
                const parent = this.closest('.section');
                returnSection = parent ? parent.id : currentSection;
            }
            sessionStorage.setItem('resumeReturnSection', returnSection);
            window.location.href = url;
        });
    });

    // 处理核心能力板块的 .skill-item 链接（直接 <a> 跳转，需拦截并记录返回路径）
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(link => {
        link.addEventListener('click', function(e) {
            // 如果已经有 data-return-section 属性，说明已经处理过
            let returnSection = this.getAttribute('data-return-section');
            if (!returnSection) {
                // 找到最近的 .section 父元素
                const parent = this.closest('.section');
                returnSection = parent ? parent.id : 'skills';
            }
            sessionStorage.setItem('resumeReturnSection', returnSection);
            // 不让 <a> 默认跳转，改为 JS 跳转（确保 sessionStorage 写入完成）
            e.preventDefault();
            window.location.href = this.href;
        });
    });
}

function getReturnSection() {
    return sessionStorage.getItem('resumeReturnSection') || 'home';
}

// ===========================
// 版本切换（侧边栏）
// ===========================

function initVersionSwitcher() {
    const btns = document.querySelectorAll('.version-btn');
    btns.forEach(btn => {
        btn.addEventListener('click', function() {
            const version = this.getAttribute('data-version');
            switchVersion(version);
            localStorage.setItem('resumeVersion', version);
            updateVersionNavBtn(version);
        });
    });
}

function switchVersion(version) {
    currentVersion = version;
    document.body.classList.remove('version-game', 'version-finance');
    if (version === 'game') document.body.classList.add('version-game');
    else if (version === 'finance') document.body.classList.add('version-finance');
    updateContentByVersion(version);
    showNotification(`已切换到${version==='general'?'通用版':version==='game'?'游戏行业版':'金融专业版'}`);
}

function updateContentByVersion(version) {
    const subtitle = document.querySelector('#heroSubtitle');
    const gameExp = document.querySelector('.game-experience');
    const gameBlocks = document.querySelectorAll('.skill-category.game-only');

    if (gameExp) gameExp.style.display = version === 'game' ? 'block' : 'none';
    gameBlocks.forEach(b => {
        b.style.display = version === 'game' ? 'block' : 'none';
    });

    if (subtitle) {
        subtitle.textContent =
            version==='general' ? '金融学硕士 | 数据分析 · 审计实务 · 产品策划' :
            version==='game'   ? '金融学硕士 | 游戏策划 · 游戏运营 · 数据分析' :
                                  '金融学硕士 | 财务审计 · 金融分析 · 风险管理';
    }

    updateResumeByVersion(version);
    updatePortfolioByVersion(version);
}

function updateResumeByVersion(version) {
    // 根据版本更新首页简历预览内容
    const section = document.querySelector('.pdf-section[data-target="experience"] .pdf-section-content');
    if (!section) return;
    if (version === 'game') {
        section.innerHTML = `
            <p><strong>德勤中国上海所</strong> | 审计实习生 | 2025.01-2025.04</p>
            <p class="star-text">锻炼了数据分析能力和细致的工作态度，可迁移至游戏数据分析工作。</p>
            <p><strong>游戏策划训练营</strong> | 游戏策划实践 | 2024</p>
            <p class="star-text">参与9次游戏活动策划，熟悉游戏策划工作流程，关注游戏行业动态。</p>
        `;
    } else {
        section.innerHTML = `
            <p><strong>德勤中国上海所</strong> | 审计实习生 | 2025.01-2025.04</p>
            <p class="star-text">随团队到7个客户公司完成审计程序，独立完成存货监盘、凭证信息查找和核对，使用Excel进行52份底稿数据核对整理。</p>
            <p><strong>中国建设银行黄山分行</strong> | 大堂经理实习生 | 2023.07-2023.08</p>
            <p class="star-text">协助营业网点大堂服务，引导客户操作，参与普惠金融地方应用的实际调研。</p>
        `;
    }
}

function updatePortfolioByVersion(version) {
    // 静态 HTML 已经有完整的作品集卡片（12个），版本切换不再覆盖，避免破坏跳转
    // 通用版：显示全部；游戏版：突出游戏相关作品（data-category=game）
    const grid = document.querySelector('.portfolio-grid');
    if (!grid) return;
    if (version === 'game') {
        // 游戏版：在卡片底部追加游戏相关提示
        const gameItems = grid.querySelectorAll('.portfolio-item[data-category="game"]');
        gameItems.forEach(item => {
            if (!item.querySelector('.game-badge')) {
                const badge = document.createElement('div');
                badge.className = 'game-badge';
                badge.textContent = '🎮 游戏版推荐';
                badge.style.cssText = 'position:absolute;top:8px;right:8px;background:var(--gradient-warm);color:#fff;padding:3px 10px;border-radius:9999px;font-size:0.7rem;font-weight:600;z-index:5;';
                item.appendChild(badge);
            }
        });
    } else {
        // 通用版 / 金融版：移除游戏徽章
        grid.querySelectorAll('.game-badge').forEach(b => b.remove());
    }
}

// ===========================
// 作品集筛选
// ===========================

function initPortfolioFilter() {
    const btns = document.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll('.portfolio-item');
    btns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            btns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            items.forEach(item => {
                const cat = item.getAttribute('data-category');
                item.style.display = (filter === 'all' || cat === filter) ? 'block' : 'none';
            });
        });
    });
}

// ===========================
// PDF 按钮
// ===========================

function initPDFViewer() {
    const viewBtn = document.getElementById('viewResumeBtn');
    if (viewBtn) {
        viewBtn.addEventListener('click', () => {
            window.open('苏欣彤_中文简历.pdf', '_blank');
        });
    }
}

// ===========================
// 返回顶部
// ===========================

function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 300);
    });
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===========================
// 水波纹点击效果
// ===========================

function initRippleEffect() {
    const buttons = document.querySelectorAll('.btn, .version-btn, .nav-link, .skill-tag, .filter-btn, .version-modal-btn');
    buttons.forEach(btn => {
        btn.style.position = 'relative';
        btn.style.overflow = 'hidden';
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 700);
        });
    });
}

// ===========================
// 背景动效 — 纯背景漂浮粒子 + 光晕（不跟随鼠标）
// 主题色：紫/粉/黄/蓝渐变，白色为主，在底层
// ===========================

function initBackgroundEffect() {
    const canvas = document.getElementById('bgCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    // 主题色
    const colors = [
        { r: 108, g: 99, b: 255 },   // 紫蓝
        { r: 255, g: 101, b: 132 },  // 珊瑚粉
        { r: 255, g: 211, b: 42 },   // 暖黄
        { r: 79,  g: 172, b: 254 },  // 天蓝
        { r: 138, g: 132, b: 255 },  // 浅紫
    ];

    const particles = [];
    const shapeTypes = ['dot', 'star', 'coin', 'diamond', 'ring', 'triangle', 'cross', 'heart', 'cloud', 'orb'];

    // —— 各类形状粒子（共 ~90 个）——
    const shapeCounts = { dot: 14, star: 16, coin: 10, diamond: 10, ring: 8, triangle: 8, cross: 8, heart: 6, cloud: 4, orb: 6 };
    Object.entries(shapeCounts).forEach(([type, count]) => {
        for (let i = 0; i < count; i++) {
            const size = type === 'orb' ? 35 + Math.random() * 70 : 4 + Math.random() * 10;
            particles.push({
                type: type,
                x: Math.random() * W,
                y: Math.random() * H,
                size: size,
                alpha: 0.06 + Math.random() * 0.12,
                dx: (Math.random() - 0.5) * 0.28,
                dy: (Math.random() - 0.5) * 0.24,
                color: colors[Math.floor(Math.random() * colors.length)],
                phase: Math.random() * Math.PI * 2,
                speed: 0.4 + Math.random() * 1.8,
                rotation: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.008
            });
        }
    });

    // —— 绘制函数 ——

    function drawDot(p, t) {
        const twinkle = Math.sin(t * p.speed + p.phase) * 0.06;
        const a = Math.max(0.04, Math.min(0.22, p.alpha + twinkle));
        ctx.save();
        ctx.globalAlpha = a;
        ctx.fillStyle = `rgba(${p.color.r},${p.color.g},${p.color.b},1)`;
        ctx.shadowColor = `rgba(${p.color.r},${p.color.g},${p.color.b},0.7)`;
        ctx.shadowBlur = 6 + p.size * 2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    function drawStar(p, t) {
        const twinkle = Math.sin(t * p.speed + p.phase) * 0.04;
        const a = Math.max(0.04, Math.min(0.18, p.alpha + twinkle));
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = a;
        ctx.fillStyle = `rgba(${p.color.r},${p.color.g},${p.color.b},1)`;
        ctx.shadowColor = `rgba(${p.color.r},${p.color.g},${p.color.b},0.5)`;
        ctx.shadowBlur = 4;
        ctx.beginPath();
        const spikes = 5, outerR = p.size, innerR = p.size * 0.4;
        for (let i = 0; i < spikes * 2; i++) {
            const r = i % 2 === 0 ? outerR : innerR;
            const angle = (i * Math.PI) / spikes - Math.PI / 2;
            const x = Math.cos(angle) * r, y = Math.sin(angle) * r;
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    function drawCoin(p, t) {
        const a = p.alpha + Math.sin(t * 0.7 + p.phase) * 0.02;
        ctx.save();
        ctx.globalAlpha = a;
        // 外圈
        ctx.strokeStyle = `rgba(${p.color.r},${p.color.g},${p.color.b},0.7)`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.stroke();
        // 内圈
        ctx.strokeStyle = `rgba(${p.color.r},${p.color.g},${p.color.b},0.4)`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.55, 0, Math.PI * 2);
        ctx.stroke();
        // 中心点
        ctx.fillStyle = `rgba(${p.color.r},${p.color.g},${p.color.b},0.5)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.18, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    function drawDiamond(p, t) {
        const a = p.alpha + Math.sin(t * 0.9 + p.phase) * 0.03;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = a;
        ctx.fillStyle = `rgba(${p.color.r},${p.color.g},${p.color.b},0.55)`;
        ctx.shadowColor = `rgba(${p.color.r},${p.color.g},${p.color.b},0.35)`;
        ctx.shadowBlur = 3;
        ctx.beginPath();
        const s = p.size * 0.8;
        ctx.moveTo(0, -s);
        ctx.lineTo(s, 0);
        ctx.lineTo(0, s);
        ctx.lineTo(-s, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    function drawRing(p, t) {
        const a = p.alpha + Math.sin(t * 1.1 + p.phase) * 0.025;
        ctx.save();
        ctx.globalAlpha = a;
        ctx.strokeStyle = `rgba(${p.color.r},${p.color.g},${p.color.b},0.6)`;
        ctx.lineWidth = 1.4;
        ctx.shadowColor = `rgba(${p.color.r},${p.color.g},${p.color.b},0.3)`;
        ctx.shadowBlur = 3;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }

    function drawTriangle(p, t) {
        const a = p.alpha + Math.sin(t * 0.8 + p.phase) * 0.03;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = a;
        ctx.fillStyle = `rgba(${p.color.r},${p.color.g},${p.color.b},0.45)`;
        ctx.beginPath();
        const s = p.size;
        ctx.moveTo(0, -s);
        ctx.lineTo(s * 0.87, s * 0.5);
        ctx.lineTo(-s * 0.87, s * 0.5);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    function drawCross(p, t) {
        const a = p.alpha + Math.sin(t * 0.85 + p.phase) * 0.025;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = a;
        ctx.fillStyle = `rgba(${p.color.r},${p.color.g},${p.color.b},0.5)`;
        const s = p.size, w = s * 0.32;
        ctx.fillRect(-s, -w, s * 2, w * 2);
        ctx.fillRect(-w, -s, w * 2, s * 2);
        ctx.restore();
    }

    function drawHeart(p, t) {
        const a = p.alpha + Math.sin(t * 0.75 + p.phase) * 0.03;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = a;
        ctx.fillStyle = `rgba(${p.color.r},${p.color.g},${p.color.b},0.5)`;
        ctx.beginPath();
        const s = p.size * 0.65;
        ctx.moveTo(0, s * 0.6);
        ctx.bezierCurveTo(-s, -s * 0.2, -s * 0.5, -s * 1.1, 0, -s * 0.5);
        ctx.bezierCurveTo(s * 0.5, -s * 1.1, s, -s * 0.2, 0, s * 0.6);
        ctx.fill();
        ctx.restore();
    }

    function drawCloud(p, t) {
        const a = p.alpha + Math.sin(t * 0.6 + p.phase) * 0.02;
        ctx.save();
        ctx.globalAlpha = a;
        ctx.fillStyle = `rgba(${p.color.r},${p.color.g},${p.color.b},0.4)`;
        const s = p.size * 0.6;
        // 多层叠加圆 → 云朵轮廓
        [{ x: 0, y: 0, r: s }, { x: s * 1.1, y: -s * 0.2, r: s * 0.75 }, { x: -s * 1.0, y: -s * 0.1, r: s * 0.7 }, { x: s * 0.5, y: s * 0.3, r: s * 0.65 }, { x: -s * 0.4, y: s * 0.25, r: s * 0.55 }].forEach(c => {
            ctx.beginPath();
            ctx.arc(p.x + c.x, p.y + c.y, c.r, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.restore();
    }

    function drawOrb(p, t) {
        const pulse = Math.sin(t * p.speed + p.phase) * 0.5 + 0.5;
        const a = p.alpha * (0.4 + pulse * 0.6);
        // 外层大光晕
        ctx.save();
        ctx.globalAlpha = a * 0.3;
        const gradOuter = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2.5);
        gradOuter.addColorStop(0, `rgba(${p.color.r},${p.color.g},${p.color.b},0.3)`);
        gradOuter.addColorStop(0.5, `rgba(${p.color.r},${p.color.g},${p.color.b},0.08)`);
        gradOuter.addColorStop(1, `rgba(${p.color.r},${p.color.g},${p.color.b},0)`);
        ctx.fillStyle = gradOuter;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        // 内核
        ctx.save();
        ctx.globalAlpha = a * 0.8;
        const gradInner = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 0.3);
        gradInner.addColorStop(0, `rgba(${p.color.r},${p.color.g},${p.color.b},0.22)`);
        gradInner.addColorStop(1, `rgba(${p.color.r},${p.color.g},${p.color.b},0)`);
        ctx.fillStyle = gradInner;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    const drawFns = { dot: drawDot, star: drawStar, coin: drawCoin, diamond: drawDiamond, ring: drawRing, triangle: drawTriangle, cross: drawCross, heart: drawHeart, cloud: drawCloud, orb: drawOrb };

    function animate() {
        ctx.clearRect(0, 0, W, H);
        const t = Date.now() * 0.001;

        particles.forEach(p => {
            drawFns[p.type](p, t);
            p.rotation += p.rotSpeed;
            p.x += p.dx;
            p.y += p.dy;
            if (p.x < -60) p.x = W + 60;
            if (p.x > W + 60) p.x = -60;
            if (p.y < -60) p.y = H + 60;
            if (p.y > H + 60) p.y = -60;
        });

        requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', () => {
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width = W;
        canvas.height = H;
    });
}

// ===========================
// 核心能力项 — 点击跳转（记录返回来源）
// ===========================

function initSkillItemClicks() {
    const items = document.querySelectorAll('.skill-item');
    items.forEach(item => {
        item.addEventListener('click', function(e) {
            const url = this.getAttribute('href');
            if (!url || url === '#' || url.startsWith('skill-detail.html')) {
                // skill-detail.html 和外部链接正常跳转
                sessionStorage.setItem('resumeReturnSection', 'skills');
                return;
            }
            // 其他详情页也记录返回来源
            sessionStorage.setItem('resumeReturnSection', 'skills');
        });
    });
}

// ===========================
// 作品集 hover 重设计
// ===========================

function initPortfolioHoverRedesign() {
    const items = document.querySelectorAll('.portfolio-item');
    items.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.classList.add('hovered');
        });
        item.addEventListener('mouseleave', function() {
            this.classList.remove('hovered');
        });
    });
}

// ===========================
// 卡片入场动画
// ===========================

function triggerAnimations(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    const cards = section.querySelectorAll('.experience-card, .project-card, .campus-card, .award-card, .portfolio-item, .skill-category');
    cards.forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, i * 80 + 80);
    });
}

// ===========================
// 通知提示
// ===========================

function showNotification(message) {
    const existing = document.querySelector('.notification-toast');
    if (existing) existing.remove();

    const n = document.createElement('div');
    n.className = 'notification-toast';
    n.textContent = message;
    n.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 99999;
        background: linear-gradient(135deg, #6c63ff, #8a84ff);
        color: white; padding: 12px 24px; border-radius: 12px;
        font-weight: 600; font-size: 0.9rem;
        box-shadow: 0 6px 24px rgba(108, 99, 255, 0.25);
        animation: notifIn 0.35s ease;
    `;
    document.body.appendChild(n);
    setTimeout(() => {
        n.style.animation = 'notifOut 0.35s ease forwards';
        setTimeout(() => n.remove(), 350);
    }, 2200);

    if (!document.getElementById('notifKeyframes')) {
        const style = document.createElement('style');
        style.id = 'notifKeyframes';
        style.textContent = `
            @keyframes notifIn { from { transform: translateX(120%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
            @keyframes notifOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(120%); opacity: 0; } }
        `;
        document.head.appendChild(style);
    }
}
