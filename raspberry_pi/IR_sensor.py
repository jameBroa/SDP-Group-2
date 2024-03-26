# import RPi.GPIO as GPIO
# from time import sleep

# GPIO.setmode(GPIO.BCM)
# pin = 17

# GPIO.setup(pin, GPIO.IN)
# counter = 0
# try:
# 	while True:
# 		input_val = GPIO.input(pin)
# 		if input_val == 1:
# 			print(f"{counter}: detected")
# 		sleep(0.005)
# 		counter += 1
# except KeyboardInterrupt:
# 	GPIO.cleanup()

from grove.grove_touch_sensor import GroveTouchSensor
import time

# connect to pin 5 (slot D5)
PIN = 16
touch = GroveTouchSensor(PIN)

def on_press(t):
	print('Pressed')
def on_release(t):
	print("Released.")

touch.on_press = on_press
touch.on_release = on_release

while True:
	time.sleep(1)
