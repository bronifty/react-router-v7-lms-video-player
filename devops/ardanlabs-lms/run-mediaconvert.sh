#!/bin/bash

# Get the MediaConvert endpoint
echo "Getting MediaConvert endpoint..."
ENDPOINT=$(aws mediaconvert describe-endpoints --query 'Endpoints[0].Url' --output text)

echo "MediaConvert Endpoint: $ENDPOINT"

# Create the MediaConvert job
echo "Creating MediaConvert job..."
aws mediaconvert create-job \
  --endpoint-url "${ENDPOINT}" \
  --region us-east-1 \
  --cli-input-json file://mediaconvert-job.json

echo "Job submitted!" 