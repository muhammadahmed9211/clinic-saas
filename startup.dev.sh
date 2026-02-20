#!/usr/bin/env bash
set -e

/opt/wait-for-it.sh mssql-db:1433
npm run migration:run
npm run seed:run
npm run start:prod
