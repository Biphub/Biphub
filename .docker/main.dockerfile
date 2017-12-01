FROM node:9.2
MAINTAINER Jason Shin <visualbbasic@gmail.com>

ENV CORE /home/node/app
RUN mkdir $CORE
RUN echo $CORE
WORKDIR $CORE

# Install baseline cache
COPY ./.docker/package.json $CORE
RUN yarn

# Install packages
COPY ./package.json $CORE
RUN yarn

CMD ["yarn", "start"]