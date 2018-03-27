FROM node:9.2
MAINTAINER Jason Shin <visualbbasic@gmail.com>
ARG SRC

ENV CORE /home/node/app
RUN mkdir $CORE
RUN echo $CORE
WORKDIR $CORE

# Install baseline cache
COPY $SRC/package.json $SRC/yarn.lock /tmp/
RUN cd /tmp && yarn
RUN cp -a /tmp/node_modules $CORE

WORKDIR $CORE

CMD ["yarn", "start"]