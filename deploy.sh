# /bin/bash

function readDir(){
    for file in `ls $1`; do
        if [ -d $1"/"$file ]; then
            readDir $1"/"$file
        else
            scp -r $1"/"$file root@8.147.135.17:/usr/share/nginx/html/$1"/"$file
        fi
    done
}

    
# n # node 切到10.15
# nvm use v10.15.3
npm run build
cd ./public
rm -rf ./.DS_Store
#readDir .
scp -r ./* root@8.147.135.17:/usr/share/nginx/html/

# n # node 切回来