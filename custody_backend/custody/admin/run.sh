#!/bin/bash
# local build custodypy env
# docker build -t custodypy -f custody/Dockerfile.build .

git pull --rebase
# local build custody_admin
docker build -t custody_admin -f custody/admin/Dockerfile .

# local run custody_admin
docker stop custody_admin
docker run --rm --name custody_admin -p 5002:5002 --net=host -d custody_admin
echo "deploy custody_admin ok"
