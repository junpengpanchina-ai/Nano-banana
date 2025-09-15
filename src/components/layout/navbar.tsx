"use client";

import { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/components/i18n/i18n-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Menu, X } from "lucide-react";
import { LanguageSwitcher } from "@/components/layout/language-switcher";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useI18n();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-yellow-400 rounded flex items-center justify-center">
              <span className="text-black font-bold text-lg">B</span>
            </div>
            <span className="text-xl font-bold text-gray-900">{t("brand.name")}</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-1">
                  <span>{t("nav.freeTools")}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>AI图像生成</DropdownMenuItem>
                <DropdownMenuItem>3D模型转换</DropdownMenuItem>
                <DropdownMenuItem>风格迁移</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-1">
                  <span>{t("nav.lora")}</span>
                  <Badge variant="secondary" className="ml-1 text-xs">Lora</Badge>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>动漫风格</DropdownMenuItem>
                <DropdownMenuItem>写实风格</DropdownMenuItem>
                <DropdownMenuItem>卡通风格</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/create">
              <Button variant="ghost">{t("nav.create")}</Button>
            </Link>
            <Link href="/prompts">
              <Button variant="ghost">{t("nav.prompts")}</Button>
            </Link>
            {/* 隐藏：定价 */}
            {/* 隐藏：我的作品 / API */}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher />
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-2">
              <Link href="/create" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                创建
              </Link>
              <Link href="/prompts" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                提示词
              </Link>
              <Link href="/pricing" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                定价
              </Link>
              {/* 隐藏：我的作品 / API */}
              <div className="pt-2 border-t" />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
