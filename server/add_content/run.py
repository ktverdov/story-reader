import sys 
sys.path.append('..')

from db import *
import json
import os

LOCAL_DATA_PATH = "./stories"

file_names = [f for f in os.listdir(LOCAL_DATA_PATH) if f.endswith('.json')]

for file_name in file_names:
    with open(os.path.join(LOCAL_DATA_PATH, file_name), "r") as f:
        data = json.load(f)

    with open(os.path.join(LOCAL_DATA_PATH, file_name[:-4] + "txt"), "r") as f:
        content = f.read()

    if not Story.objects(story_id=data["story_id"]):
        story = Story(story_id=data["story_id"], 
                        title=data["title"], 
                        author=data["author"],
                        content=content, 
                        reading_time_min=data["reading_time_min"], 
                        language=data["language"])
        story.save()

# story = Story.objects.get(story_id=2)
# print(story.content)
