import React, { useState } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View } from "react-native";
import Button from "../ui/Button";
import FlatButton from "../ui/FlatButton";
import colors from "../../constants/colors";
import Input from "../auth/Input";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { formatDate } from "./ExpenseList";
import { formatDate as formatFn } from "date-fns";
import { getAuth } from "firebase/auth";
import app from "../../firebaseConfig";
import { getFirestore } from "firebase/firestore";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";

function AddExpense({ addModalVisible, onHideModalHandler, fetchData }) {
  const auth = getAuth(app);
  const user = auth.currentUser;

  const [titleIsValid, setTitleIsValid] = useState(true);
  const [amountIsValid, setAmountIsValid] = useState(true);
  const [dateText, setDateText] = useState(formatDate(new Date()));
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [eneteredTitle, setEneteredTitle] = useState("");
  const [eneteredAmount, setEnteredAmount] = useState(0);
  const [eneteredType, setEnteredType] = useState("");
  const [eneteredDate, setEnteredDate] = useState(
    formatFn(new Date(), "yyyy-MM-dd")
  );

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setDateText(formatDate(date));
    setEnteredDate(formatFn(date, "yyyy-MM-dd"));
    hideDatePicker();
  };

  const handleTitleValue = (value) => {
    setEneteredTitle(value);
    console.log("Value", eneteredTitle);
  };
  const handleAmountValue = (value) => {
    setEnteredAmount(Number(value));
    console.log("Value", eneteredAmount);
  };
  const handleTypeValue = (value) => {
    setEnteredType(value);
    console.log("Value", eneteredType);
  };

  const onConfirmButtonHandler = async () => {
    const db = getFirestore(app);
    setTitleIsValid(eneteredTitle.length > 0);
    setAmountIsValid(typeof eneteredAmount == "number");
    console.log("Title aya: ", eneteredTitle);
    console.log("Amount aya: ", typeof eneteredAmount);
    console.log("Type aya: ", eneteredType);
    console.log("Date aya: ", eneteredDate);
    if (!titleIsValid || !amountIsValid) {
      Alert.alert("Bro");
    } else {
      const expenseObj = {
        user: user.uid,
        title: eneteredTitle,
        type: eneteredType,
        date: eneteredDate,
        total: eneteredAmount,
      };
      const newRef = doc(collection(db, "Expense"));
      await setDoc(newRef, expenseObj);
      fetchData();
      onHideModalHandler();
    }
  };

  return (
    <View style={styles.centeredView}>
      <Modal animationType="fade" transparent={true} visible={addModalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.addExpenseText}>Add Expense</Text>
            <View style={styles.inputContainer}>
              <Input
                label="Title"
                onUpdateValue={handleTitleValue}
                keyboardType="text"
                isInvalid={!titleIsValid}
              />
              <Input
                label="Amount"
                onUpdateValue={handleAmountValue}
                value={eneteredAmount}
                keyboardType="number"
                isInvalid={!amountIsValid}
              />
              <Input
                label="Type"
                onUpdateValue={handleTypeValue}
                value={eneteredType}
                keyboardType="text"
              />
              <Button
                buttonStyle={{
                  backgroundColor: colors.primary200,
                  marginVertical: 15,
                }}
                textStyle={{ color: colors.primary500 }}
                onPress={showDatePicker}
              >
                {dateText}
              </Button>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
                buttonTextColorIOS={colors.primary500}
                display="inline"
              />
            </View>
            <View style={styles.buttonContainer}>
              <FlatButton onPress={onHideModalHandler}>Cancel</FlatButton>
              <Button onPress={onConfirmButtonHandler}>Confirm</Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 20,
    marginTop: 10,
  },
  addExpenseText: {
    fontFamily: "ubuntu-bold",
    fontSize: 20,
    color: colors.primary500,
    marginBottom: 10,
  },
  inputContainer: {
    width: 250,
    alignSelf: "left",
  },
  selectListStyles: {
    marginBottom: 40,
  },
});

export default AddExpense;
