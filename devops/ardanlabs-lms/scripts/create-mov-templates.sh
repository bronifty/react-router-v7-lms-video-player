#!/bin/bash

# Set bucket name as a variable
export BUCKET_NAME="ardanlabsultimateservicewithgo"

# List all MOV files in the bucket
echo "Listing MOV files in bucket..."
MOV_FILES=$(aws s3 ls s3://$BUCKET_NAME/ | grep -i ".mov" | awk '{print $4}')

# Process each file
for FILE in $MOV_FILES; do
    # Skip if filename contains 'web_compatible'
    if [[ $FILE == *"web_compatible"* ]]; then
        echo "Skipping already converted file: $FILE"
        continue
    fi

    echo "Processing $FILE..."
    
    # Create job template for this file
    ./templates/create-mov-template.sh "$FILE"
    
    echo "------------------------"
done

echo "All templates created!" 