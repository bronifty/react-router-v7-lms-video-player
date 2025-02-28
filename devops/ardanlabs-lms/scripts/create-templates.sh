#!/bin/bash

# Get the MediaConvert endpoint
# ENDPOINT=$(aws mediaconvert describe-endpoints --query 'Endpoints[0].Url' --output text)

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
    
    # Create job template for this file
    ./templates/create-job-template.sh "$FILE"
    
    # # Submit the job
    # echo "Submitting conversion job for $FILE..."
    # aws mediaconvert create-job \
    #     --endpoint-url "${ENDPOINT}" \
    #     --region us-east-1 \
    #     --cli-input-json "file://mediaconvert-job-${FILE}.json"
    
    # echo "Job submitted for $FILE"
    # echo "------------------------"
    
    # Optional: Add a small delay between job submissions
    # sleep 2
    
    # Clean up the job file
    # rm "mediaconvert-job-${FILE}.json"
done

echo "All templates created!" 