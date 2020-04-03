#!/bin/bash
ssh -T root@petermarshall.dev <<EOI

docker login -u "${DOCKER_USERNAME}" -p "${DOCKER_PASSWORD}"
docker pull ${DOCKER_USERNAME}/notes-api:latest
docker run -p 3000:3000 -env MONGO_URI=${MONGO_URI} ${DOCKER_USERNAME}/notes-api:latest

exit 
EOI