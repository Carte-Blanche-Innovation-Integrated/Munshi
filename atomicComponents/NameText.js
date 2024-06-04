import { Text, StyleSheet } from "react-native";
import colors from "../constants/colors";

function NameText({ name }) {
  return <Text style={styles.nameText}>{name}</Text>;
}

const styles = StyleSheet.create({
  nameText: {
    fontSize: 12,
    marginBottom: 8,
    color: colors.primary900,
    fontFamily: "ubuntu-medium",
  },
});

export default NameText;
