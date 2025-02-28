#!/bin/bash

# Set bucket name and region as variables
export BUCKET_NAME="ardanlabsultimateservicewithgo"

# Create header
echo "all_objects,web_compatible_objects" > "./jobs/bucket_contents.csv"

# Get all objects sorted and web_compatible objects sorted
all_objects=$(aws s3api list-objects-v2 --bucket $BUCKET_NAME | jq -r '.Contents[].Key' | sort -V)
web_objects=$(aws s3api list-objects-v2 --bucket $BUCKET_NAME --prefix web_compatible_ | jq -r '.Contents[].Key' | sort -t_ -k3 -V)

# Find the longer list to determine row count
all_count=$(echo "$all_objects" | wc -l)
web_count=$(echo "$web_objects" | wc -l)
max_count=$((all_count > web_count ? all_count : web_count))

# Create CSV rows
for i in $(seq 1 $max_count); do
  all_obj=$(echo "$all_objects" | sed -n "${i}p")
  web_obj=$(echo "$web_objects" | sed -n "${i}p")
  echo "\"$all_obj\",\"$web_obj\"" >> "./jobs/bucket_contents.csv"
done

# This command is a pipeline that lists specific objects in an AWS S3 bucket and displays their details.
aws s3api list-objects-v2 --bucket $BUCKET_NAME --prefix web_compatible_ |
jq -r '.Contents[].Key' |
sort -t_ -k2 -V |
xargs -I{} aws s3 ls s3://$BUCKET_NAME/{}

# Save the comma-separated list to a file in the jobs directory
aws s3api list-objects-v2 --bucket $BUCKET_NAME --prefix web_compatible_ | \
jq -r '.Contents[].Key' | \
sort -t_ -k3 -V | \
tr '\n' ',' | sed 's/,$//' > "./jobs/web_compatible_files.txt"

echo "Files have been created in the jobs directory"

