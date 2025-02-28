#!/bin/bash

# Set bucket name and region as variables
export BUCKET_NAME="ardanlabsultimateservicewithgo"
export AWS_REGION="us-east-1"  # Replace with your actual bucket region

# Check if filename argument is provided
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <filename>"
    echo "Example: $0 video.mov"
    exit 1
fi

# Ensure the jobs directory exists
SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"
PARENT_DIR="$(dirname "$SCRIPT_DIR")"
JOBS_DIR="${PARENT_DIR}/jobs"
mkdir -p "$JOBS_DIR"

FILE=$1
INPUT_PATH="s3://${BUCKET_NAME}/${FILE}"
OUTPUT_NAME="web_compatible_${FILE%.*}"
OUTPUT_PATH="s3://${BUCKET_NAME}/${OUTPUT_NAME}"

# Create job template for the specific file
cat > "${JOBS_DIR}/mediaconvert-job-${FILE}.json" << EOF
{
  "Queue": "arn:aws:mediaconvert:${AWS_REGION}:658975415077:queues/Default",
  "UserMetadata": {},
  "Role": "arn:aws:iam::658975415077:role/MediaConvertRole",
  "Settings": {
    "OutputGroups": [
      {
        "Name": "File Group",
        "OutputGroupSettings": {
          "Type": "FILE_GROUP_SETTINGS",
          "FileGroupSettings": {
            "Destination": "${OUTPUT_PATH}"
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
        "FileInput": "${INPUT_PATH}"
      }
    ]
  }
}
EOF

echo "Created job template for ${FILE} at ${JOBS_DIR}/mediaconvert-job-${FILE}.json"

# Also update the AWS CLI configuration to use the specified region
echo "Configuring AWS CLI to use region: ${AWS_REGION}"
aws configure set default.region ${AWS_REGION} 