# STAGE 1: Build Angular
FROM node:22-alpine AS build-step
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration=production

# STAGE 2: Serve con Nginx
FROM nginx:stable-alpine
# Copia i file compilati (verifica il percorso dist/STCMS_app)
COPY --from=build-step /app/dist/STCMS_app /usr/share/nginx/html
# Configurazione per gestire il routing di Angular
RUN echo 'server { listen 80; location / { root /usr/share/nginx/html; index index.html; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf
EXPOSE 80
