#!/bin/bash
docker login -e $DOCKER_EMAIL -u $DOCKER_USER -p $DOCKER_PASSWORD
docker push magnus108docker/graphqltest:$CIRCLE_SHA1

ssh deploy@52.57.165.69 << EOF
docker pull magnus108docker/graphqltest:latest
#docker stop web || true
#docker rm web || true
#docker rmi willrstern/sample-node:current || true
#docker tag willrstern/sample-node:latest willrstern/sample-node:current

docker run -d --net app --restart always --name graphqltest -p 3000:3000 magnus108docker/graphqltest:latest

EOF
