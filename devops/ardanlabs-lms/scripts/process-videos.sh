#!/bin/bash

# Get the MediaConvert endpoint
ENDPOINT=$(aws mediaconvert describe-endpoints --query 'Endpoints[0].Url' --output text)

# List all MP4 files in the bucket
echo "Listing MP4 files in bucket..."
MP4_FILES=$(aws s3 ls s3://ardanlabsultimatego/ | grep ".mp4" | awk '{print $4}')

# Process each file
for FILE in $MP4_FILES; do
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
        --cli-input-json "file://mediaconvert-job-${FILE}.json" \
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
    
    # Clean up the job file
    # rm "mediaconvert-job-${FILE}.json"
done

echo "All conversion jobs submitted!" 