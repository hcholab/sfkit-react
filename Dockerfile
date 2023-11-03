FROM node:lts-alpine AS build

WORKDIR /app

COPY package*.json .
RUN npm ci

COPY . .

RUN npm run lint
RUN npm run build


# FROM us.gcr.io/broad-dsp-gcr-public/base/nginx:distroless
FROM cgr.dev/chainguard/nginx

COPY --from=build /app/dist /usr/share/nginx/html/

