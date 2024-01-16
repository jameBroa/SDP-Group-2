import ev3dev.ev3 as ev3 

m = ev3.LargeMotor('outA') 
if not m.connected: 
    print("Plug a motor into port A") 
else: m.run_timed(speed_sp=1000, time_sp=3000)