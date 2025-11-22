#Stage 0: Base image
FROM node:18-slim AS base
WORKDIR /app
COPY package*.json package-lock.json ./
EXPOSE 3000

#Stage 1: Development Application
FROM base AS development
WORKDIR /app
ENV NODE_ENV=development
ENV CHOKIDAR_USEPOLLING=true
RUN npm install -g nodemon && npm install
COPY . .
CMD ["nodemon", "start"]
# CMD ["nodemon", "bin/www"]
# CMD ["npm", "start"]

#Stage 2: Production Application
FROM node:18-slim AS production
WORKDIR /app
ENV NODE_ENV=production
COPY . .
COPY --from=development /app/node_modules ./node_modules
RUN npm prune --production

CMD ["npm", "start"]