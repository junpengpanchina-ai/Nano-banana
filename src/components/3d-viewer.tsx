"use client";

import { useEffect, useRef } from 'react';

interface Viewer3DProps {
  modelUrl?: string;
  className?: string;
}

export function Viewer3D({ modelUrl, className = "" }: Viewer3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 简单的 3D 查看器占位符
    if (containerRef.current) {
      containerRef.current.innerHTML = `
        <div style="
          width: 100%;
          height: 400px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 18px;
          font-weight: 500;
        ">
          <div style="text-align: center;">
            <div style="font-size: 48px; margin-bottom: 16px;">🎨</div>
            <div>3D 模型查看器</div>
            <div style="font-size: 14px; margin-top: 8px; opacity: 0.8;">
              ${modelUrl ? '加载模型中...' : '暂无模型'}
            </div>
          </div>
        </div>
      `;
    }
  }, [modelUrl]);

  return (
    <div 
      ref={containerRef} 
      className={className}
    />
  );
}

// 导出 ModelViewer 作为别名
export const ModelViewer = Viewer3D;
