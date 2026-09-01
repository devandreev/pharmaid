#!/bin/bash

yarn build

timestamp() {
  date +"%Y%m%d%H%M%S"
}

cp -r ./public/images ./public/dist/images
#cp -r ./public/videos ./public/dist/videos
cp -r ./public/images_avif ./public/dist/images_avif
#cp ./public/site.webmanifest ./public/dist/site.webmanifest
#cp ./public/favicon.ico ./public/dist/favicon.ico
#cp ./public/favicon.svg ./public/dist/favicon.svg
#cp ./public/favicon-96x96.png ./public/dist/favicon-96x96.png
#cp ./public/apple-touch-icon.png ./public/dist/apple-touch-icon.png
#cp ./public/web-app-manifest-192x192.png ./public/dist/web-app-manifest-192x192.png
#cp ./public/web-app-manifest-512x512.png ./public/dist/web-app-manifest-512x512.png

cd ./public/dist

#grep -rli '/images/' * | xargs -I@ sed -i '' 's/\/images\//\.\/images\//g' @
#grep -rli '/videos/' * | xargs -I@ sed -i '' 's/\/videos\//\.\/videos\//g' @
#grep -rli '/images_avif/' * | xargs -I@ sed -i '' 's/\/images_avif\//\.\/images_avif\//g' @
grep -rli '.css"' * | xargs -I@ sed -i '' "s/\.css\"/\.css?v=${timestamp}\"/g" @
grep -rli '.js"' * | xargs -I@ sed -i '' "s/\.js\"/\.js?v=${timestamp}\"/g" @

 git init
 git add --all
 git commit -m "build"
 git branch -M dist
 git remote add origin git@github.com:devandreev/pharmaid.git
 git push -u origin dist --force
