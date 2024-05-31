import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../constants/colors";
import { BarChart } from "react-native-gifted-charts";
import ExpenseList from "../components/expenses/ExpenseList";
import { getAuth } from "firebase/auth";
import app from "../firebaseConfig";
import { getFirestore } from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { useState, useEffect } from "react";

function Reports() {
  const auth = getAuth();
  const user = auth.currentUser;

  const db = getFirestore(app);

  const [expense, setExpense] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [weeksMaxExpenditure, setWeeksMaxExpenditure] = useState(0);
  const [weeksTotalExpenditure, setWeeksTotalExpenditure] = useState(0);

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

  const fetchData = async () => {
    try {
      const fetchedData = await getData(db, user.uid);
      const chartData = await createWeeklyBarData(fetchedData);
      setExpense(fetchedData);
      setChartData(chartData);
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    return null;
  }, []);

  function onMorePressHandler() {}
  function floorUpNearestHundred(number) {
    return Math.floor(number / 100) * 100 + 100;
  }

  function createWeeklyBarData(expense) {
    const barData = [];
    var today = new Date();
    let maxExpenseSoFar = 0;
    const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
    for (let i = 6; i >= 0; i--) {
      const concernedDate = new Date(today.getTime());
      concernedDate.setDate(concernedDate.getDate() - i);

      const formattedCurrentDate = concernedDate.toISOString().split("T")[0];

      const totalExpensesOnCurrentDate = expense
        .filter((expense) => {
          const expenseDate = new Date(expense.date);
          const formattedExpenseDate = expenseDate.toISOString().split("T")[0];
          return formattedExpenseDate === formattedCurrentDate;
        })
        .reduce((sum, expense) => {
          return sum + expense.total;
        }, 0);

      if (totalExpensesOnCurrentDate >= maxExpenseSoFar) {
        maxExpenseSoFar = totalExpensesOnCurrentDate;
      }
      setWeeksTotalExpenditure(
        (prevState) => prevState + totalExpensesOnCurrentDate
      );
      barData.push({
        label: daysOfWeek[concernedDate.getDay()],
        value: totalExpensesOnCurrentDate,
      });
    }
    setWeeksMaxExpenditure(maxExpenseSoFar);
    return barData;
  }

  return (
    <View style={styles.rootContainer}>
      <View style={styles.moreButtonContainer}>
        <Text style={styles.nameText}>{user.displayName}</Text>
        <Pressable>
          <Ionicons
            onPress={onMorePressHandler}
            name="ellipsis-horizontal-outline"
            size={25}
            color={colors.primary600}
          />
        </Pressable>
      </View>
      <View style={styles.totalExpenseContainer}>
        <Text style={styles.weekExpense}>${weeksTotalExpenditure}</Text>
        <Text style={styles.weekText}>Spent this week</Text>
      </View>
      <View style={styles.barChart}>
        <BarChart
          barWidth={22}
          frontColor="lightgray"
          data={chartData}
          yAxisThickness={1}
          xAxisThickness={1}
          xAxisColor={colors.gray500}
          yAxisColor={colors.gray500}
          backgroundColor={colors.primary100}
          maxValue={floorUpNearestHundred(weeksMaxExpenditure)}
          barBorderTopLeftRadius={4}
          barBorderTopRightRadius={4}
          disableScroll
          height={180}
          xAxisLabelTextStyle={{
            color: colors.gray700,
            fontSize: 10,
            fontFamily: "ubuntu-light",
          }}
          yAxisTextStyle={{
            color: colors.gray700,
            fontSize: 10,
            fontFamily: "ubuntu-light",
          }}
        />
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
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    marginHorizontal: 20,
    paddingTop: 10,
  },
  moreButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nameText: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
    color: colors.primary900,
    fontFamily: "ubuntu-bold",
  },
  totalExpenseContainer: {
    marginBottom: 22,
  },
  weekText: {
    color: colors.gray700,
  },
  weekExpense: {
    color: colors.gray900,
    fontSize: 45,
    fontFamily: "ubuntu-light",
  },
  barChart: {
    marginBottom: 15,
  },
});

export default Reports;
