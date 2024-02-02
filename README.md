# How to run
1. clone repo
2. open terminal
3. run `npm install` to install  (install npm if you don't already have it)
4. sign into expo from your computer
5. get expo app on phone (sign in there as well)
6. run `cd IntelliPutt`to enter folder
7. run `npx expo start` to start the app
8. scan the QR code
9. pick an issue from https://github.com/jameBroa/SDP-Group-2/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc
10. create a branch for issue and make sure you're working on it in VS code
   * <img width="328" alt="Screenshot 2024-02-02 at 12 49 43" src="https://github.com/jameBroa/SDP-Group-2/assets/44908994/4e638dee-2780-445e-8859-27d12f5a4ad1">
   * <img width="465" alt="Screenshot 2024-02-02 at 12 49 50" src="https://github.com/jameBroa/SDP-Group-2/assets/44908994/20c45bb3-11f0-403c-882f-d9832a7bdbfd">


# Workshop notes

Files relevant code from SDP Workshops

## EV3 Workshop notes
Two ways to connect to EV3, mainly want to use wireless connection.

Connect via: ssh@robot[ip address of EV3 device]

Use ssh to connect to EV3 device and run python files via python3 [name of python file].py

To send python files across, use scp [name of python file].py robot@[ip of EV3 device]:/home:/robot

There is a password to scp into EV3 device which is: 'maker' (potential to change)

Ports 1-4: input
Ports A-D: output
