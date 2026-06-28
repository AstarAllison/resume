# GitHub Pages 部署教程

## 📘 什么是GitHub Pages？

GitHub Pages是GitHub提供的免费静态网站托管服务。你可以：
- ✅ 免费托管网站
- ✅ 获得一个专属网址（例如：`su-xintong.github.io/resume`)
- ✅ 其他人可以通过网址访问你的简历网站
- ✅ 随时更新内容，自动同步

---

## 🚀 部署步骤（超详细图文教程）

### 第一步：创建GitHub账号（如果还没有）

1. 访问 https://github.com
2. 点击右上角 `Sign up`
3. 输入用户名、邮箱、密码
4. 完成验证，创建账号

> **Tips**: 用户名会变成你网址的一部分，建议用简单好记的，比如 `su-xintong`

---

### 第二步：创建新仓库 (Repository)

1. 登录GitHub后，点击右上角 `+` → `New repository`
2. 填写仓库信息：
   - **Repository name**: `resume` （或者 `su-xintong-resume`）
   - **Description**: `我的个人简历网站` （可选）
   - 选择 **Public** （私有仓库无法使用GitHub Pages免费版）
   - ✅ 勾选 `Add a README file`
3. 点击 `Create repository`

> **重要**: 如果你想使用个性化网址（比如 `su-xintong.github.io`），需要将仓库命名为 `<你的用户名>.github.io`

---

### 第三步：上传网站文件

#### 方法A：直接上传（最简单）

1. 在仓库页面，点击 `Add file` → `Upload files`
2. 将以下文件拖拽到页面：
   - `index.html`
   - `css/style.css`
   - `js/main.js`
   - （如果有图片）`images/` 文件夹
3. 在页面底部 `Commit changes` 区域，输入提交信息：
   - `Add resume website files`
4. 点击 `Commit changes`

#### 方法B：使用Git命令（更快）

1. 下载并安装Git：https://git-scm.com/downloads
2. 打开终端（Windows用Git Bash）
3. 克隆仓库到本地：
   ```bash
   git clone https://github.com/<你的用户名>/resume.git
   ```
4. 将网站文件复制到克隆的文件夹
5. 提交并推送：
   ```bash
   cd resume
   git add .
   git commit -m "Add resume website files"
   git push origin main
   ```

---

### 第四步：启用GitHub Pages

1. 在仓库页面，点击 `Settings`
2. 在左侧菜单，点击 `Pages`
3. 在 `Build and deployment` 部分：
   - **Source**: 选择 `Deploy from a branch`
   - **Branch**: 选择 `main` 和 `/ (root)`
4. 点击 `Save`

等待1-2分钟，GitHub会显示：
> "Your site is live at https://<你的用户名>.github.io/resume/"

---

### 第五步：访问你的网站

1. 在浏览器中打开显示的网址
2. 如果看到你的简历网站，恭喜！部署成功 🎉
3. 如果看到404错误，等待几分钟再刷新

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
2. 按照"第三步：上传网站文件"的方法，重新上传
3. 或者如果使用Git命令：
   ```bash
   git add .
   git commit -m "Update website content"
   git push origin main
   ```

---

## 🎨 自定义域名（可选）

如果你有自己的域名（例如 `www.suxintong.com`），可以绑定到GitHub Pages：

1. 在域名服务商（阿里云、腾讯云等）添加CNAME记录：
   - 主机记录：`www` 或 `@`
   - 记录值：`<你的用户名>.github.io`
2. 在GitHub仓库的 `Settings` → `Pages` → `Custom domain` 输入你的域名
3. 点击 `Save`
4. 勾选 `Enforce HTTPS` 以启用HTTPS访问

---

## 📊 检查网站状态

- **访问统计**: 无法直接在GitHub Pages查看访问量，可以使用Google Analytics
- **正常运行**: 如果网站无法访问，检查：
  1. 仓库是否为Public
  2. GitHub Pages是否已启用
  3. 文件路径是否正确（`index.html` 应在根目录）
  4. 等待几分钟，GitHub Pages部署需要时间

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
1. 将PDF文件上传到仓库（例如 `files/苏欣彤简历.pdf`）
2. 在 `index.html` 中修改下载按钮链接：
   ```html
   <a href="files/苏欣彤简历.pdf" download class="btn btn-primary">
       <i class="fas fa-download"></i> 下载PDF简历
   </a>
   ```

### Q4: 部署后还能修改吗？
**A**: 当然可以！按照"如何更新网站内容"部分的步骤操作即可。修改后，GitHub Pages会自动重新部署（通常需要1-2分钟）。

---

## 🔗 参考资料

- [GitHub Pages 官方文档](https://docs.github.com/en/pages)
- [GitHub 官方教程](https://skills.github.com/)
- [免费的GitHub Pages模板](https://pages.github.com/themes/)

---

## 💡 下一步

部署成功后，你可以：
1. **分享网址**：将网址放到你的LinkedIn、邮箱签名中
2. **持续优化**：根据反馈不断改进网站内容和设计
3. **添加分析**：使用Google Analytics了解访客行为
4. **自定义域名**：如果有自己的域名，可以绑定到GitHub Pages

---

**需要帮助？** 随时联系我（巴迪）！我可以：
- 帮你解决部署问题
- 指导你如何修改网站内容
- 提供更多优化建议
