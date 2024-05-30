import { View, ScrollView, FlatList, StyleSheet } from "react-native";
import ExpenseItem from "./ExpenseItem";

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayName = date.getDay();
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  if (isToday(day, monthIndex, year)) {
    return "Today";
  } else if (isYesterday(day, monthIndex, year)) {
    return "Yesterday";
  }
  return `${dayNames[dayName]}, ${monthNames[monthIndex]} ${day} , ${year}`;
};

export const isToday = (day, monthIndex, year) => {
  const today = new Date();
  if (
    year == today.getFullYear() &&
    monthIndex == today.getMonth() &&
    day == today.getDate()
  ) {
    return true;
  }
  return false;
};
export const isYesterday = (day, monthIndex, year) => {
  const today = new Date();
  if (
    year == today.getFullYear() &&
    monthIndex == today.getMonth() &&
    day == today.getDate() - 1
  ) {
    return true;
  }
  return false;
};

const groupExpensesByDate = (expenses) => {
  expenses.forEach((expense) => {
    expense.date = new Date(expense.date);
  });

  expenses.sort((a, b) => b.date - a.date);

  const groupedByDate = expenses.reduce((acc, expense) => {
    const dateKey = formatDate(expense.date);
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(expense);
    return acc;
  }, {});

  const sortedGroupedExpenses = Object.keys(groupedByDate).map(
    (date) => groupedByDate[date]
  );

  return sortedGroupedExpenses;
};

const ExpenseList = ({ expenseList }) => {
  const groupedExpenses = groupExpensesByDate(expenseList);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      style={styles.scrollViewStyles}
    >
      {groupedExpenses.map((group, index) => {
        const isLastGroup = index === groupedExpenses.length - 1;
        return (
          <FlatList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            data={group}
            renderItem={({ item, index }) => {
              const isFirstInGroup = index === 0;
              const currentDateTotal = group.reduce(
                (sum, expense) => sum + expense.total,
                0
              );
              const isLastItem = index === group.length - 1;
              return (
                <ExpenseItem
                  total={currentDateTotal}
                  isFirstInGroup={isFirstInGroup}
                  item={item}
                  isLastGroup={isLastGroup ? true : false}
                  isLastItem={isLastItem ? true : false}
                />
              );
            }}
            keyExtractor={(item) => item.id.toString()}
          />
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  lastItem: {},
});

export default ExpenseList;
