@echo off
chcp 65001 >nul
echo ========================================
echo   将工作区文件同步到 Git 仓库
echo   源: D:\WorkBuddy\resume-website\
echo   目标: D:\Workbuddy\resume-git\
echo ========================================
echo.

set SRC=D:\WorkBuddy\resume-website
set DST=D:\Workbuddy\resume-git

echo [1/3] 复制 HTML 文件...
copy /Y "%SRC%\*.html" "%DST%\" >nul 2>&1
if %errorlevel%==0 (echo   OK - HTML 文件复制完成) else (echo   FAIL - HTML 文件复制失败)

echo [2/3] 复制 CSS 文件...
if not exist "%DST%\css" mkdir "%DST%\css"
copy /Y "%SRC%\css\*.css" "%DST%\css\" >nul 2>&1
if %errorlevel%==0 (echo   OK - CSS 文件复制完成) else (echo   FAIL - CSS 文件复制失败)

echo [3/3] 复制 JS 文件...
if not exist "%DST%\js" mkdir "%DST%\js"
copy /Y "%SRC%\js\*.js" "%DST%\js\" >nul 2>&1
if %errorlevel%==0 (echo   OK - JS 文件复制完成) else (echo   FAIL - JS 文件复制失败)

echo.
echo ========================================
echo   所有文件已复制到 Git 仓库！
echo   现在请打开 GitHub Desktop 进行推送
echo ========================================
echo.
pause
