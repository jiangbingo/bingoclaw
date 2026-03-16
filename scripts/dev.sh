#!/bin/bash

# Bingoclaw 本地开发脚本
# 并行启动 web 和 api 服务

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

# 检查环境
check_env() {
    if [ ! -f .env ]; then
        log_warn ".env 文件不存在"
        if [ -f .env.example ]; then
            log_info "从 .env.example 复制..."
            cp .env.example .env
            log_warn "请编辑 .env 文件，填入你的 API Key"
        else
            log_warn "请手动创建 .env 文件"
        fi
    fi
}

# 清理函数
cleanup() {
    log_info "停止所有服务..."
    if [ ! -z "$WEB_PID" ]; then
        kill $WEB_PID 2>/dev/null || true
    fi
    if [ ! -z "$API_PID" ]; then
        kill $API_PID 2>/dev/null || true
    fi
    log_success "服务已停止"
    exit 0
}

# 捕获退出信号
trap cleanup SIGINT SIGTERM

main() {
    echo -e "${GREEN}"
    echo "🦞 Bingoclaw 本地开发环境"
    echo "========================="
    echo -e "${NC}"

    # 检查环境
    check_env

    # 检查依赖
    if [ ! -d "node_modules" ]; then
        log_info "安装依赖..."
        pnpm install
    fi

    log_info "启动开发服务器..."
    echo ""

    # 方式1: 使用 pnpm dev（推荐）
    if grep -q '"dev"' package.json; then
        log_success "使用 pnpm dev 启动"
        pnpm dev
    else
        # 方式2: 手动启动多个服务
        log_warn "package.json 中未找到 dev 脚本"
        log_info "手动启动服务..."

        # 启动 Web UI
        if [ -d "apps/web" ]; then
            log_info "启动 Web UI (http://localhost:5173)..."
            cd apps/web
            pnpm dev &
            WEB_PID=$!
            cd ../..
        fi

        # 启动 API（如果存在）
        if [ -d "apps/api" ]; then
            log_info "启动 API Server (http://localhost:3000)..."
            cd apps/api
            pnpm dev &
            API_PID=$!
            cd ../..
        fi

        # 等待所有后台进程
        wait
    fi
}

main "$@"
