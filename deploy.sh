#!/bin/bash

echo "===== 销服一线员工沟通反馈平台 部署脚本 ====="
echo ""

# 检查是否已安装 Node.js
if ! command -v node &> /dev/null; then
    echo "错误: 请先安装 Node.js"
    echo "下载地址: https://nodejs.org/"
    exit 1
fi

echo "Node.js 版本: $(node -v)"
echo ""

# 安装依赖
echo "正在安装依赖..."
npm install

if [ $? -eq 0 ]; then
    echo "依赖安装成功！"
else
    echo "依赖安装失败，请检查网络连接"
    exit 1
fi

echo ""
echo "===== 启动服务 ====="
echo "启动后访问: http://localhost:3000"
echo "按 Ctrl+C 停止服务"
echo ""

# 启动服务
PORT=${PORT:-3000}
node server.js
