# using nginx as base image
FROM nginx:alpine

# installing esssentials
RUN apk add python3 py3-pip nodejs-current npm

# set up work dir
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# setup and install backend stuff
RUN mkdir ./backend
COPY ./backend/requirements.txt ./backend/
RUN cd ./backend/ && pip install --ignore-installed -r requirements.txt
COPY ./backend ./backend/

# setup, install, and build frontend stuff
RUN mkdir ./frontend
COPY ./frontend/package*.json ./frontend/
RUN cd ./frontend && npm i
COPY ./frontend ./frontend/
RUN cd ./frontend && npm run build

# need nginx conf
COPY ./nginx.conf /etc/nginx/nginx.conf

# pass in what port to use (specified at runtime as an ENV, preferred for Heroku)
ARG PORT

# start up frontend, backend, and nginx server at the same time
# also replace the listening port in the nginx config to specified port at runtime
CMD (cd frontend && npm run start-prod) & (cd ./backend && ./server.sh) & (sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/nginx.conf && nginx -g 'daemon off;')