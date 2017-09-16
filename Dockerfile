FROM node:latest

# Create app directory
WORKDIR /usr/src/app

COPY . .

RUN cd /usr/src/app/backend && npm install
RUN cd /usr/src/app/frontend && npm install && npm run build --prod --env=prod --aot

EXPOSE 3000

CMD [ "node", "/usr/src/app/backend/bin/www" ]