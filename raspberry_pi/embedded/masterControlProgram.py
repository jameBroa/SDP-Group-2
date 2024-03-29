import serial
import time
import RPi.GPIO as GPIO
from motion import Motion
from motion import VideoWriter
from grove.grove_touch_sensor import GroveTouchSensor

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
		s.solenoid_speed = 100
		s.dc_motor = 1
		s.dc_motor_speed = 30
		s.servo = 5
		
		s.pressed = False
		s.pin = 16
		s.touch = GroveTouchSensor(s.pin)
		
		# GPIO.setmode(GPIO.BCM)
		# s.overshoot_pin = 17
		# s.hole_pin = 27
		# GPIO.setup(s.overshoot_pin, GPIO.IN)
		# GPIO.setup(s.hole_pin, GPIO.IN)
		
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
		board.servoWrite("""+str(s.servo)+""",0)\r
		utime.sleep(1.5)\r
		board.servoWrite("""+str(s.servo)+""", 80)\r"""
		s.ser.write(spinn.encode())
		
	def wait_sensor(s):
		while not s.pressed:
			#continue
			time.sleep(0.001)
		print(" PRESSED ")
		return
			  
		
		#while True:
			#input_val = GPIO.input(s.overshoot_pin)
			#if input_val == 1:
				#print(input_val)
				#return
		#time.sleep(0.005)
	
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
	def mainloop(s):
		video_counter = 0
		while True:
			try:
				s.reset_pico()
				print('cam start')
				# Record until motion detected, presumably from ball
				try:
					s.camera.start(f'/home/pi/Desktop/loop-{video_counter}.avi') #need to adjust file name per loop
				except Exception as ex:
					print(ex)
				print('cam end')
				s.wait_sensor()
				s.spin()
				time.sleep(4)
				s.lift_up()
				time.sleep(1)
				s.push()
				s.lift_down()
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

#lift = Lift(solenoid_speed=190,dc_motor_speed=30)
#lift.mainloop()
#lift.flush()
#lift.close()
