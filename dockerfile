# Building stage
FROM node:18 as builder

# Set Work Directory
WORKDIR /opt/smp-bot/

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build TypeScript code
RUN npm run build


# Final stage
FROM node:18-slim

# Set Working Directory
WORKDIR /opt/smp-bot/

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

# Copy built JavaScript code
COPY --from=builder /opt/smp-bot/dist ./dist
COPY --from=builder /opt/smp-bot/src ./src

# Set NODE_ENV
ENV NODE_ENV production

# Specify the command to run the bot
CMD [ "node", "dist/index.js" ]
