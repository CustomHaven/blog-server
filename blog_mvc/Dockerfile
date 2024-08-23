FROM node:18
WORKDIR /app
COPY package*.json /app/
RUN npm install
ARG JWT_SECRET
ARG DB_USER
ARG DB_HOST
ARG DB_NAME
ARG DB_PASSWORD
ARG DB_PORT
ENV JWT_SECRET=${JWT_SECRET}
ENV DB_USER=${DB_USER}
ENV DB_HOST=${DB_HOST}
ENV DB_NAME=${DB_NAME}
ENV DB_PASSWORD=${DB_PASSWORD}
ENV DB_PORT=${DB_PORT}
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