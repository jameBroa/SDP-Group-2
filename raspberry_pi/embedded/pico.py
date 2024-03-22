import serial
import time


try:
	ser = serial.Serial('/dev/ttyACM0', 115200, timeout=1)
	print('before sleep')
	time.sleep(2)

	ser.write(b'\x04')
	time.sleep(1)
	ser.write(b'import machine\r\n')
	ser.write(b'led = machine.Pin(25, machine.Pin.OUT)\r\n')
	ser.write(b'led.value(1)\r\n')
	time.sleep(1)
	ser.write(b'led.value(0)\r\n')
	print('executed code')
	ser.close()
	
except Exception as error:
	print(f'error:{error}\n')
	


