# Step 1: Build Angular app
FROM node:18 AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --prod

# Step 2: Serve with NGINX
FROM nginx:alpine
COPY --from=builder /app/dist/car-app /usr/share/nginx/html

# 🔁 IMPORTANT FIX: Ensure NGINX listens on Cloud Run's expected port (8080)
EXPOSE 8080

# Replace default NGINX config with one that listens on port 8080
COPY nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]