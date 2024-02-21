{
  /* 
    LOGIN PAGE
    Authenticates user.

    Input fields
        - Email
        - Password  

    Links to
        - Index page
        - Register page
        - Forgot password page
        - Home page (if successfully authenticated)
*/
}

import {
  ImageBackground,
  ScrollView,
  Text,
  View,
  Pressable,
} from "react-native";
import Modal from "react-native-modal";
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import CustomButton from '../components/CustomButton';
import TextField from '../components/TextField';
import BackButton from '../components/BackButton';
import db from '../config/database';
import { doc, getDoc } from "firebase/firestore";
import { useDispatch } from 'react-redux';
import { login } from '../context/slices/userSlice';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const [buttonPressed, setButtonPressed] = useState(false);
  const [forgotPasswordPassed, setForgotPasswordPressed] = useState(false);
  const [registerPressed, setRegisterPressed] = useState(false);

  // Fetch name + experience level from database
  const fetchUserData = async (userId) => {
      const userRef = doc(db, "users", userId);

      try {
          const snapshot = await getDoc(userRef);
          if (snapshot.exists()) {
              console.log('User data:', snapshot.data());
              return snapshot.data();
          } else {
              return {};
          }
      } catch (error) {
          console.error('Error fetching user data:', error.message);
          return {};
      }
  };

  const auth = getAuth();
  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // User successfully signed in
        const user = userCredential.user;
        console.log(user)
        console.log("checkpoint ^")
            // Get rest of user data from the database
            fetchUserData(user.uid)
            .then((userData) => {                        // Data found
                console.log(user);
                console.log(user.uid);

                dispatch(login(
                    {
                        uid: user.uid,
                        email: userData.email,
                        name: userData.name,
                        experience: userData.experience,
                        friends: userData.friends
                    }
                ));
            }).catch((error) => {                        // Data not found
                if (error.message == "Cannot read property 'name' of undefined") {
                    alert('User signed in, please update your user details!');
                } else {
                    console.error('Error fetching user data:', error.message); 
                }

                dispatch(login(
                    {
                        uid: user.uid,
                        email: email,
                        name: "Untitled User",
                        experience: "Not available",
                        friends: []
                    }
                ));
            });

            console.log('User signed in:' + user.uid);
            setEmail('');
            setPassword('');

            router.push('/home');
        })
        .catch((error) => {                             // Error with authentication
            alert('Error signing in: ' + error.message);
        });   
    };

  const handlePasswordReset = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert("Check your email for a link to reset your password.");
        setTimeout(() => {
          setShowModal(false);
        }, 1000);
      })
      .catch((error) => {
        alert("Error " + error.message);
      });
  };

  return (
    <View className="bg-white flex-1 flex-col">
      <ImageBackground
        resizeMode="stretch"
        source={require("../static/images/background.png")}
        className="flex-1"
      >
        <BackButton href="./" />
      </ImageBackground>

      <ScrollView
        automaticallyAdjustKeyboardInsets={true}
        contentContainerStyle={styles.wrapper}
        className="pt-20 bg-stone-50 h-1/2 rounded-lg"
      >
        <View className="mb-10">
          <Text className="[font-family:'Poppins-Bold',Helvetica] font-bold text-lime-950 text-[32px] tracking-[0] leading-[normal]">
            Welcome back!
          </Text>
          <Text className="mt-2 h-[24px] [font-family:'Poppins-Regular',Helvetica] font-normal text-[#093923] text-[16px] tracking-[0] leading-[normal]">
            We're happy to see you again.
          </Text>
        </View>

        <View className="w-3/4 px-[10px] py-[6px] rounded">
          <TextField
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <TextField
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
          />

          <Text className="mb-8">
            <Pressable
              className="font-bold"
              onPress={() => setShowModal(true)}
              onPressIn={() => {
                setForgotPasswordPressed(true);
              }}
              onPressOut={() => {
                setForgotPasswordPressed(false);
              }}
            >
              <Text
                className={
                  forgotPasswordPassed
                    ? "font-bold mt-3 text-sky-800"
                    : "font-bold mt-3"
                }
              >
                {" "}
                Forgot your password?{" "}
              </Text>
            </Pressable>
          </Text>

          <CustomButton text="Log in" onPress={handleLogin} />
          <Text className="mb-10">
            Don't have an account?{" "}
            <Link
              className={
                registerPressed ? "font-bold text-sky-800" : "font-bold"
              }
              onPressIn={() => {
                setRegisterPressed(true);
              }}
              onPressOut={() => {
                setRegisterPressed(false);
              }}
              href="./register"
            >
              Register.{" "}
            </Link>
          </Text>
        </View>
      </ScrollView>

      <Modal
        isVisible={showModal}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        className="w-[90%] mt-[50%]"
        style={styles.modal}
      >
        <ScrollView
          automaticallyAdjustKeyboardInsets={true}
          contentContainerStyle={styles.resetPasswordWrapper}
          className="bg-white px-[30px] pt-[20px] pb-[40px] rounded-lg w-full"
        >
          <Pressable
            className={styles.button}
            onPress={() => setShowModal(false)}
            onPressIn={() => {
              setButtonPressed(true);
            }}
            onPressOut={() => {
              setButtonPressed(false);
            }}
          >
            <Text className={buttonPressed ? "text-sky-800" : ""}> Back </Text>
          </Pressable>
          <View className="mb-10 mt-6 items-center">
            <Text className="[font-family:'Poppins-Bold',Helvetica] font-bold text-lime-950 text-center text-[30px] tracking-[0] leading-[normal]">
              Reset your password
            </Text>
            <Text className="font-light mt-4 text-base text-center">
              If your email is registered with us, we'll send you a link to
              reset your password.
            </Text>
          </View>

          <View className="items-center w-[95%] ml-2 mt-10">
            <TextField
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
            />
            <CustomButton text="Send link" onPress={handlePasswordReset} />
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
}

const styles = {
  wrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    justifyContent: "center",
    alignItems: "center",
    maxHeight: "57%",
  },
  resetPasswordWrapper: {
    flexGrow: 1,
    height: "50%",
  },
  button: {
    width: 45,
    height: 45,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: 20,
    position: "absolute",
    left: 40,
    top: 50,
  },
  buttonClicked: {
    width: 45,
    height: 45,
    backgroundColor: "green",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: 20,
    position: "absolute",
    left: 40,
    top: 50,
  },
};
