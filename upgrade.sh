#!/bin/bash

# Hexo 升级脚本
# 将 Hexo 从 4.2.0 升级到 7.2.0

set -e  # 遇到错误立即退出

echo "=========================================="
echo "Hexo 升级脚本"
echo "从 4.2.0 升级到 7.2.0"
echo "=========================================="
echo ""

# 检查 Node.js 版本
echo "1. 检查 Node.js 版本..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 14 ]; then
    echo "❌ 错误: Node.js 版本需要 >= 14.0.0"
    echo "当前版本: $(node -v)"
    echo "请先升级 Node.js: https://nodejs.org/"
    exit 1
fi
echo "✅ Node.js 版本: $(node -v)"
echo ""

# 备份提示
echo "2. 建议先备份项目..."
echo "   执行: cp -r . ../new-blog-backup"
echo "   按 Enter 继续，或 Ctrl+C 取消..."
read
echo ""

# 清理旧的依赖
echo "3. 清理旧的依赖..."
if [ -d "node_modules" ]; then
    echo "   删除 node_modules..."
    rm -rf node_modules
fi
if [ -f "package-lock.json" ]; then
    echo "   删除 package-lock.json..."
    rm -f package-lock.json
fi
echo "✅ 清理完成"
echo ""

# 安装新依赖
echo "4. 安装新的依赖包..."
echo "   这可能需要几分钟时间..."
npm install
echo "✅ 依赖安装完成"
echo ""

# 验证安装
echo "5. 验证 Hexo 版本..."
HEXO_VERSION=$(npx hexo version | head -n 1)
echo "   $HEXO_VERSION"
echo ""

# 清理并测试生成
echo "6. 清理旧的生成文件..."
npm run clean
echo "✅ 清理完成"
echo ""

echo "7. 测试生成静态文件..."
npm run build
echo "✅ 生成完成"
echo ""

echo "=========================================="
echo "升级完成！"
echo "=========================================="
echo ""
echo "下一步："
echo "1. 启动本地服务器测试: npm run server"
echo "2. 访问 http://localhost:4000 检查博客"
echo "3. 如果一切正常，执行部署: ./deploy.sh"
echo ""

