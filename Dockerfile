#    node:lts-alpine on 04/16/2026
FROM node@sha256:d1b3b4da11eefd5941e7f0b9cf17783fc99d9c6fc34884a665f40a06dbdfc94f AS build

WORKDIR /app

RUN corepack enable
COPY package.json pnpm-*.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

ARG SERVICE_NAME=sfkit-react-dev
RUN cp config/${SERVICE_NAME}.json public/appConfig.json

RUN apk add --no-cache gettext jq && \
    export API_BASE_URL=$(jq -r .apiBaseUrl public/appConfig.json) && \
    export FIREBASE_AUTH_DOMAIN=$(jq -r .firebase.authDomain public/appConfig.json) && \
    envsubst '${API_BASE_URL} ${FIREBASE_AUTH_DOMAIN}' < nginx.conf > nginx.default.conf

RUN pnpm run lint
RUN pnpm run build

ARG APP_VERSION=latest
ARG BUILD_VERSION=latest

RUN echo "{\"appVersion\": \"$APP_VERSION\", \"buildVersion\": \"$BUILD_VERSION\"}" > dist/version

#    cgr.dev/chainguard/nginx:latest on 04/17/2026
FROM cgr.dev/chainguard/nginx@sha256:4f95b13f583eff562608d0822bb03acc15829a681b86fa8cd454c20067e06f3c

COPY --from=build /app/nginx.default.conf /etc/nginx/conf.d/
COPY --from=build /app/dist /usr/share/nginx/html/
