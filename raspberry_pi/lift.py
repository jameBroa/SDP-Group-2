from motors import Motors
from time import time, sleep

mc = Motors()

lift_motor = 0
lift_speed = 40
lift_runtime = 5

def liftUp():

	mc.move_motor(lift_motor, -50)

	start_time = time()

	while time()< start_time + 4:
		sleep(0.2)
		
	mc.stop_motors()

def liftDown():

	mc.move_motor(lift_motor, lift_speed)

	start_time = time()

	while time()< start_time + 4:
		sleep(0.2)
		
	mc.stop_motors()


def main():
	liftUp()
	sleep(1)
	liftDown()

	
	
main()
