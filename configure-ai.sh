#!/bin/bash

echo "🚀 Nano Banana AI 服务配置"
echo "================================"

# 检查 .env.local 是否存在
if [ ! -f ".env.local" ]; then
    echo "📋 创建 .env.local 文件..."
    cp env.example .env.local
fi

echo ""
echo "请选择要配置的AI服务："
echo "1. Stability AI (推荐，性价比高)"
echo "2. OpenAI DALL-E 3 (质量最高)"
echo "3. 配置多个服务"
echo "4. 跳过配置"
echo ""

read -p "请输入选择 (1-4): " choice

case $choice in
    1)
        echo ""
        echo "🔧 配置 Stability AI"
        echo "获取API Key: https://platform.stability.ai/"
        read -p "请输入 Stability AI API Key: " stability_key
        
        if [ ! -z "$stability_key" ]; then
            # 更新 .env.local 文件
            sed -i.bak "s/STABILITY_API_KEY=.*/STABILITY_API_KEY=$stability_key/" .env.local
            sed -i.bak "s/AI_DEFAULT_SERVICE=.*/AI_DEFAULT_SERVICE=stability/" .env.local
            echo "✅ Stability AI 配置完成！"
        else
            echo "❌ API Key 不能为空"
        fi
        ;;
    2)
        echo ""
        echo "🔧 配置 OpenAI DALL-E 3"
        echo "获取API Key: https://platform.openai.com/"
        read -p "请输入 OpenAI API Key: " openai_key
        
        if [ ! -z "$openai_key" ]; then
            # 更新 .env.local 文件
            sed -i.bak "s/OPENAI_API_KEY=.*/OPENAI_API_KEY=$openai_key/" .env.local
            sed -i.bak "s/AI_DEFAULT_SERVICE=.*/AI_DEFAULT_SERVICE=openai/" .env.local
            echo "✅ OpenAI 配置完成！"
        else
            echo "❌ API Key 不能为空"
        fi
        ;;
    3)
        echo ""
        echo "🔧 配置多个AI服务"
        
        echo "Stability AI:"
        read -p "请输入 Stability AI API Key (可选): " stability_key
        if [ ! -z "$stability_key" ]; then
            sed -i.bak "s/STABILITY_API_KEY=.*/STABILITY_API_KEY=$stability_key/" .env.local
        fi
        
        echo "OpenAI:"
        read -p "请输入 OpenAI API Key (可选): " openai_key
        if [ ! -z "$openai_key" ]; then
            sed -i.bak "s/OPENAI_API_KEY=.*/OPENAI_API_KEY=$openai_key/" .env.local
        fi
        
        echo "Replicate:"
        read -p "请输入 Replicate API Token (可选): " replicate_token
        if [ ! -z "$replicate_token" ]; then
            sed -i.bak "s/REPLICATE_API_TOKEN=.*/REPLICATE_API_TOKEN=$replicate_token/" .env.local
        fi
        
        echo "选择默认服务:"
        echo "1. stability"
        echo "2. openai"
        echo "3. replicate"
        read -p "请选择默认服务 (1-3): " default_choice
        
        case $default_choice in
            1) sed -i.bak "s/AI_DEFAULT_SERVICE=.*/AI_DEFAULT_SERVICE=stability/" .env.local ;;
            2) sed -i.bak "s/AI_DEFAULT_SERVICE=.*/AI_DEFAULT_SERVICE=openai/" .env.local ;;
            3) sed -i.bak "s/AI_DEFAULT_SERVICE=.*/AI_DEFAULT_SERVICE=replicate/" .env.local ;;
        esac
        
        echo "✅ 多服务配置完成！"
        ;;
    4)
        echo "⏭️ 跳过配置"
        ;;
    *)
        echo "❌ 无效选择"
        ;;
esac

echo ""
echo "🚀 配置完成！现在可以重启开发服务器："
echo "npm run dev"
echo ""
echo "📋 测试API:"
echo "curl http://localhost:3000/api/generate/image"
echo ""
echo "🎨 测试图像生成:"
echo "curl -X POST http://localhost:3000/api/generate/image \\"
echo "  -F \"prompt=anime figure, 3d model, high quality\" \\"
echo "  -F \"service=stability\""



