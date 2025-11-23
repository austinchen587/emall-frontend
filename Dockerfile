# Dockerfile
FROM node:20-alpine

WORKDIR /app

# 复制 package 文件
COPY package*.json ./

# 安装依赖（使用最新稳定版npm）
RUN npm ci --silent

# 复制源代码
COPY . .

# 安装所有依赖（包括devDependencies）
RUN npm install

# 暴露Vite默认端口
EXPOSE 5173

# 开发时使用 npm run dev
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
