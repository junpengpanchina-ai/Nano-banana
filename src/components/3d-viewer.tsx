"use client";

import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Html, useProgress } from '@react-three/drei';
import { Mesh } from 'three';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  Download,
  Share2,
  Settings
} from 'lucide-react';

interface ModelViewerProps {
  modelUrl?: string;
  className?: string;
}

function LoadingSpinner() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-sm text-gray-600">加载中... {Math.round(progress)}%</p>
      </div>
    </Html>
  );
}

function Model({ modelUrl }: { modelUrl?: string }) {
  const meshRef = useRef<Mesh>(null);
  const [rotation, setRotation] = useState([0, 0, 0]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  // 如果没有模型URL，显示一个默认的几何体
  if (!modelUrl) {
    return (
      <mesh ref={meshRef}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#6366f1" />
      </mesh>
    );
  }

  // 这里应该加载实际的3D模型
  // 为了演示，我们显示一个默认几何体
  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#8b5cf6" />
    </mesh>
  );
}

function Controls({ onReset, onZoomIn, onZoomOut, onFullscreen }: {
  onReset: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFullscreen: () => void;
}) {
  return (
    <div className="absolute top-4 right-4 flex flex-col space-y-2 z-10">
      <Button size="sm" variant="secondary" onClick={onReset}>
        <RotateCcw className="w-4 h-4" />
      </Button>
      <Button size="sm" variant="secondary" onClick={onZoomIn}>
        <ZoomIn className="w-4 h-4" />
      </Button>
      <Button size="sm" variant="secondary" onClick={onZoomOut}>
        <ZoomOut className="w-4 h-4" />
      </Button>
      <Button size="sm" variant="secondary" onClick={onFullscreen}>
        <Maximize2 className="w-4 h-4" />
      </Button>
    </div>
  );
}

export function ModelViewer({ modelUrl, className = "" }: ModelViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lightIntensity, setLightIntensity] = useState([1]);
  const [cameraDistance, setCameraDistance] = useState([5]);

  const handleReset = () => {
    // 重置相机位置
    setCameraDistance([5]);
  };

  const handleZoomIn = () => {
    setCameraDistance(prev => [Math.max(1, prev[0] - 1)]);
  };

  const handleZoomOut = () => {
    setCameraDistance(prev => [Math.min(10, prev[0] + 1)]);
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleDownload = () => {
    // 实现模型下载功能
    console.log('下载模型');
  };

  const handleShare = () => {
    // 实现分享功能
    console.log('分享模型');
  };

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : ''} ${className}`}>
      <Card className={isFullscreen ? 'h-full' : 'h-96'}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">3D模型查看器</CardTitle>
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="outline" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-1" />
                下载
              </Button>
              <Button size="sm" variant="outline" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-1" />
                分享
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 h-full">
          <div className="relative h-full">
            <Canvas
              camera={{ position: [0, 0, cameraDistance[0]], fov: 50 }}
              className="w-full h-full"
            >
              <Suspense fallback={<LoadingSpinner />}>
                <ambientLight intensity={0.5} />
                <directionalLight 
                  position={[10, 10, 5]} 
                  intensity={lightIntensity[0]} 
                />
                <Model modelUrl={modelUrl} />
                <OrbitControls 
                  enablePan={true}
                  enableZoom={true}
                  enableRotate={true}
                  minDistance={1}
                  maxDistance={10}
                />
                <Environment preset="studio" />
              </Suspense>
            </Canvas>
            
            <Controls
              onReset={handleReset}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onFullscreen={handleFullscreen}
            />
          </div>
        </CardContent>
      </Card>

      {/* 控制面板 */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-sm flex items-center">
            <Settings className="w-4 h-4 mr-2" />
            模型设置
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">光照强度</label>
            <Slider
              value={lightIntensity}
              onValueChange={setLightIntensity}
              max={2}
              min={0}
              step={0.1}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">相机距离</label>
            <Slider
              value={cameraDistance}
              onValueChange={setCameraDistance}
              max={10}
              min={1}
              step={0.5}
              className="w-full"
            />
          </div>
          <div className="text-xs text-gray-500">
            <p>• 鼠标左键拖拽：旋转模型</p>
            <p>• 鼠标右键拖拽：平移视角</p>
            <p>• 滚轮：缩放模型</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
