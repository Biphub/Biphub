FROM nginx

ARG TEMPLATE

RUN rm -f /etc/nginx/conf.d/default.conf

ADD .nginx/$TEMPLATE /etc/nginx/conf.d/

CMD ["nginx", "-g", "daemon off;"]