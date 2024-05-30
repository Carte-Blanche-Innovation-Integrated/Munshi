import { View, Text, StyleSheet, Image } from "react-native";
import { formatDate } from "./ExpenseList";
import colors from "../../constants/colors";

function ExpenseItem({ isFirstInGroup, item, total, isLastGroup, isLastItem }) {
  return (
    <View
      style={
        (styles.expenseItemContainer,
        isLastGroup && isLastItem
          ? styles.lastGroup
          : isLastItem
          ? styles.lastItem
          : null)
      }
    >
      {isFirstInGroup && (
        <View style={styles.dateExpenseContainer}>
          <Text style={styles.dateHeader}>{formatDate(item.date)}</Text>
          <Text style={styles.dateHeader}>${total}</Text>
        </View>
      )}
      <View style={styles.dayExpenseContainer}>
        <View style={styles.typeTitleContainer}>
          <Image
            source={
              item.type === "Groceries"
                ? require("../../assets/Groceries.png")
                : item.type === "Housing"
                ? require("../../assets/Housing.png")
                : require("../../assets/Utilities.png")
            }
            style={styles.imageStyle}
          />
          <Text style={styles.dayExpenseTitle}>{item.title}</Text>
          <Text style={styles.dayExpenseType}> ({item.type})</Text>
        </View>
        <Text style={styles.dayExpenseTitle}>${item.total}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  expenseItemContainer: {
    flex: 1,
    marginBottom: 12,
  },
  dateExpenseContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 35,
    borderBottomColor: colors.gray400,
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginBottom: 6,
  },
  dateHeader: {
    color: colors.gray700,
    fontFamily: "ubuntu-light",
  },
  dayExpenseContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    alignContent: "center",
  },
  dayExpenseTitle: {
    color: colors.gray950,
    fontSize: 16,
  },
  dayExpenseType: {
    color: colors.gray700,
    fontSize: 16,
  },
  typeTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  imageStyle: {
    height: 25,
    width: 25,
    marginRight: 15,
  },
  lastGroup: {
    marginBottom: 12,
  },
  lastItem: {
    marginBottom: 20,
  },
});

export default ExpenseItem;
