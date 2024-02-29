FROM node:18

WORKDIR /usr/src/my-app

COPY package*.json ./

RUN yarn 

COPY . .

RUN git submodule update --remote --merge

RUN git submodule update

RUN yarn build

CMD ["yarn", "start"]