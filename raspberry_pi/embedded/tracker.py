import cv2 as cv
import math

class Tracker:
    # For Raspberry pi, XVID works, not mp4v. If need to convert, will do so.
    def __init__(self, output_path="/home/pi/Desktop/new.avi", encoding="XVID"):
        print(cv.__version__)
        self.output_path = output_path
        print('getting here')
        self.video=cv.VideoCapture(1)
        #for x in range(13,100):
                #self.video = cv.VideoCapture(x)
        
        if not self.video.isOpened():
                print("Cannot open camera")

        
        print('or getting here')
        # Output video settings
        self.width = int(self.video.get(cv.CAP_PROP_FRAME_WIDTH)) // 2
        self.height = int(self.video.get(cv.CAP_PROP_FRAME_HEIGHT)) // 2
        self.fps = int(self.video.get(cv.CAP_PROP_FPS))
        self.video.set(cv.CAP_PROP_BUFFERSIZE, 1)
        self.text = ""

        # Encoding info
        self.fourcc = cv.VideoWriter_fourcc(*encoding)
        self.out = cv.VideoWriter(self.output_path, self.fourcc, 10, (self.width, self.height))

        # Reading input initialization
        self.ok, self.frame = self.video.read()
        self.tracker = cv.TrackerCSRT_create()
        self.initial_bbox = (420,450,150,150) #Bounding box where the ball will be (needs to be adjusted to frame)
        self.curr_bbox = self.initial_bbox
        self.ok = self.tracker.init(self.frame, self.curr_bbox)
        self.frame_count = 0 # Used to find initial center of ball and distance threshold compared to this

        # Tracking variables
        self.distance_thresh = 100
        self.initial_center = None
        self.done = False
        self.in_frame = True

    def start_tracking(self):
        print("Started tracking")
        while True:
            self.ok, self.frame = self.video.read()

            if not self.ok:
                break

            key = cv.waitKey(30) & 0xff #Awaits input for 30ms, currently used to simulate environment

            if key == ord('p'):  # Press 'p' to reset the bounding box
                self.curr_bbox = self.initial_bbox
                self.ok = self.tracker.init(self.frame, self.curr_bbox)
                self.done = False
                self.frame_count = 0
                self.initial_center = None
        
            if key == ord('q'): #simulates make
                made += 1
                attempts += 1

                print(f"Putting percentage: {(made/attempts)*100}%")

            if key == ord('w'): #simulates miss
                attempts += 1

                print(f"Putting percentage: {(made/attempts)*100}%")

            self.ok, self.curr_bbox = self.tracker.update(self.frame)

            if self.ok:
                p1 = (int(self.curr_bbox[0]), int(self.curr_bbox[1]))
                p2 = (int(self.curr_bbox[0] + self.curr_bbox[2]), int(self.curr_bbox[1] + self.curr_bbox[3]))
                cv.rectangle(self.frame, p1, p2, (255, 0, 0), 2, 1)
                center = ((p1[0] + p2[0]) // 2, (p1[1] + p2[1]) // 2)


                # Logic for checking if ball is in frame or not
                if p1[0] < 0 or p1[1] < 0 or p2[0] > self.frame.shape[1] or p2[1] > self.frame.shape[0]:
                    self.video.release()
                    self.out.release()
                    cv.destroyAllWindows()
                    return 1
                    break #if not in frame, will terminate tracking and generate output video
                else:
                    pass
                    # print("in frame")

                if(self.frame_count == 0):
                    self.initial_center = center
                    self.frame_count += 1
                else:
                    distance = math.sqrt((center[0] - self.initial_center[0]) ** 2 + (center[1] - self.initial_center[1]) ** 2)
                    if(distance > self.distance_thresh):
                        final_center = center
                        angle_radians = math.atan2(final_center[1] - self.initial_center[1], final_center[0] - self.initial_center[0])
                        swing_angle = 0
                        if(self.curr_bbox[0] < 680): #the value should be half of the width of the video frame
                            swing_direction = "right"
                            swing_angle = 180 - math.degrees(angle_radians)
                        else:
                            swing_direction="left"
                            swing_angle = math.degrees(angle_radians) % 180
                        self.text = f"swing angle: {swing_angle:.2f} to the {swing_direction}"
                        self.done = True
                    
            self.out.write(self.frame)

            if(self.done == True):
                cv.putText(self.frame, self.text, (20,50), cv.FONT_HERSHEY_SIMPLEX, 1, (255,0,0), 2, cv.LINE_AA)
            if(self.in_frame == False):
                break

            cv.imshow('Tracking', self.frame)
            k = cv.waitKey(30) & 0xff
            if k == 27:
                break
            
            if not globals.session_in_progress:
                    self.video.release()
                    self.out.release()
                    cv.destroyAllWindows()
                    break
        
        self.video.release()
        self.out.release()
        cv.destroyAllWindows() 

#tracker = Tracker()
#tracker.start_tracking()
