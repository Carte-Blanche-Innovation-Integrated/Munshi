import React, { useState } from "react";
import { Alert, Modal, StyleSheet, Text, View } from "react-native";
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
import { collection, doc, setDoc } from "firebase/firestore";

function AddExpense({ addModalVisible, onHideModalHandler }) {
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
  };
  const handleAmountValue = (value) => {
    setEnteredAmount(Number(value));
  };
  const handleTypeValue = (value) => {
    setEnteredType(value);
  };

  const onConfirmButtonHandler = async () => {
    const db = getFirestore(app);
    setTitleIsValid(eneteredTitle.length > 0);
    setAmountIsValid(typeof eneteredAmount == "number");
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
                placeholder="Icecream"
              />
              <Input
                label="Amount ($)"
                onUpdateValue={handleAmountValue}
                value={eneteredAmount}
                isInvalid={!amountIsValid}
                keyboardType="numeric"
                placeholder="350"
              />
              <Input
                label="Type"
                placeholder="Groceries"
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
                maximumDate={new Date()}
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
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.7,
    shadowRadius: 6,
    elevation: 5,
    marginTop: 100,
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
