#!/bin/bash

# Bingoclaw 环境配置脚本
# 兼容 macOS/Linux

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

command_exists() {
    command -v "$1" >/dev/null 2>&1
}

main() {
    echo -e "${GREEN}"
    echo "🦞 Bingoclaw 环境配置"
    echo "====================="
    echo -e "${NC}"

    # 1. 检查 Node.js
    log_info "检查 Node.js..."
    if ! command_exists node; then
        log_error "未安装 Node.js"
        
        # 检测操作系统并提供安装建议
        if [[ "$OSTYPE" == "darwin"* ]]; then
            log_info "macOS 安装方式:"
            echo "  brew install node@18"
            echo "  或访问 https://nodejs.org 下载安装包"
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            log_info "Linux 安装方式:"
            echo "  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -"
            echo "  sudo apt-get install -y nodejs"
        fi
        exit 1
    fi

    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        log_error "Node.js 版本过低 (当前: v${NODE_VERSION}，需要: 18+)"
        exit 1
    fi
    log_success "Node.js $(node -v)"

    # 2. 检查 pnpm
    log_info "检查 pnpm..."
    if ! command_exists pnpm; then
        log_warn "未安装 pnpm，正在安装..."
        npm install -g pnpm
        log_success "pnpm 安装完成"
    fi
    log_success "pnpm $(pnpm -v)"

    # 3. 检查 Git
    log_info "检查 Git..."
    if ! command_exists git; then
        log_warn "未安装 Git"
        if [[ "$OSTYPE" == "darwin"* ]]; then
            log_info "macOS: brew install git"
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            log_info "Linux: sudo apt-get install git"
        fi
    else
        log_success "Git $(git --version | cut -d' ' -f3)"
    fi

    # 4. 检查 .env 文件
    log_info "检查环境变量文件..."
    if [ ! -f .env ]; then
        if [ -f .env.example ]; then
            log_warn ".env 不存在，从 .env.example 复制..."
            cp .env.example .env
            log_success ".env 文件已创建"
            log_warn "请编辑 .env 文件，填入你的 API Key:"
            echo ""
            echo "  # 必需"
            echo "  BIGMODEL_API_KEY=your_bigmodel_api_key"
            echo ""
            echo "  # 可选（飞书集成）"
            echo "  FEISHU_APP_ID=your_feishu_app_id"
            echo "  FEISHU_APP_SECRET=your_feishu_app_secret"
            echo ""
        else
            log_error ".env.example 不存在，请手动创建 .env 文件"
            exit 1
        fi
    else
        log_success ".env 文件存在"
    fi

    # 5. 安装依赖
    log_info "安装项目依赖..."
    pnpm install
    log_success "依赖安装完成"

    # 6. 检查关键依赖
    log_info "检查关键依赖..."
    if [ -d "node_modules" ]; then
        log_success "node_modules 存在"
    else
        log_error "node_modules 不存在，依赖安装可能失败"
        exit 1
    fi

    # 7. 构建检查
    log_info "检查构建配置..."
    if [ -f "tsconfig.json" ]; then
        log_success "tsconfig.json 存在"
    else
        log_warn "tsconfig.json 不存在"
    fi

    if [ -f "vercel.json" ]; then
        log_success "vercel.json 存在"
    else
        log_warn "vercel.json 不存在"
    fi

    # 8. 完成
    echo ""
    log_success "环境配置完成！"
    echo ""
    log_info "下一步:"
    echo "  1. 编辑 .env 文件，填入 API Key"
    echo "  2. 启动开发服务器: pnpm dev"
    echo "  3. 或运行测试: pnpm test"
    echo "  4. 或部署到 Vercel: ./scripts/deploy.sh"
}

main "$@"
