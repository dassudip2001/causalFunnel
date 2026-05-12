FROM oven/bun:1.1

WORKDIR /app

COPY bun.lock package.json tsconfig.json ./
RUN bun install

COPY . .
COPY prisma ./prisma

RUN bunx prisma generate

CMD ["bun", "src/server.ts"]
