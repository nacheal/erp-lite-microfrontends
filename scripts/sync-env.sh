#!/bin/bash

# 同步环境变量到所有 Vercel 项目

projects=(
  "erp-lite-shell"
  "erp-lite-user"
  "erp-lite-product"
  "erp-lite-order"
  "erp-lite-dashboard"
)

# API 基础 URL
api_url="https://api.erp-lite.com"

for project in "${projects[@]}"; do
  echo "配置 $project 环境变量..."

  vercel env rm VITE_API_BASE_URL production --yes --scope=$project || true
  echo $api_url | vercel env add VITE_API_BASE_URL production --scope=$project

  vercel env rm NODE_ENV production --yes --scope=$project || true
  echo "production" | vercel env add NODE_ENV production --scope=$project
done

echo "环境变量同步完成！"
