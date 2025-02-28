#!/bin/bash

# Create the IAM role
echo "Creating IAM role..."
ROLE_ARN=$(aws iam create-role \
  --role-name MediaConvertRole \
  --assume-role-policy-document file://mediaconvert-trust-policy.json \
  --query 'Role.Arn' \
  --output text)

echo "Role ARN: $ROLE_ARN"

# Wait a few seconds for role creation to propagate
sleep 5

# Create the policy
echo "Creating IAM policy..."
POLICY_ARN=$(aws iam create-policy \
  --policy-name MediaConvertPolicy \
  --policy-document file://mediaconvert-policy.json \
  --query 'Policy.Arn' \
  --output text)

echo "Policy ARN: $POLICY_ARN"

# Wait a few seconds for policy creation to propagate
sleep 5

# Attach the policy to the role
echo "Attaching policy to role..."
aws iam attach-role-policy \
  --role-name MediaConvertRole \
  --policy-arn "$POLICY_ARN"

# Get the MediaConvert endpoint
echo "Getting MediaConvert endpoint..."
ENDPOINT=$(aws mediaconvert describe-endpoints --query 'Endpoints[0].Url' --output text)

echo "MediaConvert Endpoint: $ENDPOINT"

# Update the job settings with the role ARN
echo "Updating job settings..."
sed -i.bak "s|ROLE_ARN_HERE|$ROLE_ARN|" mediaconvert-job.json

# Create the MediaConvert job
echo "Creating MediaConvert job..."
aws mediaconvert create-job \
  --endpoint-url "${ENDPOINT}" \
  --region us-east-1 \
  --cli-input-json file://mediaconvert-job.json 