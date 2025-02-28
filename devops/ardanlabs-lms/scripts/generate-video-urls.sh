#!/bin/bash

# Base URL for the S3 bucket
BASE_URL="https://d19zpo3rdr3qt7.cloudfront.net"

# Start JSON object
echo "{" > video-urls.json

# Process versions and create JSON entries
sort -t. -k1,1n -k2,2n << 'EOF' | uniq | while read version; do
    if [ ! -z "$version" ]; then
        # Remove any trailing whitespace
        version=$(echo "$version" | tr -d '[:space:]')
        
        # Create the filename
        filename="web_compatible_${version}.mp4"
        
        # Create the full URL
        url="${BASE_URL}/${filename}"
        
        # Add to JSON (with comma for all but last entry)
        echo "  \"${filename}\": \"${url}\"," >> video-urls.json
    fi
done << 'EOF'
1.1
1.2
1.3
1.4
1.5
2.1
2.2
2.4
3.1
3.4
4.3
4.4
5.1
5.4
5.5
6
6.1
6.2
6.3
6.4
6.5
6.6
7
7.1
7.2
8
8.1
8.2
8.3
9
9.1
10
10.1
10.2
10.3
10.4
10.5
10.6
EOF

# Remove the trailing comma from the last entry and close the JSON object
sed -i.bak '$ s/,$//' video-urls.json
echo "}" >> video-urls.json 