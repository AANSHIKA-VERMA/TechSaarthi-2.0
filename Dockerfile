# Multi-stage build for local-dev parity / containerization demo.
#
# Note: this is NOT how the app deploys to production — Vercel builds and
# serves it directly, and /api/chat.js runs as a Vercel serverless function,
# not inside this container. This Dockerfile packages the static frontend
# only, so it's useful for local dev consistency and for showing containerization
# skills, but the chatbot endpoint won't work when running via `docker run`
# alone (see docker-compose.yml for a local API workaround note).

# ---- build stage ----
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Build-time env vars — pass real ones via --build-arg or a .env file for
# local testing. These are safe to bake in: the anon key is meant to be public.
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

RUN npm run build

# ---- serve stage ----
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Vite builds a single-page app — any unknown path should fall back to
# index.html so React Router's client-side routes (e.g. /dashboard/saved)
# work on a hard refresh, not just via in-app navigation.
RUN printf 'server {\n\
    listen 80;\n\
    root /usr/share/nginx/html;\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
