FROM node:latest as builder

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

ENV DOLLAR=$

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*


COPY --from=builder /app/build .

COPY nginx.conf.template /etc/nginx/templates/default.conf.template

ENTRYPOINT envsubst < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g "daemon off;"