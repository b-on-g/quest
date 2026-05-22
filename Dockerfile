FROM node:20-alpine AS build
WORKDIR /app
RUN git clone --depth 1 https://github.com/hyoo-ru/mam.git . \
    && npm install
COPY . bog/quest/
RUN npx mam bog/quest

FROM nginx:alpine
COPY --from=build /app/bog/quest/- /usr/share/nginx/html
EXPOSE 80
