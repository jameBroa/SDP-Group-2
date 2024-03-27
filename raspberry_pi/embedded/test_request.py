import cv2

cap = cv2.VideoCapture(1)
curr_bbox = None
initial_bbox = (500,100,100,100) # Bounding box where the ball will be (needs to be adjusted to frame)
tracker = cv2.legacy.TrackerKCF_create()
out = cv2.VideoWriter('/home/pi/Desktop/test-h264.mp4', cv2.VideoWriter_fourcc(*'h264'), 10, (int(cap.get(3)), int(cap.get(4))))
	
ok, frame = cap.read()
curr_bbox = initial_bbox
ok = tracker.init(frame, curr_bbox)
while True:
	ok, frame = cap.read()
	
	ok, curr_bbox = tracker.update(frame)
	
	if ok: 
		p1 = (int(curr_bbox[0]), int(curr_bbox[1]))
		p2 = (int(curr_bbox[0] + curr_bbox[2]), int(curr_bbox[1] + curr_bbox[3]))
		cv2.rectangle(frame, p1, p2, (255, 0, 0), 2, 1)
		
	else: 
		pass
	cv2.imshow("Webcam", frame)
	out.write(frame)


	
	if cv2.waitKey(1) & 0xFF == ord('q'):
		break
		
cap.release()
out.release()
cv2.destroyAllWindows()
