#!/bin/bash
docker login -e $DOCKER_EMAIL -u $DOCKER_USER -p $DOCKER_PASSWORD
docker push magnus108docker/graphqltest

ssh ubuntu@52.57.165.69 << EOF
docker pull magnus108docker/graphqltest:latest
docker stop graphqltest || true
docker rm graphqltest || true
docker rmi magnus108docker/graphqltest:current || true
docker tag magnus108docker/graphqltest:latest magnus108docker/graphqltest:current
docker run -d --restart always --name graphqltest -p 80:3000 magnus108docker/graphqltest:current
EOF
