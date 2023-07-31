# /bin/bash

function readDir(){
    for file in `ls $1`; do
        if [ -d $1"/"$file ]; then
            readDir $1"/"$file
        else
            scp -r $1"/"$file root@101.200.240.217:/alidata/www/default/$1"/"$file
        fi
    done
}

    
# n # node 切到10.15
hexo generate
cd ./public
rm -rf ./.DS_Store
#readDir .
scp -r ./ root@101.200.240.217:/alidata/www/default

# n # node 切回来