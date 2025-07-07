import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Docker 빌드를 위한 standalone 모드 활성화
  output: 'standalone',
  
  // 이미지 최적화 설정
  images: {
    unoptimized: true, // Docker 환경에서 이미지 최적화 비활성화
  },
  
  // 실험적 기능들
  experimental: {
    // 필요한 실험적 기능들을 여기에 추가
  },
};

export default nextConfig;
