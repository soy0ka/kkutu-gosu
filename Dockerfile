# 멀티 스테이지 빌드를 사용하여 최적화된 이미지 생성
FROM node:20-alpine AS base

# pnpm 설치
RUN npm install -g pnpm

# 의존성 설치 스테이지
FROM base AS deps
WORKDIR /app

# 의존성 파일들 복사
COPY package.json pnpm-lock.yaml ./

# 의존성 설치 (production + dev dependencies)
RUN pnpm install --frozen-lockfile

# 빌드 스테이지
FROM base AS builder
WORKDIR /app

# 의존성 복사
COPY --from=deps /app/node_modules ./node_modules
# 소스 코드 복사
COPY . .

# Next.js 빌드
RUN pnpm build

# 프로덕션 스테이지
FROM base AS runner
WORKDIR /app

# 프로덕션 환경 설정
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# nextjs 사용자 생성 (보안)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 필요한 파일들만 복사
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Next.js 빌드 파일 복사
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# nextjs 사용자로 전환
USER nextjs

# 포트 설정
EXPOSE 3000
ENV PORT=3000

# 헬스체크 설정
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js || exit 1

# 애플리케이션 시작
CMD ["node", "server.js"]
