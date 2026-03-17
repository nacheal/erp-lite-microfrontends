#!/bin/bash

set -e

echo "🚀 开始部署 ERP Lite 微前端系统..."

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 部署微应用
echo -e "${YELLOW}📦 部署微应用...${NC}"

apps=("app-user" "app-product" "app-order" "app-dashboard")
urls=()

for app in "${apps[@]}"; do
  echo -e "${GREEN}正在部署 $app...${NC}"
  cd "packages/$app"
  url=$(vercel --prod --yes 2>&1 | grep -o 'https://[^ ]*' | head -1)
  urls+=("$url")
  echo -e "${GREEN}✅ $app 部署完成: $url${NC}"
  cd ../..
done

# 配置主应用环境变量
echo -e "${YELLOW}🔧 配置主应用环境变量...${NC}"
cd packages/shell-app

vercel env rm VITE_APP_USER_ENTRY production --yes || true
vercel env add VITE_APP_USER_ENTRY production <<< "${urls[0]}"

vercel env rm VITE_APP_PRODUCT_ENTRY production --yes || true
vercel env add VITE_APP_PRODUCT_ENTRY production <<< "${urls[1]}"

vercel env rm VITE_APP_ORDER_ENTRY production --yes || true
vercel env add VITE_APP_ORDER_ENTRY production <<< "${urls[2]}"

vercel env rm VITE_APP_DASHBOARD_ENTRY production --yes || true
vercel env add VITE_APP_DASHBOARD_ENTRY production <<< "${urls[3]}"

# 部署主应用
echo -e "${YELLOW}🎯 部署主应用...${NC}"
shell_url=$(vercel --prod --yes 2>&1 | grep -o 'https://[^ ]*' | head -1)
echo -e "${GREEN}✅ 主应用部署完成: $shell_url${NC}"

cd ../..

echo -e "${GREEN}🎉 部署完成！${NC}"
echo -e "${GREEN}主应用地址: $shell_url${NC}"
