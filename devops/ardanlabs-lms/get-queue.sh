#!/bin/bash

# Get the MediaConvert endpoint
ENDPOINT=$(aws mediaconvert describe-endpoints --query 'Endpoints[0].Url' --output text)

# List queues and get the default one
aws mediaconvert list-queues \
  --endpoint-url "${ENDPOINT}" \
  --region us-east-1 \
  --query 'Queues[?Name==`Default`].Arn' \
  --output text 