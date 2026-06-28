# 苏欣彤 - 个人简历网站

## 📋 项目简介

这是一个专为苏欣彤设计的个人简历网站，用于求职展示。

**特点：**
- ✅ 单页应用（SPA），丝滑页面切换
- ✅ 响应式设计，适配桌面、平板、手机
- ✅ 三个版本：通用版、游戏行业版、金融专业版
- ✅ 互动式PDF简历展示区
- ✅ 详细经历页面
- ✅ 简洁高效，符合HR浏览习惯

---

## 🚀 文件结构

```
resume-website/
├── index.html              # 主页面
├── experience-detail.html  # 工作经历详情页
├── project-detail.html    # 项目经历详情页
├── css/
│   └── style.css        # 样式文件
├── js/
│   └── main.js          # 交互脚本
├── images/              # 图片文件夹（待添加）
├── 苏欣彤_中文简历.pdf  # 中文简历PDF（待添加）
├── Figma设计指导.md      # Figma设计文件创建指导
├── GitHub部署教程.md     # GitHub Pages部署教程
└── README.md            # 本文件
```

---

## 🎨 使用说明

### 1. 本地预览

直接用浏览器打开 `index.html` 即可预览。

### 2. 添加个人照片

将个人照片命名为 `photo.jpg`，放入 `images/` 文件夹，然后更新 `index.html`：

```html
<!-- 将 -->
<div class="image-placeholder">
    <i class="fas fa-user-circle"></i>
    <p>个人照片</p>
</div>

<!-- 改为 -->
<div class="about-image">
    <img src="images/photo.jpg" alt="苏欣彤" style="width: 300px; border-radius: 16px;">
</div>
```

### 3. 添加PDF简历

1. 将中文简历转换为PDF格式
   - 打开 `中文简历.docx`
   - 点击 "文件" → "导出" → "创建PDF/XPS"
   - 保存为 `苏欣彤_中文简历.pdf`

2. 将PDF文件放入 `resume-website/` 文件夹

3. 更新 `index.html` 中的PDF链接（如果文件名不同）

### 4. 切换版本

点击左侧导航栏上方的版本按钮：
- **通用版**：活力紫蓝 + 珊瑚粉
- **游戏行业版**：紫色 + 红色（显示游戏经历）
- **金融专业版**：深蓝 + 金色

---

## 🚀 部署到GitHub Pages

### 第一步：创建GitHub仓库

1. 访问 https://github.com 并登录
2. 点击右上角 `+` → `New repository`
3. 填写仓库信息：
   - **Repository name**: `resume`（或者 `su-xintong-resume`）
   - **Description**: `我的个人简历网站`
   - 选择 **Public**
   - ✅ 勾选 `Add a README file`
4. 点击 `Create repository`

### 第二步：上传文件

#### 方法A：直接上传（最简单）

1. 在仓库页面，点击 `Add file` → `Upload files`
2. 将以下文件拖拽到页面：
   - `index.html`
   - `experience-detail.html`
   - `project-detail.html`
   - `css/style.css`
   - `js/main.js`
   - `苏欣彤_中文简历.pdf`（如果有）
   - `images/` 文件夹（如果有照片）
3. 在页面底部 `Commit changes` 区域，输入提交信息：
   - `Add resume website files`
4. 点击 `Commit changes`

#### 方法B：使用Git命令（更快）

```bash
# 克隆仓库到本地
git clone https://github.com/<你的用户名>/resume.git
cd resume

# 复制所有文件到仓库文件夹

# 提交并推送
git add .
git commit -m "Add resume website files"
git push origin main
```

### 第三步：启用GitHub Pages

1. 在仓库页面，点击 `Settings`
2. 在左侧菜单，点击 `Pages`
3. 在 `Build and deployment` 部分：
   - **Source**: 选择 `Deploy from a branch`
   - **Branch**: 选择 `main` 和 `/ (root)`
4. 点击 `Save`

等待1-2分钟，GitHub会显示：
> "Your site is live at https://<你的用户名>.github.io/resume/"

### 第四步：访问你的网站

在浏览器中打开显示的网址，如果看到你的简历网站，恭喜！部署成功 🎉

---

## 🔄 如何更新网站内容？

### 方法A：在GitHub网页上直接编辑

1. 在仓库中，点击要编辑的文件（例如 `index.html`）
2. 点击铅笔图标 `Edit this file`
3. 修改内容
4. 滚动到底部，点击 `Commit changes`

> **优点**: 无需安装任何软件，随时可以修改
> **缺点**: 只能逐个文件编辑，不适合大范围修改

### 方法B：修改本地文件后上传

1. 修改你电脑上的 `index.html`、`style.css` 等文件
2. 按照"第二步：上传文件"的方法，重新上传
3. 或者如果使用Git命令：
   ```bash
   git add .
   git commit -m "Update website content"
   git push origin main
   ```

> **优点**: 可以使用专业的代码编辑器
> **缺点**: 需要安装Git（可选）

---

## 📊 详细教程

更多详细说明，请参考：
- **Figma设计指导.md**：如何在Figma中创建可编辑的设计文件
- **GitHub部署教程.md**：从零开始的GitHub Pages部署教程（图文并茂）

---

## 💡 下一步建议

1. **添加个人照片**：提升简历网站的专业度和亲和力
2. **添加PDF简历**：方便HR下载离线版
3. **部署到GitHub Pages**：获得专属网址，可以放到简历里
4. **持续优化**：根据反馈不断改进网站内容和设计

---

## 🆘 常见问题

### Q1: 网站显示404错误怎么办？

**A**: 
- 检查仓库是否为Public
- 检查是否有 `index.html` 文件
- 检查GitHub Pages设置是否正确（选择 `main` 分支和 `/ (root)` 目录）
- 等待5-10分钟，部署需要时间

### Q2: 样式（CSS）没有加载？

**A**: 
- 检查 `index.html` 中CSS文件路径是否正确：
  ```html
  <link rel="stylesheet" href="css/style.css">
  ```
- 确保所有文件都已上传到GitHub

### Q3: 如何添加PDF简历下载？

**A**: 
1. 将PDF文件上传到仓库（例如 `苏欣彤_中文简历.pdf`）
2. 在 `index.html` 中修改下载按钮链接：
   ```html
   <a href="苏欣彤_中文简历.pdf" download class="btn btn-primary">
       <i class="fas fa-download"></i> 下载PDF简历
   </a>
   ```

### Q4: 部署后还能修改吗？

**A**: 当然可以！按照"如何更新网站内容"部分的步骤操作即可。修改后，GitHub Pages会自动重新部署（通常需要1-2分钟）。

---

## 📞 需要帮助？

随时联系我（巴迪）！我可以：
- 帮你解决部署问题
- 指导你如何修改网站内容
- 提供更多优化建议

---

**祝求职顺利！🎉**
