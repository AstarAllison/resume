/**
 * 页面导航助手 — 统一所有详情页的返回逻辑
 * 用法：在详情页 </body> 前引入此文件，然后调用 initPageNav()
 */

const SECTION_MAP = {
    home:        { name: '首页',      url: 'index.html' },
    about:       { name: '关于我',    url: 'index.html#about' },
    skills:      { name: '核心能力',  url: 'index.html#skills' },
    experience:  { name: '工作实习',  url: 'index.html#experience' },
    projects:    { name: '项目经历',  url: 'index.html#projects' },
    // 兼容历史键名 'project'（单数） → 自动指向项目经历
    project:     { name: '项目经历',  url: 'index.html#projects' },
    campus:      { name: '校园经历',  url: 'index.html#campus' },
    awards:      { name: '荣誉奖项',  url: 'index.html#awards' },
    portfolio:   { name: '个人作品',  url: 'index.html#portfolio' },
};

/**
 * 初始化移动端浮动导航按钮（FAB）
 * 在所有页面（包括 index.html）上注入圆形菜单按钮
 */
function initMobileNavFab() {
    // 防止重复注入
    if (document.getElementById('navFab')) return;

    const sidebar = document.querySelector('.side-nav');
    if (!sidebar) return;

    // 创建遮罩层
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    overlay.id = 'navOverlay';

    // 创建 FAB 按钮
    const fab = document.createElement('button');
    fab.className = 'nav-fab';
    fab.id = 'navFab';
    fab.innerHTML = '<i class="fas fa-bars"></i>';
    fab.setAttribute('aria-label', '打开导航菜单');

    // 左侧边缘感应区（桌面端）
    const edgeZone = document.createElement('div');
    edgeZone.className = 'nav-edge-zone';
    edgeZone.id = 'navEdgeZone';

    // 切换侧边栏状态
    function openSidebar() {
        sidebar.classList.add('mobile-open');
        fab.classList.add('active');
        fab.innerHTML = '<i class="fas fa-times"></i>';
        overlay.classList.add('visible');
        document.body.style.overflow = 'hidden'; /* 防止背景滚动 */
    }

    function closeSidebar() {
        sidebar.classList.remove('mobile-open');
        fab.classList.remove('active');
        fab.innerHTML = '<i class="fas fa-bars"></i>';
        overlay.classList.remove('visible');
        document.body.style.overflow = '';
    }

    function toggleSidebar() {
        if (sidebar.classList.contains('mobile-open')) {
            closeSidebar();
        } else {
            openSidebar();
        }
    }

    // 绑定事件
    fab.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleSidebar();
    });

    overlay.addEventListener('click', closeSidebar);

    // 点击侧边栏导航链接后自动关闭侧边栏（移动端）
    sidebar.addEventListener('click', function(e) {
        const link = e.target.closest('.nav-link');
        if (link) {
            // 在 index.html 上，导航由 main.js 的 initNavigation 处理（preventDefault + showSection）
            // 这里只负责关闭侧边栏，让用户看到切换后的内容
            // 在详情页上，链接的 href 会正常跳转，关闭侧边栏不影响导航
            closeSidebar();
        }
    });

    // 桌面端左侧边缘 hover 自动展开（带防抖）
    let edgeTimer = null;
    edgeZone.addEventListener('mouseenter', function() {
        clearTimeout(edgeTimer);
        // 只在非移动端且侧边栏未展开时触发
        if (window.innerWidth > 1024 && !sidebar.classList.contains('mobile-open')) {
            edgeTimer = setTimeout(openSidebar, 150);
        }
    });

    // 鼠标离开感应区+侧边栏区域后自动关闭
    edgeZone.addEventListener('mouseleave', function() {
        clearTimeout(edgeTimer);
    });

    sidebar.addEventListener('mouseleave', function() {
        if (window.innerWidth > 1024) {
            setTimeout(function() {
                if (!sidebar.matches(':hover') && !edgeZone.matches(':hover')) {
                    closeSidebar();
                }
            }, 300);
        }
    });

    // ESC 键关闭
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeSidebar();
    });

    // 窗口 resize 时如果变回大屏，关闭移动端状态
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1024) {
            closeSidebar();
            overlay.classList.remove('visible');
        }
    });

    // 注入到 DOM
    document.body.appendChild(overlay);
    document.body.appendChild(fab);
    document.body.appendChild(edgeZone);
}

/**
 * 初始化页面导航
 * @param {Object} options
 * @param {string[]} options.relatedSections - 本页面还可从哪些板块跳转过来（显示快速导航）
 * @param {string}   options.fallbackSection  - sessionStorage 无记录时的默认返回板块
 * @param {string}   options.returnContainerId - 返回按钮插入的容器 ID（默认 'navTop'）
 */
function initPageNav(options = {}) {
    const related   = options.relatedSections  || [];
    const fallback  = options.fallbackSection  || 'home';
    const topId     = options.returnContainerId || 'navTop';
    const bottomId  = options.returnBottomId   || 'navBottom';

    // 1. 读取来源
    const returnSection = sessionStorage.getItem('resumeReturnSection') || fallback;
    const returnInfo    = SECTION_MAP[returnSection] || SECTION_MAP['home'];

    // 2. 生成顶部返回按钮
    const topContainer = document.getElementById(topId);
    if (topContainer) {
        topContainer.innerHTML = `
            <a href="${returnInfo.url}" class="back-btn">
                <i class="fas fa-arrow-left"></i> 返回${returnInfo.name}
            </a>`;
    }

    // 3. 生成底部返回按钮 + 快速导航
    const bottomContainer = document.getElementById(bottomId);
    if (bottomContainer) {
        let quickNav = '';
        // 去重：剔除当前返回目标，只显示其他可跳转板块
        const navSections = [...new Set([returnSection, ...related])];
        const otherSections = navSections.filter(s => s !== returnSection && SECTION_MAP[s]);

        if (otherSections.length > 0) {
            quickNav = '<div class="quick-nav"><span class="quick-nav-label">快速前往：</span>'
                + otherSections.map(s => {
                    const info = SECTION_MAP[s];
                    return `<a href="${info.url}" class="quick-nav-link">${info.name}</a>`;
                }).join('') + '</div>';
        }

        bottomContainer.innerHTML = `
            <a href="${returnInfo.url}" class="back-btn back-btn-bottom">
                <i class="fas fa-arrow-left"></i> 返回${returnInfo.name}
            </a>
            ${quickNav}`;
    }

    // 4. 初始化移动端浮动导航按钮
    initMobileNavFab();
}
