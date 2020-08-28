# Build
FROM node:12

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .
RUN yarn

COPY . .
RUN yarn build

# Run
FROM node:12-alpine

RUN apk add --no-cache chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV CHROMIUM_PATH /usr/bin/chromium-browser

WORKDIR /usr/src/app

COPY --from=0 /usr/src/app .

EXPOSE 80

CMD ["yarn", "start:prod"]