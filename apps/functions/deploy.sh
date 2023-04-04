#!/bin/bash

# Referecne
# https://sworld-docs.netlify.app/blog/firebase-functions-deployment/

# Build
pnpm run build

# Go to root
cd ../..

# Generate _isolated_ packages files
npx pnpm-isolate-workspace functions

# Back to functions folder
cd apps/functions

# Copy build folder to _isolated_
cp -r build _isolated_

cd _isolated_

# Rename package.json files
mv ./package.json ./package-dev.json
mv ./package-prod.json ./package.json


# Replace "workspace:*" to relative file path
# Reference 
# https://blog.csdn.net/lgh1117/article/details/50094595
sed -i "" 's/"crawler\"\: \"workspace:\*\"/"crawler\"\: \"file\:workspaces\/packages\/crawler\"/g' package.json
sed -i "" 's/"database\"\: \"workspace:\*\"/"database\"\: \"file\:workspaces\/packages\/database\"/g' package.json
sed -i "" 's/"ticket-flow\"\: \"workspace:\*\"/"ticket-flow\"\: \"file\:workspaces\/packages\/ticket-flow\"/g' package.json

cd ..

# Replace "source" in firebase.json to point _isolated_ folder
sed -i "" 's/"source\"\: \".\/\"/"source\"\: \".\/_isolated_\"/g' firebase.json

firebase deploy --only functions

# Replace "source" in firebase.json back for using "serve" script
sed -i "" 's/"source\"\: \".\/_isolated_\"/"source\"\: \".\/\"/g' firebase.json
