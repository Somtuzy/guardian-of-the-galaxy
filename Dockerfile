# 1. Base image
FROM node:18

# 2. Set working directory
WORKDIR /app

# 3. Copy package files and install dependencies
COPY package*.json ./
RUN pnpm install

# 4. Copy your code
COPY . .

# 5. Build TypeScript
RUN pnpm build

# 6. Run the bot
CMD ["pnpm", "start"]