import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Switch,
  ScrollView,
} from "react-native";
import {
  subDays,
  isAfter,
  format,
  compareAsc,
  isBefore,
  startOfDay,
  endOfDay,
} from "date-fns";
import groupBy from "just-group-by";
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
import { ButtonGroup } from "@rneui/themed";
import { PieChart } from "react-native-gifted-charts";
import NameText from "../atomicComponents/NameText";

const renderLegend = (text, color) => {
  return (
    <View
      style={{ flexDirection: "row", marginBottom: 12, alignItems: "center" }}
    >
      <View
        style={{
          height: 12,
          width: 12,
          marginRight: 8,
          borderRadius: 3,
          backgroundColor: color || "white",
        }}
      />
      <Text
        style={{
          color: colors.primary900,
          fontSize: 12,
          fontFamily: "ubuntu-light",
        }}
      >
        {text || ""}
      </Text>
    </View>
  );
};

function Reports() {
  const auth = getAuth();
  const user = auth.currentUser;

  const db = getFirestore(app);

  const [expense, setExpense] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [weeksMaxExpenditure, setWeeksMaxExpenditure] = useState(0);
  const [weeksTotalExpenditure, setWeeksTotalExpenditure] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSwitchEnabled, setIsSwitchEnabled] = useState(true);

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
      const chartWeeklyData = createWeeklyBarData(fetchedData);
      const pieWeeklyData = createWeeklyPieData(fetchedData);
      setExpense(fetchedData);
      setChartData(chartWeeklyData);
      setPieData(pieWeeklyData);
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {}, [selectedIndex]);

  useEffect(() => {
    fetchData();
  }, []);

  function onMorePressHandler() {}
  function floorUpNearestHundred(number) {
    return Math.floor(number / 100) * 100 + 100;
  }

  function createWeeklyBarData(expense) {
    var today = new Date();
    const startDate = subDays(today, 7);

    const expensesInRange = expense.filter((e) =>
      isAfter(new Date(e.date), startDate)
    );
    const baseExpense = new Array(7).fill(0).map((_, i) => ({
      date: subDays(today, i),
      total: 0,
    }));

    const barData = Object.entries(
      groupBy(
        [...expensesInRange, ...baseExpense],
        (e) => new Date(e.date).toISOString().split("T")[0]
      )
    )
      .map(([k, vals]) => ({
        value: vals.reduce((a, e) => a + e.total, 0),
        date: k,
        label: format(new Date(k), "d E"),
      }))
      .sort((a, b) => compareAsc(new Date(a.date), new Date(b.date)));

    const weeksMaxExpenditure = Math.max(...barData.map((item) => item.value));
    setWeeksTotalExpenditure(expensesInRange.reduce((a, e) => a + e.total, 0));
    setWeeksMaxExpenditure(weeksMaxExpenditure);

    return barData;
  }

  function handleSwitchToggle() {
    setIsSwitchEnabled(!isSwitchEnabled);
  }

  function createWeeklyPieData(expenses) {
    const today = new Date();

    const lastWeekStart = subDays(today, 7);
    const lastWeekEnd = today;

    const filteredExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date).toISOString().split("T")[0];

      return (
        isAfter(expenseDate, startOfDay(lastWeekStart)) &&
        isBefore(expenseDate, endOfDay(lastWeekEnd))
      );
    });

    const groupedByCetegory = filteredExpenses.reduce((acc, expense) => {
      const key = expense.type;
      if (!acc[key]) {
        acc[key] = { label: key, value: 0 };
      }
      acc[key].value += expense.total;
      return acc;
    }, {});

    const pieData = Object.keys(groupedByCetegory).map((key, index) => {
      return {
        text: groupedByCetegory[key].value,
        label: groupedByCetegory[key].label,
        value: groupedByCetegory[key].value,
        color: color_list[index % 5],
      };
    });
    return pieData;
  }

  // const color_list = [
  //   colors.gray400,
  //   colors.gray600,
  //   colors.gray700,
  //   colors.gray800,
  //   colors.gray900,
  // ];
  const color_list = [
    colors.primary200,
    colors.primary300,
    colors.primary400,
    colors.primary500,
    colors.primary600,
  ];

  return (
    <View style={styles.rootContainer}>
      <View style={styles.moreButtonContainer}>
        <NameText name={user.displayName} />
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
        <View style={styles.weekExpenseToggleButton}>
          <View>
            <Text style={styles.weekExpense}>${weeksTotalExpenditure}</Text>
            <Text style={styles.weekText}>Spent this week</Text>
          </View>
          <View style={styles.detailSwitchContainer}>
            <Text style={styles.weekText}>Detail</Text>
            <Switch
              trackColor={{
                false: colors.gray600,
                true: colors.primary200,
              }}
              thumbColor={true ? colors.primary800 : "white"}
              ios_backgroundColor={colors.gray600}
              onValueChange={handleSwitchToggle}
              value={isSwitchEnabled}
            />
          </View>
        </View>
        {isSwitchEnabled && (
          <ButtonGroup
            buttons={["Daily Detail", "By Category"]}
            selectedIndex={selectedIndex}
            onPress={(value) => {
              setSelectedIndex(value);
            }}
            selectedButtonStyle={{
              backgroundColor: null,
            }}
            selectedTextStyle={{ color: colors.primary500 }}
            textStyle={{ color: colors.gray700 }}
            containerStyle={{
              borderBottomColor: colors.gray400,
              borderBottomWidth: 1.8,
            }}
          />
        )}
      </View>
      {isLoading ? (
        <LoadingOverlay
          message={"Fetching data..."}
          custStyles={{ color: colors.primary900 }}
        />
      ) : (
        isSwitchEnabled && (
          <View style={styles.graphContainer}>
            {selectedIndex === 1 ? (
              <View style={styles.pieContainer}>
                <PieChart
                  data={pieData}
                  textColor={colors.gray950}
                  textSize={10}
                  showText
                  radius={106}
                />
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    marginTop: 20,
                  }}
                >
                  {pieData?.map((data) => {
                    return renderLegend(data.label, data.color);
                  })}
                </View>
              </View>
            ) : (
              <BarChart
                key={0}
                barWidth={22}
                frontColor={colors.primary400}
                data={chartData}
                yAxisThickness={1}
                xAxisThickness={1}
                xAxisColor={colors.gray500}
                yAxisColor={colors.gray500}
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
            )}
          </View>
        )
      )}
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
    flexGrow: 1,
  },
  moreButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  graphContainer: {
    marginBottom: 15,
  },
  pieContainer: {
    alignItems: "center",
  },
  weekExpenseToggleButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailSwitchContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
});

export default Reports;
