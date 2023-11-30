FROM node:lts-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
ARG APP_VERSION=latest
ARG BUILD_VERSION=latest
RUN echo '{"appVersion": "${APP_VERSION}", "buildVersion": "${BUILD_VERSION}"}' > public/version

RUN npm run lint
RUN npm run build

FROM us.gcr.io/broad-dsp-gcr-public/base/nginx:distroless

COPY --from=build /app/dist /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf