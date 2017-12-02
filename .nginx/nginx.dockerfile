FROM nginx

RUN rm -f /etc/nginx/conf.d/default.conf

ADD .nginx/default.conf /etc/nginx/conf.d/

CMD ["nginx", "-g", "daemon off;"]