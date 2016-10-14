#!/bin/sh

cd `dirname $0`/..

npm run build
sudo docker build --force-rm=true --no-cache=true -t realglobe-docker-virtual.jfrog.io/hec-jissho1:latest .
