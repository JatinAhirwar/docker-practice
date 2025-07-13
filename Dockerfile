FROM node:20-alpine3.19

WORKDIR /home/app

# Copy package files and install runtime dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy only compiled code and config
COPY dist/ ./dist/

# Run the app (assumes dist/tg.js is your main file)
CMD ["node", "dist/telegramBot.js"]
