import serial
import time
import RPi.GPIO as GPIO
from motion import Motion
from motion import VideoWriter

code = """from PicoRobotics import KitronikPicoRobotics\n
import utime
board=KitronikPicoRobotics()
directions=['f','r'] 
dc_motor=1
solenoid=4
motor_speed=30
solenoid_speed=200

def lift_down(dc_motor, motor_speed):
	board.motorOn(dc_motor, 'f', motor_speed*1.2)
	utime.sleep(0.3)
	board.motorOff(dc_motor)
	utime.sleep(1)
	
def lift_up(dc_motor, motor_speed):
	board.motorOn(dc_motor, ''r'', motor_speed)
	utime.sleep(0.5)
	board.motorOff(dc_motor)
	utime.sleep(0.5)
	
def push(solenoid, solenoid_speed):
	board.motorOn(solenoid, 'r', solenoid_speed)
	utime.sleep(0.5)
	board.motorOff(solenoid)
	
def spin():
	board.servoWrite(1, 100)
	utime.sleep(1)
	board.servoWrite(1, 180)

def main():
	lift_down(dc_motor, motor_speed)
	while True:
		lift_up(dc_motor, motor_speed)
		push(solenoid,solenoid_speed)
		lift_down(dc_motor, motor_speed)
main()
"""

code1 = """from PicoRobotics import KitronikPicoRobotics\r
from mainRunner import lift_down, lift_up, push, spin, main\r
import utime\r

lift_down(dc_motor, motor_speed)\r
lift_up(dc_motor, motor_speed)\r
push(solenoid,solenoid_speed)\r
lift_down(dc_motor, motor_speed)\r	

push(4, 200)\r
"""


class Lift():
	def __init__(s, solenoid_speed, dc_motor_speed):
		s.setup = """from PicoRobotics import KitronikPicoRobotics\r
		from mainRunner import lift_down, lift_up, push, spin, main\r
		import utime\r
		board=KitronikPicoRobotics()\r"""
		s.solenoid = 4
		s.solenoid_speed = 200
		s.dc_motor = 1
		s.dc_motor_speed = 30
		
		GPIO.setmode(GPIO.BCM)
		s.overshoot_pin = 17
		s.hole_pin = 27
		GPIO.setup(s.overshoot_pin, GPIO.IN)
		GPIO.setup(s.hole_pin, GPIO.IN)
		
		s.ser = serial.Serial('/dev/ttyACM0', 115200, timeout=1)
		s.ser.write(b'\x04')
		s.ser.write(s.setup.encode())
		
		s.camera = Motion(motion_frame_count_thresh=6)
		
	def reset_pico(s):
		s.ser.close()
		s.ser = serial.Serial('/dev/ttyACM0', 115200, timeout=1)
		s.ser.write(b'\x04')
		s.ser.write(s.setup.encode())

	def lift_down(s):
		liftdown = "lift_down("+str(s.dc_motor)+", "+str(s.dc_motor_speed)+")\r"
		s.ser.write(liftdown.encode())
	
	def lift_up(s):
		liftup = """
		board.motorOn("""+str(s.dc_motor)+""", ''r'', """+str(s.dc_motor_speed)+""")\r
		utime.sleep(0.5)\r
		board.motorOff("""+str(s.dc_motor)+""")\r
		utime.sleep(0.5)\r
		"""
		liftup ="""
		board.motorOn(1, 'r', 30)\r
		utime.sleep(0.5)\r
		board.motorOff(1)\r
		utime.sleep(0.5)\r"""
		liftup = "lift_up("+str(s.dc_motor)+", "+str(s.dc_motor_speed)+")\r"
		s.ser.write(liftup.encode())
		
	def push(s):
		push = "push("+str(s.solenoid)+", "+str(s.solenoid_speed)+")\r"
		s.ser.write(push.encode())
		
	def spin(s):
		spinn = """
		board.servoWrite(1,0)\r
		utime.sleep(0.5)\r
		board.servoWrite(1, 80)\r"""
		s.ser.write(spinn.encode())
		
	def wait_ir_trigger(s):
		while True:
			input_val = GPIO.input(s.overshoot_pin)
			if input_val == 1:
				print(input_val)
				return
		#time.sleep(0.005)
	
	# from top position
	def up_mainloop(s):
		s.lift_down()
		s.lift_up()
		s.push()
		s.lift_down()
		time.sleep(1)
	# from bottom position
	def mainloop(s):
		while True:
			try:
				s.reset_pico()
				# Record until motion detected, presumably from ball
				s.camera.start()
				s.wait_ir_trigger()
				s.spin()
				s.lift_up()
				s.push()
				s.lift_down()
				time.sleep(1)

			except KeyboardInterrupt:
				s.flush()
				break
				
	def close(s):
		s.ser.close()
		#GPIO.cleanup()
	
	def flush(s):
		flush = """"""
		s.ser.write(b'\x04')

lift = Lift(solenoid_speed=200,dc_motor_speed=30)
lift.mainloop()
