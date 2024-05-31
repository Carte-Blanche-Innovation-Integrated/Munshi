import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import colors from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import ExpenseList from "../components/expenses/ExpenseList";
import { useState, useEffect } from "react";
import AddExpense from "../components/expenses/AddExpense";
import { getAuth } from "firebase/auth";
import app from "../firebaseConfig";
import { getFirestore } from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import {
  format,
  parseISO,
  startOfDay,
  endOfDay,
  isAfter,
  isBefore,
  subDays,
} from "date-fns";

export function calculateTotalSpent(expenses) {
  const today = new Date();

  const lastWeekStart = subDays(today, 7);
  const lastWeekEnd = today;

  const filteredExpenses = expenses.filter((expense) => {
    const expenseDate = parseISO(expense.date);

    return (
      isAfter(expenseDate, startOfDay(lastWeekStart)) &&
      isBefore(expenseDate, endOfDay(lastWeekEnd))
    );
  });
  let total = 0;
  filteredExpenses.forEach((expense) => {
    total += expense.total;
  });
  return total;
}

const getData = async (db, uid) => {
  const q = query(collection(db, "Expense"), where("user", "==", uid));
  const querySnapshot = await getDocs(q);

  const expenseList = [];
  let expenseObj = {};
  querySnapshot.forEach((doc) => {
    expenseObj = doc.data();
    expenseObj["id"] = doc.id;
    expenseList.push(expenseObj);
  });
  return expenseList;
};

function Expense() {
  const auth = getAuth(app);
  const user = auth.currentUser;

  const db = getFirestore(app);

  const [expense, setExpense] = useState([]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const fetchedData = await getData(db, user.uid);
      setExpense(fetchedData);
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  function onAddPressHandler() {
    setAddModalVisible(true);
  }
  function onHideModalHandler() {
    setAddModalVisible(false);
  }

  function calculateWeeksExpense() {}

  return (
    <>
      <View style={styles.rootContainer}>
        <View style={styles.addExpenseContainer}>
          <Text style={styles.nameText}>{user.displayName}</Text>
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
          fetchData={fetchData}
          addModalVisible={addModalVisible}
          onHideModalHandler={onHideModalHandler}
        />
        <View style={styles.weekExpenseContainer}>
          <Text style={styles.weekText}>Spent this week</Text>
          <Text style={styles.weekExpense}>
            ${calculateTotalSpent(expense)}
          </Text>
        </View>
        {isLoading ? (
          <LoadingOverlay
            message={"Fetching data..."}
            custStyles={{ color: colors.primary900 }}
          />
        ) : (
          <ExpenseList expenseList={expense} />
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
  nameText: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
    color: colors.primary900,
    fontFamily: "ubuntu-medium",
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
});

export default Expense;
