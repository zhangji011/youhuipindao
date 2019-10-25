#!/bin/sh
rm -rf release &&
npm run build index &&
# scp -r release/** root@47.96.181.38:/www/html/h5/
scp -r release/** root@113.108.79.80:/www/html/prod/