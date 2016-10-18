#!/bin/sh

cd `dirname $0`/..

repo=hec-jissho1

docker push realglobe-docker-virtual.jfrog.io/${repo}:latest
