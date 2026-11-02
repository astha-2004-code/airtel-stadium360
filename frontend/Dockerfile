# ==============================================================================
# Airtel Stadium360 — Production Frontend Dockerfile
# Multi-stage optimized Vite + React + Tailwind + Nginx build
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Build Stage
# ------------------------------------------------------------------------------
FROM node:20-alpine AS build

WORKDIR /app

# Cache dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source code and build production bundle
COPY . .

ARG VITE_API_URL="/api/v1"
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ------------------------------------------------------------------------------
# Stage 2: Hardened Nginx Runtime Stage
# ------------------------------------------------------------------------------
FROM nginx:alpine AS production

# Remove default nginx boilerplate
RUN rm -rf /usr/share/nginx/html/* /etc/nginx/conf.d/default.conf

# Copy production bundle from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy optimized nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Automated Docker Container Healthcheck
HEALTHCHECK --interval=15s --timeout=5s --start-period=5s --retries=3 \
    CMD wget -q -O - http://localhost/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
