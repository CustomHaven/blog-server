FROM node:18
WORKDIR /app
COPY package*.json /app/
RUN npm install
ENV PORT=3000
ENV NODE_ENV=production
ENV CHECK_OUT_DOCKER_ENV=checkout_docker
COPY __tests__ /app/__test__
COPY assets /app/assets
COPY controllers /app/controllers
COPY routers /app/routers
COPY db/connect.js /app/db/
COPY models /app/models
COPY *.js /app/
COPY Dockerfile /app/
EXPOSE 3000
CMD ["npm", "start"]