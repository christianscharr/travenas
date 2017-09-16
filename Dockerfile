FROM node:latest

# Create app directory
WORKDIR /usr/src/app

COPY . .

RUN cd /backend && npm install
RUN cd /frontend && npm install && npm run build --prod --env=prod --aot

EXPOSE 3000

CMD [ "npm", "run", "start" ]