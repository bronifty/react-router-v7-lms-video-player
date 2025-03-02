import json

# Path to your file
file_path = "bucket_web_compatible_data.csv"

# CloudFront base URL
base_url = "https://d19zpo3rdr3qt7.cloudfront.net/"

videos = []

# Read the file
with open(file_path, 'r') as file:
    for line in file:
        line = line.strip()
        if line and line.endswith('.mp4'):
            video_name = line
            video_url = f"{base_url}{video_name}"
            
            videos.append({
                "name": video_name,
                "url": video_url
            })

# Create the JSON structure
video_data = {
    "videos": videos
}

# Write to a JSON file
with open('cloudfront_videos.json', 'w') as json_file:
    json.dump(video_data, json_file, indent=2)

print(f"JSON file created with {len(videos)} videos.") 