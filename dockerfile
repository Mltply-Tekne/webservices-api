FROM node

WORKDIR /home/app

RUN npm install -g nodemon

WORKDIR /home/

ENTRYPOINT [ "nodemon","--inspect=0.0.0.0","/home/app/src/main.js" ]