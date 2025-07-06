#!/bin/bash

echo "🚀 FinQuest Backend - GitHub Deployment Helper"
echo "=============================================="
echo ""

# Check if remote origin exists
if git remote get-url origin >/dev/null 2>&1; then
    echo "✅ Remote origin already exists"
    echo "Current remote URL: $(git remote get-url origin)"
    echo ""
    echo "Pushing to existing repository..."
    git push -u origin main
else
    echo "❌ No remote origin found"
    echo ""
    echo "📋 To deploy to Railway, you need to:"
    echo ""
    echo "1. Create a GitHub repository:"
    echo "   - Go to https://github.com/new"
    echo "   - Name it 'finquest-backend' or similar"
    echo "   - Make it public or private"
    echo "   - Don't initialize with README (we already have one)"
    echo ""
    echo "2. Add the remote origin:"
    echo "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git"
    echo ""
    echo "3. Push the code:"
    echo "   git push -u origin main"
    echo ""
    echo "4. Deploy on Railway:"
    echo "   - Go to https://railway.app"
    echo "   - Connect your GitHub repository"
    echo "   - Add PostgreSQL database"
    echo "   - Deploy automatically"
    echo ""
    echo "📖 See DEPLOYMENT.md for detailed instructions"
fi

echo ""
echo "🎯 Your code is ready for Railway deployment!"
echo "📁 Files included:"
echo "   ✅ server.js - Main API server"
echo "   ✅ prisma/schema.prisma - Database schema"
echo "   ✅ package.json - Dependencies and scripts"
echo "   ✅ railway.json - Railway configuration"
echo "   ✅ README.md - Documentation"
echo "   ✅ DEPLOYMENT.md - Deployment guide" 