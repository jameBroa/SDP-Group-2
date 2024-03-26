import RPi.GPIO as GPIO
from time import sleep

GPIO.setmode(GPIO.BCM)
pin = 17

GPIO.setup(pin, GPIO.IN)
counter = 0
try:
	while True:
		input_val = GPIO.input(pin)
		if input_val == 1:
			print(f"{counter}: detected")
		sleep(0.005)
		counter += 1
except KeyboardInterrupt:
	GPIO.cleanup()
