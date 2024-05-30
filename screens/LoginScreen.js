import AuthContent from "../components/auth/AuthContent";
import colors from "../constants/colors";
import { StyleSheet, ImageBackground, SafeAreaView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import app from "../firebaseConfig";
import { useState } from "react";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { Alert } from "react-native";

function LoginScreen() {
  const auth = getAuth(app);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  async function SigninHandler({ email, password }) {
    setIsAuthenticating(true);
    setIsAuthenticating(true);
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    )
      .catch((error) => {
        Alert.alert(
          "Authentication Failed",
          "Could not log you in! Please check your email and password!"
        );
      })
      .finally(() => {
        setIsAuthenticating(false);
      });

    const user = userCredential.user;
  }

  return (
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
            <LoadingOverlay message={"Logging In..."} />
          ) : (
            <AuthContent onAuthenticate={SigninHandler} isLogin />
          )}
        </SafeAreaView>
      </ImageBackground>
    </LinearGradient>
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
