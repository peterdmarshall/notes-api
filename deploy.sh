#!/bin/bash
ssh -T tunneluser@111.222.333.444 <<EOI

docker login -u "${DOCKER_USERNAME}" -p "${DOCKER_PASSWORD}"
docker pull ${DOCKER_USERNAME}/notes-api:latest
docker run -p 3000:3000 ${DOCKER_USERNAME}/notes-api:latest

exit 
EOI