#!/bin/bash
if [ "$DEPLOYMENT_GROUP_NAME" == "Siliconfort-Prod-rest-api-v2-CD" ]
then
SECRET_ID="siliconfort-rest-api-v2-SM"
elif [ "$DEPLOYMENT_GROUP_NAME" == "Siliconfort-Prod-rest-api-v2-ae-CD" ]
then
SECRET_ID="Siliconfort-Prod-rest-api-v2-ae-SM"
elif [ "$DEPLOYMENT_GROUP_NAME" == "Siliconfort-Prod-rest-api-v2-CD" ]
then
SECRET_ID="Siliconfort-Prod-rest-api-v2-SM"
else
  echo "Unknown environment: $ENVIRONMENT"
  exit 1
fi

cd /home/ubuntu/app/rest-api && aws secretsmanager get-secret-value --secret-id $SECRET_ID --query SecretString --region eu-west-2 --output text | jq -r '. | to_entries | .[] | "\(.key)=\(.value)"' > .env

