#!/bin/bash

# Get the MediaConvert endpoint
ENDPOINT=$(aws mediaconvert describe-endpoints --query 'Endpoints[0].Url' --output text)

# List all MP4 files in the bucket
echo "Listing MP4 files in bucket..."
MP4_FILES=$(aws s3 ls s3://ardanlabsultimatego/ | grep ".mp4" | awk '{print $4}')

# Create a base job template
cat > base-job-template.json << 'EOF'
{
  "Queue": "arn:aws:mediaconvert:us-east-1:658975415077:queues/Default",
  "UserMetadata": {},
  "Role": "arn:aws:iam::658975415077:role/MediaConvertRole",
  "Settings": {
    "OutputGroups": [
      {
        "Name": "File Group",
        "OutputGroupSettings": {
          "Type": "FILE_GROUP_SETTINGS",
          "FileGroupSettings": {
            "Destination": "INPUT_PATH_PLACEHOLDER"
          }
        },
        "Outputs": [
          {
            "Extension": "mp4",
            "VideoDescription": {
              "CodecSettings": {
                "Codec": "H_264",
                "H264Settings": {
                  "MaxBitrate": 5000000,
                  "RateControlMode": "QVBR",
                  "QvbrSettings": {
                    "QvbrQualityLevel": 7
                  },
                  "SceneChangeDetect": "TRANSITION_DETECTION",
                  "QualityTuningLevel": "SINGLE_PASS_HQ"
                }
              }
            },
            "AudioDescriptions": [
              {
                "CodecSettings": {
                  "Codec": "AAC",
                  "AacSettings": {
                    "Bitrate": 96000,
                    "CodingMode": "CODING_MODE_2_0",
                    "SampleRate": 48000
                  }
                }
              }
            ],
            "ContainerSettings": {
              "Container": "MP4"
            }
          }
        ]
      }
    ],
    "Inputs": [
      {
        "AudioSelectors": {
          "Audio Selector 1": {
            "DefaultSelection": "DEFAULT"
          }
        },
        "VideoSelector": {},
        "TimecodeSource": "ZEROBASED",
        "FileInput": "INPUT_PATH_PLACEHOLDER"
      }
    ]
  }
}
EOF

# Process each file
for FILE in $MP4_FILES; do
    # Skip if filename contains 'web_compatible'
    if [[ $FILE == *"web_compatible"* ]]; then
        echo "Skipping already converted file: $FILE"
        continue
    fi

    echo "Processing $FILE..."
    
    # Generate input and output paths
    INPUT_PATH="s3://ardanlabsultimatego/${FILE}"
    OUTPUT_NAME="web_compatible_${FILE%.*}"
    OUTPUT_PATH="s3://ardanlabsultimatego/${OUTPUT_NAME}"
    
    # Create a job file for this video
    cp base-job-template.json "temp-job-${FILE}.json"
    
    # Update the input and output paths
    sed -i.bak \
        -e "s|INPUT_PATH_PLACEHOLDER|${OUTPUT_PATH}|" \
        -e "s|\"FileInput\": \"INPUT_PATH_PLACEHOLDER\"|\"FileInput\": \"${INPUT_PATH}\"|" \
        "temp-job-${FILE}.json"
    
    # Submit the job
    echo "Submitting conversion job for $FILE..."
    aws mediaconvert create-job \
        --endpoint-url "${ENDPOINT}" \
        --region us-east-1 \
        --cli-input-json "file://temp-job-${FILE}.json"
    
    # Clean up temporary file
    rm "temp-job-${FILE}.json" "temp-job-${FILE}.json.bak"
    
    echo "Job submitted for $FILE"
    echo "------------------------"
    
    # Optional: Add a small delay between job submissions
    sleep 2
done

# Clean up the template
rm base-job-template.json

echo "All conversion jobs submitted!" 