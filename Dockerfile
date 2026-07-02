FROM node:20-alpine AS build

WORKDIR /app

ARG VITE_API_BASE_URL=/api/v1
ARG VITE_TENANT_SLUG=
ARG VITE_PROJECTS_CONTENT_SLUG=proyectos

ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_TENANT_SLUG=${VITE_TENANT_SLUG}
ENV VITE_PROJECTS_CONTENT_SLUG=${VITE_PROJECTS_CONTENT_SLUG}

COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/package.json
COPY apps/admin/package.json ./apps/admin/package.json
COPY apps/workspace/package.json ./apps/workspace/package.json
COPY apps/pay/package.json ./apps/pay/package.json
COPY Landing/package.json ./Landing/package.json
COPY packages/contracts/package.json ./packages/contracts/package.json
COPY packages/auth-session/package.json ./packages/auth-session/package.json
RUN npm ci --workspace=tricode-studio-landing --include-workspace-root=false --no-audit --no-fund

WORKDIR /app/Landing
COPY Landing ./
RUN npm run build

FROM nginxinc/nginx-unprivileged:1.27-alpine

COPY Landing/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/Landing/dist /usr/share/nginx/html

EXPOSE 8080
