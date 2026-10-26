#!/usr/bin/env bash
# Publica el sitio en S3 e invalida CloudFront. Uso: ./deploy/deploy.sh
set -euo pipefail
cd "$(dirname "$0")/.."

[ -f deploy/.env ] || { echo "Falta deploy/.env (copia deploy/.env.example)"; exit 1; }
set -a; . deploy/.env; set +a
: "${BUCKET:?}" "${DISTRIBUTION_ID:?}"
[ -n "${AWS_PROFILE:-}" ] || unset AWS_PROFILE

EXCLUDES=(--exclude ".git/*" --exclude "deploy/*" --exclude "README.md" --exclude ".gitignore"
          --exclude ".playwright-mcp/*" --exclude "*.md" --exclude "*.DS_Store" --exclude "*.gitkeep")

# 1) todo lo que no es HTML: caché 1 h (los archivos no llevan hash)
aws s3 sync . "s3://$BUCKET" "${EXCLUDES[@]}" --exclude "*.html" \
  --cache-control "max-age=3600" --delete

# 2) HTML: siempre revalidar
aws s3 sync . "s3://$BUCKET" "${EXCLUDES[@]}" --exclude "*" --include "*.html" \
  --cache-control "no-cache" --delete

aws cloudfront create-invalidation --distribution-id "$DISTRIBUTION_ID" --paths "/*" \
  --query 'Invalidation.{Id:Id,Status:Status}' --output text

echo "Listo: https://antoniorosascastillo.com"
