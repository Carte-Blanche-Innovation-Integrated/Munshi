import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

function LoadingOverlay({ message, custStyles }) {
  return (
    <View style={styles.rootContainer}>
      <Text style={[styles.message, custStyles && custStyles]}>{message}</Text>
      <ActivityIndicator size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    color: "white",
  },
  message: {
    fontSize: 16,
    marginBottom: 12,
    color: "white",
  },
});

export default LoadingOverlay;
