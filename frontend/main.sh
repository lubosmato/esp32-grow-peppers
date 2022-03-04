#!/bin/sh

rm -rf ./dist/*
cp -r ./original-dist/. ./dist/
echo "frontend dist is copied into /app/dist/"
