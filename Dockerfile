FROM node:lts-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run lint
RUN npm run build

ARG APP_VERSION=latest
ARG BUILD_VERSION=latest

RUN echo "{\"appVersion\": \"$APP_VERSION\", \"buildVersion\": \"$BUILD_VERSION\"}" > dist/version
RUN mv nginx.conf nginx.default.conf && touch default.conf

FROM us.gcr.io/broad-dsp-gcr-public/base/nginx:distroless

COPY --from=build /app/*.conf /etc/nginx/conf.d/
COPY --from=build /app/dist /usr/share/nginx/html/