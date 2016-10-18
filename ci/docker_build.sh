#!/bin/sh

cd `dirname $0`/..

repo=hec-jissho1

npm run build
docker build --force-rm=true --no-cache=true -t realglobe-docker-virtual.jfrog.io/${repo}:latest .
