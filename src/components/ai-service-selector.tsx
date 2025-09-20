"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Zap, DollarSign, Clock } from "lucide-react";

interface AIService {
  id: string;
  name: string;
  description: string;
  price: string;
  speed: "fast" | "medium" | "slow";
  quality: "high" | "medium" | "low";
  features: string[];
  recommended?: boolean;
}

const aiServices: AIService[] = [
  {
    id: "grsai",
    name: "Grsai API",
    description: "你的专属AI图像生成服务，基于DALL-E 3模型",
    price: "按使用量计费",
    speed: "fast",
    quality: "high",
    features: ["DALL-E 3", "高质量输出", "专属服务", "稳定可靠"],
    recommended: true,
  },
  {
    id: "stability",
    name: "Stability AI",
    description: "开源友好的高质量图像生成，支持SDXL模型",
    price: "$0.004-0.02/张",
    speed: "fast",
    quality: "high",
    features: ["SDXL支持", "ControlNet", "批量生成", "API稳定"],
  },
  {
    id: "openai",
    name: "OpenAI DALL-E 3",
    description: "理解能力最强的图像生成模型",
    price: "$0.04-0.08/张",
    speed: "medium",
    quality: "high",
    features: ["最强理解", "高质量输出", "安全过滤", "企业级"],
  },
  {
    id: "replicate",
    name: "Replicate",
    description: "托管各种开源AI模型，按使用付费",
    price: "$0.002-0.05/次",
    speed: "fast",
    quality: "high",
    features: ["模型丰富", "按需付费", "开源友好", "灵活配置"],
  },
];

export function AIServiceSelector({ 
  selectedService, 
  onServiceChange 
}: { 
  selectedService: string;
  onServiceChange: (service: string) => void;
}) {
  const getSpeedIcon = (speed: string) => {
    switch (speed) {
      case "fast": return <Zap className="h-4 w-4 text-green-500" />;
      case "medium": return <Clock className="h-4 w-4 text-yellow-500" />;
      case "slow": return <Clock className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getQualityBadge = (quality: string) => {
    switch (quality) {
      case "high": return <Badge variant="default" className="bg-green-500">高质量</Badge>;
      case "medium": return <Badge variant="secondary">中等质量</Badge>;
      case "low": return <Badge variant="outline">基础质量</Badge>;
      default: return <Badge variant="outline">未知</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">选择AI服务</h3>
        <p className="text-sm text-muted-foreground">
          不同的AI服务有不同的特点，请根据你的需求选择
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {aiServices.map((service) => (
          <Card 
            key={service.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedService === service.id 
                ? "ring-2 ring-primary border-primary" 
                : "hover:border-primary/50"
            }`}
            onClick={() => onServiceChange(service.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{service.name}</CardTitle>
                {service.recommended && (
                  <Badge variant="default" className="bg-blue-500">
                    推荐
                  </Badge>
                )}
              </div>
              <CardDescription className="text-sm">
                {service.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  {service.price}
                </span>
                <span className="flex items-center gap-1">
                  {getSpeedIcon(service.speed)}
                  {service.speed === "fast" ? "快速" : service.speed === "medium" ? "中等" : "较慢"}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                {getQualityBadge(service.quality)}
              </div>
              
              <div className="space-y-1">
                {service.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    {feature}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
