# pip install paho-mqtt

import paho.mqtt.client as mqtt
import cv2
import numpy as np
import sys
from dateutil import parser

def on_connect(client, userdata, flags, rc):
  print("Connected! Listening for image data")
  client.subscribe("plantsCam/+/image/data")
  client.subscribe("plantsCam/+/image/datetime")

def on_message(client, userdata, msg):
  # print(msg.topic+" "+str(msg.payload))
  if "image/data" in msg.topic:
    data = np.frombuffer(msg.payload, np.uint8)
    img = cv2.imdecode(data, cv2.IMREAD_COLOR)
    cv2.imshow(msg.topic, img)
    cv2.waitKey(1)

  if "image/datetime" in msg.topic:
    image_date_time = parser.parse(msg.payload.decode("utf-8"))
    print("Got image", image_date_time)

def main():
  client = mqtt.Client()
  client.on_connect = on_connect
  client.on_message = on_message
  client.tls_set("../main/cert.pem")

  client.username_pw_set(sys.argv[1], sys.argv[2])
  client.connect("drawboard.lubosmatejcik.cz", 8883, 10)

  print("Waiting for connection. Press enter to stop...")
  client.loop_start()
  input()

if __name__ == "__main__":
  main()
