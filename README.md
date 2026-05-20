# 销服一线员工沟通反馈平台 - 部署指南

## 快速部署（Windows）

### 方式一：Windows 部署
1. 双击运行 `deploy.bat`
2. 等待自动安装依赖并启动服务
3. 打开浏览器访问 http://localhost:3000

### 方式二：手动部署
1. 安装 Node.js (https://nodejs.org/)
2. 打开命令行，进入项目目录
3. 执行以下命令：
   ```
   npm install
   node server.js
   ```
4. 打开浏览器访问 http://localhost:3000

## 局域网访问

在同一局域网内的其他电脑，可以通过 `http://你的IP地址:3000` 访问。

查看本机IP地址：
- Windows: 打开命令提示符，输入 `ipconfig`
- 查找 IPv4 地址（如 192.168.1.100）

## 云服务器部署

### 1. 购买云服务器
推荐阿里云、腾讯云，购买后选择以下配置：
- 系统: Ubuntu 22.04 / CentOS 7
- 配置: 1核2G 起

### 2. 上传文件
使用 scp 或 FTP 工具上传项目文件到服务器：
```bash
scp -r ./新建文件夹 user@你的服务器IP:/home/user/
```

### 3. 安装依赖
SSH 连接到服务器后执行：
```bash
cd /home/user/新建文件夹
npm install
```

### 4. 启动服务
```bash
npm install -g pm2
pm2 start server.js --name dashboard
pm2 save
pm2 startup
```

### 5. 配置防火墙
在云服务器控制台开放 3000 端口

### 6. 访问
通过 `http://你的服务器IP:3000` 访问

## 停止服务
```bash
pm2 stop dashboard
```

## 更新代码
1. 上传新文件到服务器
2. 执行：
```bash
pm2 restart dashboard
```
