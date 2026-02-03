FROM node:25-bookworm

WORKDIR /app

# Install build tools for native dependencies (better-sqlite3)
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    ca-certificates \
    curl \
  && rm -rf /var/lib/apt/lists/*

# Install IPFS CLI (kubo)
ARG IPFS_VERSION=0.28.0
RUN set -eux; \
  ARCH="$(uname -m)"; \
  case "$ARCH" in \
    x86_64) ARCH="amd64" ;; \
    aarch64|arm64) ARCH="arm64" ;; \
    *) echo "Unsupported arch: $ARCH"; exit 1 ;; \
  esac; \
  curl -L "https://dist.ipfs.tech/kubo/v${IPFS_VERSION}/kubo_v${IPFS_VERSION}_linux-${ARCH}.tar.gz" -o /tmp/kubo.tgz; \
  tar -xzf /tmp/kubo.tgz -C /tmp; \
  /tmp/kubo/install.sh; \
  rm -rf /tmp/kubo /tmp/kubo.tgz

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

ENV NODE_ENV=production
ENV PORT=3001
ENV DATABASE_PATH=/app/data/media.db

EXPOSE 3001

CMD ["node", "dist/index.js"]
