# Dockerfile

# 1. Base image
FROM node:18-alpine

# Install git
RUN apk add --no-cache git

# 2. Set working directory
WORKDIR /app

# 3. Copy package files
COPY .git .git
COPY package*.json ./

# 4. Install deps
RUN npm install

# 5. Copy rest of app
COPY . .

# 6. Build app
RUN npm run build

# 7. Expose and start
EXPOSE 3000
CMD ["npm", "start"]
