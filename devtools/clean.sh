#!/bin/bash

# Useful for resetting your local environment

docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)
docker volume rm -f $(docker volume ls -q)
rm -rf vendor
rm -rf node_modules
