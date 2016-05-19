#! /bin/sh -e

docker stop mp3 || true
docker rm mp3 || true

docker run \
       --restart always \
       -d \
       --name mp3 \
       -v "$PWD":/opt/app \
       -w /opt/app \
       -e "AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID" \
       -e "AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY" \
       -p 3000:3000 \
       node:6.2.0 \
       node server.js
