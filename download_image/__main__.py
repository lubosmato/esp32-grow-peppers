from datetime import datetime
from fileinput import filename
from pathlib import Path
import sys
import requests


def main():
  if len(sys.argv) < 4:
    print("Usage: download_image.py email password output_folder")
    exit(-1)

  email, password, output_folder = sys.argv[1:]

  s = requests.session()
  res = s.post(
    "https://grow.lubosmatejcik.cz/api/v1/auth", 
    json={"email": email, "password": password},
    headers={"Content-Type": "application/json"}
  )

  if res.status_code != 200:
    print("Wrong credentials.", res.json())
    exit(-1)

  res = s.get("https://grow.lubosmatejcik.cz/api/v1/plants/camera")

  if res.status_code != 200:
    print("Could not get image.", res.json())

  image_data = res.content

  file_name = Path(output_folder) / f"{int(datetime.now().timestamp())}.jpg"
  file_name = file_name.resolve()

  with open(file_name, "wb") as f:
    f.write(image_data)

if __name__ == "__main__":
  main()
