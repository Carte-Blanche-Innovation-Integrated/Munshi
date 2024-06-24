import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import colors from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import ExpenseList from "../components/expenses/ExpenseList";
import { useState, useEffect } from "react";
import AddExpense from "../components/expenses/AddExpense";
import { getAuth } from "firebase/auth";
import app from "../firebaseConfig";
import { getFirestore } from "firebase/firestore";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import NameText from "../atomicComponents/NameText";
import EmptyState from "../atomicComponents/EmptyState";

export function calculateTotalSpent(expenses) {
  let total = 0;
  expenses.forEach((a) => (total = total + a.total));
  return total;
}

function Expense() {
  const auth = getAuth(app);
  const user = auth.currentUser;

  const db = getFirestore(app);

  const [expense, setExpense] = useState([]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const expensesCollection = query(
      collection(db, "Expense"),
      where("user", "==", user.uid)
    );
    const unsubscribe = onSnapshot(expensesCollection, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setExpense(data);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  function onAddPressHandler() {
    setAddModalVisible(true);
  }
  function onHideModalHandler() {
    setAddModalVisible(false);
  }

  console.log("ASDASD: ", expense.length);

  return (
    <>
      <View style={styles.rootContainer}>
        <View style={styles.addExpenseContainer}>
          <NameText name={user.displayName} />
          <Pressable>
            <Ionicons
              onPress={onAddPressHandler}
              name="add-circle-outline"
              size={25}
              color={colors.primary600}
            />
          </Pressable>
        </View>
        <AddExpense
          addModalVisible={addModalVisible}
          onHideModalHandler={onHideModalHandler}
        />
        <View style={styles.weekExpenseContainer}>
          <Text style={styles.weekText}>All time spendings</Text>
          <Text style={styles.weekExpense}>
            ${calculateTotalSpent(expense)}
          </Text>
        </View>
        {isLoading ? (
          <LoadingOverlay
            message={"Fetching data..."}
            custStyles={{ color: colors.primary900 }}
          />
        ) : expense.length > 0 ? (
          <ExpenseList expenseList={expense} />
        ) : (
          <EmptyState message={"No expense added so far"} />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  addExpenseContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  weekExpenseContainer: {
    marginBottom: 50,
    marginTop: 25,
    alignItems: "center",
  },
  weekText: {
    color: colors.gray700,
  },
  weekExpense: {
    color: colors.gray900,
    fontSize: 90,
    fontFamily: "ubuntu-light",
  },
  imageStyle: { height: 150, width: 150, alignSelf: "center" },
  noExpenseContainer: {
    alignItems: "center",
    gap: 10,
  },
});

export default Expense;
