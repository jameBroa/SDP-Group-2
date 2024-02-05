from motors import Motors 
from time import time, sleep # Create an instance of the Motors class used in SDP 
mc = Motors() 
spin_motor = 1 # The port that your motor is plugged in to 
spin_speed = 30 # forward = positive, backwards = negative 
spin_run = 0.5 # number of seconds to run motors # Move motor with the given ID at your set speed
# 31 - 0.1
mc2 = Motors()
push_motor = 0 # The port that your motor is plugged in to 
push_speed = 50 # forward = positive, backwards = negative 
push_run = 0.4 # number of seconds to run motors # Move motor with the given ID at your set speed
pushback_run = 0.7

mc2.move_motor(spin_motor,spin_speed) 
start_time = time() # Encoder board can be fragile - always use a try/except loop 

while time() < start_time + spin_run:
    # mc.print_encoder_data()
    sleep(0.2) # Use a sleep of at least 0.1, to avoid errors 

mc2.stop_motor(spin_motor) 

mc.move_motor(push_motor,push_speed) 
start_time = time() # Encoder board can be fragile - always use a try/except loop 

while time() < start_time + push_run:
    # mc.print_encoder_data()
    sleep(0.2) # Use a sleep of at least 0.1, to avoid errors 


mc.move_motor(spin_motor, -spin_speed) 
start_time = time() # Encoder board can be fragile - always use a try/except loop 

while time() < start_time + spin_run:
    # mc.print_encoder_data()
    sleep(0.2) # Use a sleep of at least 0.1, to avoid errors 

mc.stop_motor(spin_motor) 

mc2.move_motor(push_motor, -push_speed) 


start_time = time() # Encoder board can be fragile - always use a try/except loop 

while time() < start_time + pushback_run:
    # mc.print_encoder_data()
    sleep(0.2) # Use a sleep of at least 0.1, to avoid errors 


mc2.stop_motors() 
