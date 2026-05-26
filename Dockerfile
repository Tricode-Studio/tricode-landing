FROM node:20-alpine AS build

WORKDIR /app

ARG VITE_API_BASE_URL=/api/v1
ARG VITE_TENANT_SLUG=
ARG VITE_PROJECTS_CONTENT_SLUG=proyectos

ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_TENANT_SLUG=${VITE_TENANT_SLUG}
ENV VITE_PROJECTS_CONTENT_SLUG=${VITE_PROJECTS_CONTENT_SLUG}

COPY Landing/package.json ./
COPY Landing/package-lock.json ./
RUN npm install --no-audit --no-fund

COPY Landing ./
RUN npm run build

FROM nginxinc/nginx-unprivileged:1.27-alpine

COPY Landing/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080
