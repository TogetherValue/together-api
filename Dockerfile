FROM node:18

WORKDIR /usr/src/my-app

COPY package*.json ./

RUN yarn 

COPY . .

RUN yarn build

RUN git submodule update --remote --merge

RUN git submodule update

CMD ["yarn", "start"]