#!/bin/bash

# bingoClaw 部署脚本
# 用法: ./scripts/deploy.sh [vercel|railway|aliyun]

set -e

PLATFORM=${1:-vercel}

echo "🦞 开始部署 bingoClaw 到 $PLATFORM..."
echo ""

# 检查环境
check_environment() {
  echo "🔍 检查环境..."

  # 检查 Node.js
  if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装"
    exit 1
  fi

  # 检查 pnpm
  if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm 未安装"
    echo "请运行: npm install -g pnpm"
    exit 1
  fi

  echo "✅ 环境检查通过"
  echo "  Node.js: $(node -v)"
  echo "  pnpm: $(pnpm -v)"
  echo ""
}

# 安装依赖
install_dependencies() {
  echo "📦 安装依赖..."
  pnpm install
  echo "✅ 依赖安装完成"
  echo ""
}

# 运行测试
run_tests() {
  echo "🧪 运行测试..."
  if pnpm test; then
    echo "✅ 测试通过"
  else
    echo "⚠️  测试失败，是否继续部署？(y/N)"
    read -r response
    if [[ ! "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
      exit 1
    fi
  fi
  echo ""
}

# 部署到 Vercel
deploy_vercel() {
  echo "🚀 部署到 Vercel..."

  # 检查 Vercel CLI
  if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI 未安装"
    echo "请运行: npm install -g vercel"
    exit 1
  fi

  # 登录 Vercel
  echo "📝 请确保已登录 Vercel"
  vercel whoami || vercel login

  # 部署
  vercel --prod

  echo ""
  echo "✅ Vercel 部署完成！"
  echo "🌐 请访问: https://bingoclaw.vercel.app"
}

# 部署到 Railway
deploy_railway() {
  echo "🚀 部署到 Railway..."

  # 检查 Railway CLI
  if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI 未安装"
    echo "请运行: npm install -g @railway/cli"
    exit 1
  fi

  # 登录 Railway
  railway login || true

  # 部署
  railway up

  echo ""
  echo "✅ Railway 部署完成！"
}

# 部署到阿里云
deploy_aliyun() {
  echo "🚀 部署到阿里云..."

  # 检查阿里云 CLI
  if ! command -v aliyun &> /dev/null; then
    echo "❌ 阿里云 CLI 未安装"
    echo "请访问: https://help.aliyun.com/document_detail/110344.html"
    exit 1
  fi

  # 构建 Docker 镜像
  echo "🐳 构建 Docker 镜像..."
  docker build -t bingoclaw:latest .

  # 推送到阿里云容器镜像服务
  docker tag bingoclaw:latest registry.cn-hangzhou.aliyuncs.com/bingoclaw/bingoclaw:latest
  docker push registry.cn-hangzhou.aliyuncs.com/bingoclaw/bingoclaw:latest

  echo ""
  echo "✅ 阿里云部署完成！"
}

# 主流程
main() {
  check_environment
  install_dependencies
  run_tests

  case $PLATFORM in
    vercel)
      deploy_vercel
      ;;
    railway)
      deploy_railway
      ;;
    aliyun)
      deploy_aliyun
      ;;
    *)
      echo "❌ 不支持的平台: $PLATFORM"
      echo "支持的平台: vercel, railway, aliyun"
      exit 1
      ;;
  esac

  echo ""
  echo "🎉 部署成功！"
  echo ""
  echo "📋 下一步:"
  echo "  1. 配置环境变量（BIGMODEL_API_KEY, SUPABASE_URL, SUPABASE_ANON_KEY）"
  echo "  2. 测试 API 接口"
  echo "  3. 查看监控日志"
  echo ""
}

main
