# Build stage
FROM public.ecr.aws/docker/library/node:18-alpine as builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /usr/src/app

# Install curl
RUN apk add --no-cache curl

# copy package.json and install dependencies
COPY package*.json ./
RUN npm install --production
COPY --from=builder /usr/src/app/dist ./dist

# Expose port 80
EXPOSE 80
CMD [ "node", "dist/app.js" ]
