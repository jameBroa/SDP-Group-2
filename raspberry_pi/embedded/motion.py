import cv2
import numpy as np
import time

class VideoWriter():
    def __init__(self, output_path="/home/pi/Desktop/motion2.avi", output_path_org="/home/pi/Desktop/motion3.avi"):
        
        self.out_low_res = cv2.VideoWriter(output_path, cv2.VideoWriter_fourcc(*'XVID'), 10, (320, 240))
        self.out_org_res = cv2.VideoWriter(output_path, cv2.VideoWriter_fourcc(*'XVID'), 10, (640, 480))
        
    def write_from_edges(self, edges):
        self.out_low_res.write(cv2.merge([edges, edges, edges]))
        

class Motion():
    
    def __init__(self, motion_thresh=5, motion_frame_count_thresh=10, residual_frame_count_thresh=10):
        # Video capture device by ID (default is 0, webcam is 1)
        #self.cap = cv2.VideoCapture(1)
        # Reading first frame
        #self.ok, self.frame = self.cap.read()
        # Technical vars for testing / calculations
        self.fps, self.cnt_frame = 0, 0
        self.video_count = 0
        
        # Controls how sensitive motion detection is
        self.motion_thresh = motion_thresh
        
        # A way to counter noise 
        self.motion_frame_count = 0
        self.motion_frame_count_thresh = motion_frame_count_thresh
        
        # count a number frames after motion thresh reached, to capture ball
        # going to hole or whereever.
        self.residual_frame_count = 0
        self.residual_frame_count_thresh = residual_frame_count_thresh
        
        

    def mse(self, image_a, image_b):
        # the 'Mean Squared Error' between the two images is the
        # sum of the squared difference between the two images;
        # NOTE: the two images must have the same dimension
        err = np.sum((image_a.astype("float") - image_b.astype("float")) ** 2)
        err /= float(image_a.shape[0] * image_a.shape[1])

        # return the MSE, the lower the error, the more "similar"
        # the two images are
        return err


    def visualize_fps(self, image, fps: int):
        if len(np.shape(image)) < 3:
            text_color = (255, 255, 255)  # white
        else:
            text_color = (0, 255, 0)  # green
        row_size = 20  # pixels
        left_margin = 24  # pixels

        font_size = 1
        font_thickness = 1

        # Draw the FPS counter
        fps_text = f'FPS = {fps}'
        text_location = (left_margin, row_size)
        cv2.putText(image, fps_text, text_location, cv2.FONT_HERSHEY_PLAIN, 
        font_size, text_color, font_thickness)

        return image
        
    def calc_fps(self, start, end):
        seconds = end - start
        self.fps = 1.0 / seconds
        
    def check_motion(self, roi, roi_p):
        return self.mse(roi, roi_p) > self.motion_thresh
        
    def start(self, output_path='/home/pi/Desktop/motion.avi'):
        self.writer = VideoWriter(output_path=output_path)
        self.cap = cv2.VideoCapture(1)
        # Reading first frame
        self.ok, self.frame = self.cap.read()
        # Technical vars for testing / calculations
        self.fps, self.cnt_frame = 0, 0
        self.motion_frame_count = 0
        self.residual_frame_count = 0


        while True:
            self.ok, self.frame = self.cap.read()
            start_time = time.time()
        
            if not self.ok:
                break

            # Resize the frame to a lower resolution for processing
            frame_processed = cv2.resize(self.frame, (320, 240))

            # Convert frame to grayscale
            frame_gray = cv2.cvtColor(frame_processed, cv2.COLOR_BGR2GRAY)
            
            # Get edges from image
            edges = cv2.Canny(frame_gray,100,200)
            
            
            frame_height = frame_gray.shape[0]
            
            '''
            Generate Region of Interest where we want to detect motion.
            In this example, only detects motion in bottom third of 
            frame.
            '''
            is_motion = False
            
            # Considers bottom third for movement
            #roi = frame_gray[frame_height//3*2 : frame_height, :]
            
            roi = frame_gray[frame_height//3*2 : frame_height, :]
            
            
            if(self.cnt_frame > 0):
                is_motion = self.check_motion(roi, roi_p)
                print(f'motion: {is_motion}')
                if is_motion:
                    #print(f"Frame {self.cnt_frame}: motion detected!")
                    self.motion_frame_count += 1
                    print(f'motion counter: {self.motion_frame_count}')
                    
                    # If number of motion frames exceeds threshold
                    # Prevents breaking as soon as motion detected
                if self.motion_frame_count > self.motion_frame_count_thresh:
                    self.residual_frame_count += 1
                    if self.residual_frame_count > self.residual_frame_count_thresh:
                        self.writer.out_org_res.write(cv2.resize(self.frame, (640, 480)))
                        break
            
            # -------------------------------------------------------------
            # record end time
            end_time = time.time()
            self.calc_fps(start_time, end_time)
            
            self.cnt_frame = self.cnt_frame + 1
            edges_p = edges
            frame_gray_p = frame_gray
            roi_p = roi 
            
            
            # Uncomment if you want to see the edges
            # Commented to improve performance
            #self.writer.write_from_edges(edges)
            self.writer.out_org_res.write(cv2.resize(self.frame, (640, 480)))
            
            
            # uncomment if you want to test with cv2.imshow
        
            # for displaying mask and normal image
            edges = cv2.Canny(frame_gray,100,200)
            #cv2.imshow('gray', frame_gray)
            #cv2.imshow('mask', cv2.merge([edges, edges, edges]))
        
            # For breaking loop
            #if cv2.waitKey(1) & 0xFF == ord('q'):
                #break

        self.cap.release()
        self.writer.out_low_res.release()
        self.writer.out_org_res.release()
        # uncomment if you want to test with cv2.imshow
        cv2.destroyAllWindows()

#motion = Motion(motion_frame_count_thresh=6)
#motion.start()
