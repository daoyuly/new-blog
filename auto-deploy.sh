# /bin/bash
npm run build
cd ./public
rm -rf ./.DS_Store
scp -r ./* blog:/usr/share/nginx/html/

