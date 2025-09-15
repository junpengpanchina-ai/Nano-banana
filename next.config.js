/** @type {import('next').NextConfig} */
const nextConfig = {
  // 修复客户端引用清单问题
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  // 禁用严格模式以避免开发时的双重渲染
  reactStrictMode: false,
  // 确保正确的类型检查
  typescript: {
    ignoreBuildErrors: false,
  },
  // 确保正确的ESLint配置
  eslint: {
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig
