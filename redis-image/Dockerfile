#use an existing docker image as a base
FROM alpine:3.14
#donwload and install dependencies
RUN apk add --update redis
#tell the image what to do when it starts as a container
CMD ["redis-server"]
#specify a command to run on container start
