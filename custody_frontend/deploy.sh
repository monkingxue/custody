#!/bin/bash
cd /data/repos/onebtc/onebtc_frontend
git pull --rebase
npm install && npm run build && npm run build:cdn
rm -rf /var/www/onebtc/dist
cp -r dist /var/www/onebtc/
echo "deploy ok"
