#!/bin/bash
#cd /home/ubuntu/app/rest-api && aws secretsmanager get-secret-value --secret-id siliconfort-rest-api-v2-SM --query SecretString --output text | jq -r '. | to_entries | .[] | "\(.key)=\(.value)"' > .env
cd /home/ubuntu/app/rest-api && npm install
cd /home/ubuntu/app/rest-api && export NODE_OPTIONS=--max_old_space_size=4096 && npm run  build
cd /home/ubuntu/app/rest-api && sudo chown ubuntu:ubuntu -R *
cd /home/ubuntu/app/rest-api && sudo chown ubuntu:ubuntu -R .*

echo "Build has been created sucessfully"
