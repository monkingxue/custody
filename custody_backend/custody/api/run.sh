#!/bin/bash
# local build custodypy env
# docker build -t custodypy -f custody/Dockerfile.build .

git pull --rebase
# local build custody_backend
docker build -t custody_backend -f custody/api/Dockerfile .

# local run custody_backend
docker stop custody_backend
docker run --rm --name custody_backend -p 5001:5001 --net=host -d custody_backend
echo "deploy custody_backend ok"