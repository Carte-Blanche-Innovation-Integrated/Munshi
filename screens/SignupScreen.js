import AuthContent from "../components/auth/AuthContent";
import colors from "../constants/colors";
import { StyleSheet, ImageBackground, SafeAreaView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import app from "../firebaseConfig";
import { Alert } from "react-native";
import { updateProfile } from "firebase/auth";

function LoginScreen() {
  const auth = getAuth(app);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  async function SignupHandler({ email, password, name }) {
    console.log("Email: ", email);
    console.log("password: ", password);
    console.log("displayName: ", name);
    setIsAuthenticating(true);
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )
      .then(() =>
        updateProfile(auth.currentUser, {
          displayName: name,
        })
      )
      .catch((error) => {
        Alert.alert(
          "Authentication Failed",
          "Could not create user! Please check your input and try again!"
        );
      })
      .finally(() => {
        setIsAuthenticating(false);
      });
  }

  return (
    <>
      <LinearGradient
        colors={[colors.primary100, colors.primary950]}
        style={styles.rootScreen}
      >
        <ImageBackground
          source={require("../assets/background.jpeg")}
          resizeMode="cover"
          style={styles.rootScreen}
          imageStyle={styles.backgroundImage}
        >
          <SafeAreaView style={styles.rootScreen}>
            {isAuthenticating ? (
              <LoadingOverlay message={"Creating User..."} />
            ) : (
              <AuthContent onAuthenticate={SignupHandler} />
            )}
          </SafeAreaView>
        </ImageBackground>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  rootScreen: {
    flex: 1,
  },
  backgroundImage: {
    opacity: 0.45,
  },
});

export default LoginScreen;
