# 1. Base image
FROM node:18

# 2. Set working directory
WORKDIR /app

# 3. Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# 4. Copy package files and install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --ignore-scripts

# 5. Copy your code
COPY . .

# 6. Build TypeScript
RUN pnpm build

# 7. Run the bot
CMD ["pnpm", "start"]