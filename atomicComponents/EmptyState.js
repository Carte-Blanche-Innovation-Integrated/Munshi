import { Image, Text, View, StyleSheet } from "react-native";
import colors from "../constants/colors";

function EmptyState({ message }) {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/empty.png")}
        style={styles.imageStyle}
      />
      <Text style={styles.messageText}>{message}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  messageText: {
    color: colors.gray700,
  },
  imageStyle: { height: 150, width: 150, alignSelf: "center" },
  container: {
    alignItems: "center",
    gap: 10,
  },
});

export default EmptyState;
