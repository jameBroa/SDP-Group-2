from motors import Motors
from time import time,sleep

mc = Motors()


motor_id = 0
speed= 30
run_time = 8

mc.move_motor(motor_id,speed)
start_time = time()
while time() < start_time + run_time:
    #mc.print_encoder_data()
    sleep(0.2)


mc.move_motor(motor_id,-speed)
start_time = time()
while time() < start_time + run_time:
    #mc.print_encoder_data()
    sleep(0.2)

mc.stop_motors()
