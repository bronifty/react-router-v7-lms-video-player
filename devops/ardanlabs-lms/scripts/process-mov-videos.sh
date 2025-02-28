#!/bin/bash

# Set bucket name as a variable
export BUCKET_NAME="ardanlabsultimateservicewithgo"

# Get the MediaConvert endpoint
ENDPOINT=$(aws mediaconvert describe-endpoints --query 'Endpoints[0].Url' --output text)

# List all MOV files in the bucket
echo "Listing MOV files in bucket..."
MOV_FILES=$(aws s3 ls s3://${BUCKET_NAME}/ | grep -i ".mov" | awk '{print $4}')

# Process each file
for FILE in $MOV_FILES; do
    # Skip if filename contains 'web_compatible'
    if [[ $FILE == *"web_compatible"* ]]; then
        echo "Skipping already converted file: $FILE"
        continue
    fi

    echo "Processing $FILE..."
    
    # Submit the job and capture the job ID
    JOB_RESPONSE=$(aws mediaconvert create-job \
        --endpoint-url "${ENDPOINT}" \
        --region us-east-1 \
        --cli-input-json "file://jobs/mediaconvert-job-${FILE}.json" \
        --output json 2>/dev/null)
    
    # Extract and display the job ID
    JOB_ID=$(echo $JOB_RESPONSE | jq -r '.Job.Id' 2>/dev/null)
    if [ ! -z "$JOB_ID" ]; then
        echo "Job submitted for $FILE - Job ID: $JOB_ID"
    else
        echo "Failed to submit job for $FILE"
    fi
    echo "------------------------"
    
    # Optional: Add a small delay between job submissions
    sleep 2
done

echo "All conversion jobs submitted!" 