import cv2
import numpy as np
import math
import globals

# Assumes that image/frame dimensions are 320x240

class ROI():
	def __init__(self, mask, x_pos, y_pos, pixel_thresh=150): 
		# Position of ROI on frame
		self.x_pos_roi = x_pos
		self.y_pos_roi = y_pos
		# Actualy size of ROI
		self.y_size_roi = 240 - y_pos
		self.x_size_roi = 320 - x_pos 
		# Converting Mask
		self.roi_mask = mask[self.y_pos_roi:self.y_pos_roi + self.y_size_roi,
		self.x_pos_roi:self.x_pos_roi + self.x_size_roi]
		# Pixel Threshold for calculating whether ball is in frame or not
		self.pixel_thresh = pixel_thresh
		self.counter_thresh = 0
		self.entered = False
		self.terminate = False
        
        
	def is_in_frame(self):
		if cv2.countNonZero(self.roi_mask) > self.pixel_thresh:
			print('object in ROI')
			return True
		else:
			print('object not in ROI')
			return False

class Tracker():
	def __init__(self, output_path="/home/pi/Desktop/new.avi", encoding="XVID"):
		self.output_path = output_path
		self.video = cv2.VideoCapture(1)
        
		if not self.video.isOpened():
			print("Cannot open camera")
		else:
			print("- OPENED CAMERA")
                
		fourcc = cv2.VideoWriter_fourcc(*encoding)
		self.out = cv2.VideoWriter(output_path, fourcc, 10, (320,230))
        
		self.lower_bound_hsv = np.array([0,0,100])
		self.upper_bound_hsv = np.array([180,30,255])
		self.counter_thresh = 0
        
        
        
	def start_tracking(self):
		while True:
			if not(globals.session_in_progress):
				print('stop tracking')
				break
			
			
			#BGR image feed from camera
			ret, img = self.video.read()
    
			# Resize image
			img_processed = cv2.resize(img, (320, 240))
    
			# Convert image to HSV
			hsv_img = cv2.cvtColor(img_processed, cv2.COLOR_BGR2HSV)
    
			# Create Mask height: 240, width: 320
			mask = cv2.inRange(hsv_img, self.lower_bound_hsv, self.upper_bound_hsv)
    
			# Select ROI on mask
			roi = ROI(mask, 0, 100)
			in_frame = roi.is_in_frame()
			if not in_frame:
				self.counter_thresh += 1
			if(self.counter_thresh > 50):
				self.out.write(img_processed)
				print('ball has entered frame once, and then left')
				break
			#roi_mask = roi.roi_mask
    
			# Apply Mask
			res = cv2.bitwise_and(img_processed, img_processed, mask=mask)

			# Display output
			#cv2.imshow('thresholded', res)
			#cv2.imshow('mask', mask)
    
			# Write video output to file
			self.out.write(img_processed)

			
		self.video.release()
		self.out.release()
		cv2.destroyAllWindows()
