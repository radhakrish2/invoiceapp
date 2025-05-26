# Stage 1: Build Angular app
FROM node:18 AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --prod

# Stage 2: Serve with NGINX
FROM nginx:alpine
COPY --from=builder /app/dist/car-app /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]