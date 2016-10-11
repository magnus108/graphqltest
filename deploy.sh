#!/bin/bash
#docker login -e $DOCKER_EMAIL -u $DOCKER_USER -p $DOCKER_PASS
#docker push willrstern/sample-node

#ssh deploy@52.57.165.69 << EOF
#docker pull willrstern/sample-node:latest
#docker stop web || true
#docker rm web || true
#docker rmi willrstern/sample-node:current || true
#docker tag willrstern/sample-node:latest willrstern/sample-node:current
#docker run -d --net app --restart always --name web -p 3000:3000 willrstern/sample-node:current
#EOF
