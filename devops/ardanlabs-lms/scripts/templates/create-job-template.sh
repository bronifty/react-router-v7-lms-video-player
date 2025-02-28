#!/bin/bash

# Check if filename argument is provided
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <filename>"
    echo "Example: $0 1.2.mp4"
    exit 1
fi

FILE=$1
INPUT_PATH="s3://ardanlabsultimatego/${FILE}"
OUTPUT_NAME="web_compatible_${FILE%.*}"
OUTPUT_PATH="s3://ardanlabsultimatego/${OUTPUT_NAME}"

# Create job template for the specific file
cat > "../mediaconvert-job-${FILE}.json" << EOF
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

echo "Created job template for ${FILE} at ../mediaconvert-job-${FILE}.json" 