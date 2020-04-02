#!/bin/bash

docker login -u "$DOCKER_USERNAME" -p "$DOCKER_PASSWORD"
docker pull $DOCKER_USERNAME/notes-api:latest
docker run -p 3000:3000 $DOCKER_USERNAME/notes-api:latest