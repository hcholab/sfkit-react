#    node:lts-alpine on 04/16/2026
FROM node@sha256:d1b3b4da11eefd5941e7f0b9cf17783fc99d9c6fc34884a665f40a06dbdfc94f AS build

WORKDIR /app

RUN corepack enable
COPY package.json pnpm-*.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

ARG SERVICE_NAME="sfkit-react-dev"
ENV APP_CONFIG="public/appConfig.json"
RUN cp config/${SERVICE_NAME}.json ${APP_CONFIG}

RUN apk add --no-cache gettext jq && \
    export API_BASE_URL=$(jq -r .apiBaseUrl ${APP_CONFIG}) && \
    export FIREBASE_AUTH_DOMAIN=$(jq -r .firebase.authDomain ${APP_CONFIG}n) && \
    export FIREBASE_AUTH_UPSTREAM=$(jq -r '.firebase.projectId + ".firebaseapp.com"' ${APP_CONFIG}) && \
    envsubst '${API_BASE_URL} ${FIREBASE_AUTH_DOMAIN} ${FIREBASE_AUTH_UPSTREAM}' < nginx.conf > nginx.default.conf

RUN pnpm run lint
RUN pnpm run build

ARG APP_VERSION=latest
ARG BUILD_VERSION=latest

RUN echo "{\"appVersion\": \"$APP_VERSION\", \"buildVersion\": \"$BUILD_VERSION\"}" > dist/version

#    cgr.dev/chainguard/nginx:latest on 08/14/2026
FROM cgr.dev/chainguard/nginx@sha256:d826cd7cff4e5a8f9477e685696cbddb47c33df1b8dc22c7d581e16ff70e44aa

COPY --from=build /app/nginx.default.conf /etc/nginx/conf.d/
COPY --from=build /app/dist /usr/share/nginx/html/
