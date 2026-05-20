@echo off
chcp 65001 > nul
echo ===== 销服一线员工沟通反馈平台 部署脚本 =====
echo.

REM 检查 Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 请先安装 Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js 版本: 
node -v
echo.

REM 安装依赖
echo 正在安装依赖...
npm install

if %errorlevel% equ 0 (
    echo 依赖安装成功！
) else (
    echo 依赖安装失败，请检查网络连接
    pause
    exit /b 1
)

echo.
echo ===== 启动服务 =====
echo 启动后访问: http://localhost:3000
echo 按 Ctrl+C 停止服务
echo.

node server.js

pause
