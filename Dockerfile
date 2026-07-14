FROM node:20-alpine AS build

WORKDIR /app/Landing

ARG VITE_API_BASE_URL=/api/v1
ARG VITE_TENANT_SLUG=
ARG VITE_PROJECTS_CONTENT_SLUG=proyectos

ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_TENANT_SLUG=${VITE_TENANT_SLUG}
ENV VITE_PROJECTS_CONTENT_SLUG=${VITE_PROJECTS_CONTENT_SLUG}

# Landing/ ya no es un workspace de npm de la raiz (tiene su propio repo y
# lockfile independiente) -- instala sus dependencias de forma standalone en
# vez de depender del mecanismo de workspaces del monorepo.
COPY Landing/package.json Landing/package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY Landing ./
RUN npm run build

FROM nginxinc/nginx-unprivileged:1.27-alpine

COPY Landing/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/Landing/dist /usr/share/nginx/html

EXPOSE 8080
