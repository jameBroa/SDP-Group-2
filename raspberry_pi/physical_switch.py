import time
from grove.grove_touch_sensor import GroveTouchSensor

# connect to pin 5 (slot D5)
PIN = 5
touch = GroveTouchSensor(PIN)


def on_press(t):
	print('Pressed')
def on_release(t):
	print("Released.")

touch.on_press = on_press
touch.on_release = on_release

while True:
	time.sleep(1)
