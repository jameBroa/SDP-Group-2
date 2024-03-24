import RPi.GPIO as GPIO
from time import sleep

GPIO.setmode(GPIO.BCM)
pin = 17

GPIO.setup(pin, GPIO.IN)

try:
	while True:
		input_val = GPIO.input(pin)
		print(f"binary value: {input_val}")
		sleep(0.05)
except KeyboardInterrupt:
	GPIO.cleanup()
