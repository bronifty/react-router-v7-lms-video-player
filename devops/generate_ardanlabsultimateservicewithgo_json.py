import json

# Path to your file
file_path = "./ardanlabs-lms/scripts/jobs/web_compatible_files.txt"

# CloudFront base URL
base_url = "https://d2ymxxyl3f82zy.cloudfront.net/"

videos = []

# Read the file
with open(file_path, 'r') as file:
    content = file.read().strip()
    # Split by commas since the file contains comma-separated values
    video_names = content.split(',')
    
    for video_name in video_names:
        video_name = video_name.strip()
        if video_name and video_name.endswith('.mp4'):
            video_url = f"{base_url}{video_name}"
            
            # Extract the video number (e.g., "1.1" from "web_compatible_1.1.mp4")
            parts = video_name.split('_')
            if len(parts) >= 3:
                video_number = parts[2].replace('.mp4', '')
                video_title = f"Video {video_number}"
            else:
                video_title = video_name
            
            videos.append({
                "name": video_title,
                "file": video_name,
                "url": video_url
            })

# Sort videos by their number
videos.sort(key=lambda x: [int(n) if n.isdigit() else n for n in x["name"].replace("Video ", "").split('.')])

# Create the JSON structure
video_data = {
    "videos": videos
}

# Write to a JSON file
with open('./ardanlabsultimateservicewithgo_videos.json', 'w') as json_file:
    json.dump(video_data, json_file, indent=2)

print(f"JSON file created with {len(videos)} videos.") 