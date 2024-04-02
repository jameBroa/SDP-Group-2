import serial
import time
import RPi.GPIO as GPIO
from motion import Motion
from motion import VideoWriter
from grove.grove_touch_sensor import GroveTouchSensor
import globals

import RPi.GPIO as GPIO
from time import sleep

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
	def __init__(s, solenoid_speed, lift_down_speed, lift_up_speed):
		s.setup = """from PicoRobotics import KitronikPicoRobotics\r
		from mainRunner import lift_down, lift_up, push, spin, main\r
		import utime\r
		board=KitronikPicoRobotics()\r"""
		s.solenoid = 4
		s.solenoid_speed = solenoid_speed
		s.dc_motor = 1
		s.lift_down_speed = lift_down_speed
		s.lift_up_speed = lift_up_speed
		s.servo = 2
		
		s.ir_sensor_pin = 6
		
		s.pressed = False
		s.pin = 5
		s.touch = GroveTouchSensor(s.pin)
		
		# GPIO.setmode(GPIO.BCM)
		# s.overshoot_pin = 17
		# s.hole_pin = 27
		# GPIO.setup(s.overshoot_pin, GPIO.IN)
		# GPIO.setup(s.hole_pin, GPIO.IN)
		GPIO.setup(s.ir_sensor_pin, GPIO.IN) # D5 grove hat port and pin 6 for BCM
		
		s.ser = serial.Serial('/dev/ttyACM0', 115200, timeout=1)
		s.ser.write(b'\x04')
		s.ser.write(s.setup.encode())
		
		s.camera = Motion(motion_frame_count_thresh=6)	
		
		def on_press(t):
			s.pressed = True
		
		def on_release(t):
			s.pressed = False
			
		s.touch.on_press = on_press
		s.touch.on_release = on_release
		
	def write_setup(s):
		s.ser = serial.Serial('/dev/ttyACM0', 115200, timeout=1)
		s.ser.write(s.setup.encode())
		
	def lift_down(s):
		liftdown = "lift_down("+str(s.dc_motor)+", "+str(s.lift_down_speed)+")\r"
		s.ser.write(liftdown.encode())
	
	def lift_up(s):
		liftup = "lift_up("+str(s.dc_motor)+", "+str(s.lift_up_speed)+")\r"
		s.ser.write(liftup.encode())
		
	def push(s):
		push = "push("+str(s.solenoid)+", "+str(s.solenoid_speed)+")\r"
		s.ser.write(push.encode())
		
	def spin(s):
		spinn = """
		board.servoWrite("""+str(s.servo)+""",0)\r
		utime.sleep(1.5)\r
		board.servoWrite("""+str(s.servo)+""", 80)\r"""
		s.ser.write(spinn.encode())
		
	def wait_sensor(s):
		while not s.pressed:
			time.sleep(0.001)
			
			if globals.release_ball:
				break
		print("\n -- PRESSED ")
	
	def ir_sensor(s):
		while GPIO.input(s.ir_sensor_pin) == 1:
			time.sleep(0.001)
		print("\n -- PRESSED ")
		#try:	# Sensor detect == 0 no object detection == 1
			#while True:
				#print(GPIO.input(s.ir_sensor_pin))
				#sleep(0.1)
		#except KeyboardInterrupt:
			#GPIO.cleanup()
	
	# from top position
	def up_mainloop(s):
		s.lift_down()
		s.lift_up()
		s.push()
		s.lift_down()
		time.sleep(1)
		
	def release_ball(s):
		s.spin()
		time.sleep(4)
		s.lift_up()
		time.sleep(1)
		s.push()
		s.lift_down()
		time.sleep(1)
		
	# from bottom position
	def mainloop_with_camera(s):
		video_counter = 0
		while True:
			try:
				s.write_setup()
				print('cam start')
				# Record until motion detected, presumably from ball
				try:
					#continue
					s.camera.start(s.video_path) #need to adjust file name per loop
				except Exception as ex:
					print(ex)
				print('cam end')
				s.wait_sensor()
				s.spin()
				time.sleep(3)
				s.lift_up()
				time.sleep(2)
				s.push()
				time.sleep(1)
				s.lift_down()
				s.flush()
				time.sleep(1)

			except KeyboardInterrupt:
				s.flush()
				break
			
			video_counter += 1
			
			
	# from bottom position
	def mainloop(s):
		video_counter = 0
		while True:
			try:
				s.write_setup()
				s.wait_sensor()
				s.spin()
				time.sleep(3)
				s.lift_up()
				time.sleep(2)
				s.push()
				time.sleep(1)
				s.lift_down()
				s.flush()
				time.sleep(1)

			except KeyboardInterrupt:
				s.flush()
				break
			video_counter += 1
				
	def close(s):
		s.ser.close()
		#GPIO.cleanup()
	
	def flush(s):
		flush = """"""
		s.ser.write(b'\x04')
		

lift = Lift(solenoid_speed=80,lift_down_speed=15,lift_up_speed=30)
lift.mainloop()
lift.close()
