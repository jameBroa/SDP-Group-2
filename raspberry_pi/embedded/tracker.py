import cv2 as cv
import math
import asyncio
import globals

class OutputProps:
    def __init__(self, width, height, fps):
        self.width = width
        self.height = height
        self.fps = fps
        self.text = ""



class Tracker:
    # For Raspberry pi, XVID works, not mp4v. If need to convert, will do so.
    def __init__(self, output_path="/home/pi/Desktop/new.avi", encoding="XVID"):
        print(cv.__version__)
        self.output_path = output_path
        print('getting here')
        self.video=cv.VideoCapture(0)
        #for x in range(13,100):
                #self.video = cv.VideoCapture(x)
        
        if not self.video.isOpened():
                print("Cannot open camera")

        print('or getting here')
        # Output video settings
        output_props = OutputProps(int(self.video.get(cv.CAP_PROP_FRAME_WIDTH)) // 2, 
                                   int(self.video.get(cv.CAP_PROP_FRAME_HEIGHT)) // 2,
                                   int(self.video.get(cv.CAP_PROP_FPS))
                                   )
        # self.width = int(self.video.get(cv.CAP_PROP_FRAME_WIDTH)) // 2
        # self.height = int(self.video.get(cv.CAP_PROP_FRAME_HEIGHT)) // 2
        # self.fps = int(self.video.get(cv.CAP_PROP_FPS))
        # self.video.set(cv.CAP_PROP_BUFFERSIZE, 1)
        # self.text = ""


        # self.out = cv.VideoWriter(self.output_path, self.fourcc, 10, (self.width, self.height))
        # Encoding info
        self.fourcc = cv.VideoWriter_fourcc(*encoding)
        self.out = cv.VideoWriter(self.output_path, self.fourcc, 10, (int(self.video.get(3)), int(self.video.get(4))))

        # Reading input initialization
        self.ok, self.frame = self.video.read()
        self.tracker = cv.TrackerCSRT_create()
        self.initial_bbox = (420,450,150,150) #Bounding box where the ball will be (needs to be adjusted to frame)
        self.curr_bbox = self.initial_bbox
        self.ok = self.tracker.init(self.frame, self.curr_bbox)
        # self.frame_count = 0 # Used to find initial center of ball and distance threshold compared to this

        # Tracking variables
        self.distance_thresh = 100
        p1 = (int(self.curr_bbox[0]), int(self.curr_bbox[1]))
        p2 = (int(self.curr_bbox[0] + self.curr_bbox[2]), int(self.curr_bbox[1] + self.curr_bbox[3]))
        center = ((p1[0] + p2[0]) // 2, (p1[1] + p2[1]) // 2)
        self.initial_center = center
        self.done = False
        self.in_frame = True

    def calculate_swing_angle(self, center):
        angle_radians = math.atan2(center[1] - self.initial_center[1], center[0] - self.initial_center[0])
        swing_angle = 0
        if(self.curr_bbox[0] < (int(self.video.get(3))//2)): #the value should be half of the width of the video frame
            swing_direction = "right"
            swing_angle = 180 - math.degrees(angle_radians)
        else:
            swing_direction="left"
            swing_angle = math.degrees(angle_radians) % 180
        self.text = f"swing angle: {swing_angle:.2f} to the {swing_direction}"
        self.done = True

    def check_in_frame(self, p1, p2):
        # Logic for checking if ball is in frame or not
        if p1[0] < 0 or p1[1] < 0 or p2[0] > self.frame.shape[1] or p2[1] > self.frame.shape[0]:
            return False
        return True     

    def start_tracking(self):
        print("Started tracking")
        counter = 0

        while True:
            counter += 1
            self.ok, self.frame = self.video.read()

            if not self.ok:
                break

            self.ok, self.curr_bbox = self.tracker.update(self.frame)

            if self.ok:
                p1 = (int(self.curr_bbox[0]), int(self.curr_bbox[1]))
                p2 = (int(self.curr_bbox[0] + self.curr_bbox[2]), int(self.curr_bbox[1] + self.curr_bbox[3]))
                cv.rectangle(self.frame, p1, p2, (255, 0, 0), 2, 1)
                center = ((p1[0] + p2[0]) // 2, (p1[1] + p2[1]) // 2)

                in_frame = self.check_in_frame(p1, p2)

                if not in_frame:
                    self.video.release()
                    self.out.release()
                    return 1

            
                distance = math.sqrt((center[0] - self.initial_center[0]) ** 2 + (center[1] - self.initial_center[1]) ** 2)
                if(distance > self.distance_thresh):
                    self.calculate_swing_angle(center)
                    
            self.out.write(self.frame)

            if(self.done == True):
                cv.putText(self.frame, self.text, (20,50), cv.FONT_HERSHEY_SIMPLEX, 1, (255,0,0), 2, cv.LINE_AA)
        
        self.video.release()
        self.out.release()
        cv.destroyAllWindows() 


    # Function used to test the asynchronous nature of the control loop.
    # Expected output: A video which is 30 frames long
    def temp_loop(self):
        counter = 0
        while True:
            self.ok, self.frame = self.video.read()

            if not self.ok:
                break

            self.ok, self.curr_bbox = self.tracker.update(self.frame)
            self.out.write(self.frame)

            print(f'loop count: {counter}')
            counter += 1

            if counter == 30:  
                break
        print('stopped looping')
        self.video.release()
        self.out.release()

#tracker = Tracker()
#tracker.start_tracking()
