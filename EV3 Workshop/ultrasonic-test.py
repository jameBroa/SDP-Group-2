import ev3dev.ev3 as ev3 
us = ev3.UltrasonicSensor('in1') 
us.mode = 'US-DIST-CM' 
print(us.value(), "mm") 
