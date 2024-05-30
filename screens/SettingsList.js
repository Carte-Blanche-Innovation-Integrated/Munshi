import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../constants/colors";

function SettingsList({ settingsList }) {
  return (
    <View style={styles.rootContainer}>
      <FlatList
        howsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        data={settingsList}
        renderItem={({ item, index }) => {
          return (
            <View
              style={[
                styles.listItem,
                index !== settingsList.length - 1 && styles.borderBottom,
              ]}
            >
              <View style={styles.logoTitleContainer}>
                <View style={item.bgStyles && item.bgStyles}>{item.icon}</View>
                <Text style={styles.titleText}>{item.title}</Text>
              </View>
              <View style={styles.selectionIconContainer}>
                <Text style={styles.selectionText}>{item.selection}</Text>
                <Pressable>
                  <Ionicons
                    //onPress={onAddPressHandler}
                    name="chevron-forward-outline"
                    size={18}
                    color={colors.gray600}
                  />
                </Pressable>
              </View>
            </View>
          );
        }}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    backgroundColor: "white",
    marginVertical: 20,
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  titleText: {
    fontFamily: "ubuntu-regular",
    fontSize: 18,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  selectionText: {
    color: colors.gray700,
    fontSize: 12,
  },
  logoTitleContainer: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  selectionIconContainer: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  borderBottom: {
    borderBottomColor: colors.gray400,
    borderBottomWidth: 1,
  },
});

export default SettingsList;
