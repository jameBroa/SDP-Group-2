import RPi.GPIO as GPIO
from time import sleep


GPIO.setmode(GPIO.BCM) # GPIO.BCM GPIO.BOARD
pin = 17 # D5 grove hat port and pin 6 for BCM
GPIO.setup(pin, GPIO.IN)
try:	# Sensor detect == 0 no object detection == 1
	while True:
		print(GPIO.input(pin))
		sleep(0.1)
except KeyboardInterrupt:
	GPIO.cleanup()
