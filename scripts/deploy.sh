#!/bin/bash

# DevOps Portal: Stage 6 Deployment Script
# This script manages the production rollout to the Vercel environment.

echo "🚀 [Stage 6] Initiating Production Deployment..."

# 1. Pre-deployment check
echo "🔍 Running pre-deployment validation..."
npm run lint && npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build validation passed."
    
    # 2. Trigger Vercel Deployment
    echo "🌐 Uploading artifacts to Vercel..."
    # Note: Requires Vercel CLI login or VERCEL_TOKEN env var
    npx vercel --prod
    
    echo "🏁 Deployment sequence complete."
else
    echo "❌ Deployment aborted: Build or Lint errors detected."
    exit 1
fi
