import serial
import time


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
	board.servoWrite(1,180)
	utime.sleep(1)
	board.servoWrite(1,100)

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
	def __init__(s):
		setup = """from PicoRobotics import KitronikPicoRobotics\r
		from mainRunner import lift_down, lift_up, push, spin, main\r
		import utime\r"""
		s.solenoid = 4
		s.solenoid_speed = 200
		s.dc_motor = 1
		s.dc_motor_speed = 30
		s.ser = serial.Serial('/dev/ttyACM0', 115200, timeout=1)
		s.ser.write(b'\x04')
		s.ser.write(setup.encode())

	def lift_down(s):
		liftdown = "lift_down("+str(s.dc_motor)+", "+str(s.dc_motor_speed)+")\r"
		s.ser.write(liftdown.encode())
	
	def lift_up(s):
		liftup = "lift_up("+str(s.dc_motor)+", "+str(s.dc_motor_speed)+")\r"
		s.ser.write(liftup.encode())
		
	def push(s):
		push = "push("+str(s.solenoid)+", "+str(s.solenoid_speed)+")\r"
		s.ser.write(push.encode())
		
	def spin(s):
		spin = """board.servoWrite(1,180)\r
		utime.sleep(1)\r
		board.servoWrite(1,100)\r"""
		
		s.ser.write(spin.encode())
	
	def up_mainloop(s):
		s.lift_down()
		s.lift_up()
		s.push()
		s.lift_down()
	
	def mainloop(s):
		s.lift_up()
		s.push()
		s.lift_down()
		
	def close(s):
		s.ser.close()


lift = Lift()
lift.spin()
