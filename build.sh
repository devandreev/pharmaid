#!/bin/bash

yarn build

timestamp() {
  date +"%Y%m%d%H%M%S"
}

cp -r ./public/images ./public/dist/images
cp ./public/favicon.ico ./public/dist/favicon.ico

cd ./public/dist

grep -rli '/images/' * | xargs -i@ sed -i 's/\/images\//\.\/images\//g' @
grep -rli '.css"' * | xargs -i@ sed -i "s/\.css\"/\.css?v=$(timestamp)\"/g" @
grep -rli '.js"' * | xargs -i@ sed -i "s/\.js\"/\.js?v=$(timestamp)\"/g" @

cd assets/js

# Удаление переносов строк в шаблонных литералах
cat base.bundle.js | tr -d '\n' > temp.bundle.js
mv temp.bundle.js base.bundle.js

rm styles.bundle.js

cd ../../

# git init
# git add --all
# git commit -m "build"
# git branch -M dist
# git remote add origin git@github.com:username/repo.git
# git push -u origin dist --force
