import { useState } from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import Button from "../ui/Button.js";
import Input from "./Input";

import colors from "../../constants/colors.js";

function AuthForm({ isLogin, onSubmit, credentialsInvalid }) {
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredName, setEnteredName] = useState("");
  const [enteredConfirmEmail, setEnteredConfirmEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [enteredConfirmPassword, setEnteredConfirmPassword] = useState("");

  const {
    name: nameIsInValid,
    email: emailIsInvalid,
    confirmEmail: emailsDontMatch,
    password: passwordIsInvalid,
    confirmPassword: passwordsDontMatch,
  } = credentialsInvalid;

  function updateInputValueHandler(inputType, enteredValue) {
    switch (inputType) {
      case "email":
        setEnteredEmail(enteredValue);
        break;
      case "name":
        setEnteredName(enteredValue);
        break;
      case "confirmEmail":
        setEnteredConfirmEmail(enteredValue);
        break;
      case "password":
        setEnteredPassword(enteredValue);
        break;
      case "confirmPassword":
        setEnteredConfirmPassword(enteredValue);
        break;
    }
  }

  function submitHandler() {
    onSubmit({
      name: enteredName,
      email: enteredEmail,
      confirmEmail: enteredConfirmEmail,
      password: enteredPassword,
      confirmPassword: enteredConfirmPassword,
    });
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View style={styles.textContainer}>
        <Text style={styles.munshiText}>Munshi</Text>
      </View>
      {!isLogin && (
        <Input
          label="Display Name"
          onUpdateValue={updateInputValueHandler.bind(this, "name")}
          value={enteredName}
          isInvalid={nameIsInValid}
          placeholder="John Doe"
        />
      )}
      <Input
        label="Email Address"
        onUpdateValue={updateInputValueHandler.bind(this, "email")}
        value={enteredEmail}
        keyboardType="email-address"
        isInvalid={emailIsInvalid}
        placeholder="johndoe@gmail.com"
      />
      {!isLogin && (
        <Input
          label="Confirm Email Address"
          onUpdateValue={updateInputValueHandler.bind(this, "confirmEmail")}
          value={enteredConfirmEmail}
          keyboardType="email-address"
          isInvalid={emailsDontMatch}
          placeholder="johndoe@gmail.com"
        />
      )}
      <Input
        label="Password"
        onUpdateValue={updateInputValueHandler.bind(this, "password")}
        secure
        value={enteredPassword}
        isInvalid={passwordIsInvalid}
        placeholder="********"
      />
      {!isLogin && (
        <Input
          label="Confirm Password"
          onUpdateValue={updateInputValueHandler.bind(this, "confirmPassword")}
          secure
          value={enteredConfirmPassword}
          isInvalid={passwordsDontMatch}
          placeholder="********"
        />
      )}
      <View style={styles.buttons}>
        <Button onPress={submitHandler}>
          {isLogin ? "Log In" : "Sign Up"}
        </Button>
      </View>
    </ScrollView>
  );
}

export default AuthForm;

const styles = StyleSheet.create({
  buttons: {
    marginTop: 12,
  },
  textContainer: {
    margin: 10,
  },
  munshiText: {
    fontFamily: "ubuntu-bold",
    fontSize: 40,
    alignSelf: "center",
    color: colors.primary900,
  },
});
