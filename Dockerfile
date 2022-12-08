# Phase 1
FROM node:16-alpine AS builder

WORKDIR /app
COPY package.json .
COPY tsconfig.json .
COPY yarn.lock .
COPY .env .
RUN yarn install
COPY . .
RUN yarn build

# Phase 2
# FROM node:16-alpine
# WORKDIR /app
# COPY package.json .
# COPY tsconfig.json .
# COPY yarn.lock .
# COPY .env .
# RUN yarn install --production
# COPY --from=builder /app/dist /dist
RUN yarn global add pm2
EXPOSE 8080
# CMD ["yarn", "dev"]
CMD ["pm2-runtime", "dist/index.js"]
# RUN pm2-runtime index.js