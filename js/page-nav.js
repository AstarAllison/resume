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
}
