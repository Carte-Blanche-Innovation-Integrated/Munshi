import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../constants/colors";
import SettingsList from "./SettingsList";
import { Crown } from "lucide-react-native";
import { SunMoon } from "lucide-react-native";
import { Gift } from "lucide-react-native";
import { BellRing } from "lucide-react-native";
import { DollarSign } from "lucide-react-native";
import { Globe } from "lucide-react-native";
import { getAuth, signOut } from "firebase/auth";
import {
  BookCopy,
  CreditCard,
  List,
  Download,
  Upload,
  CircleX,
} from "lucide-react-native";

function Settings() {
  const auth = getAuth();
  const user = auth.currentUser;
  function onLogoutPressHandler() {
    signOut(auth);
  }
  return (
    <View style={styles.rootContainer}>
      <View style={styles.logoutButtonContainer}>
        <Text style={styles.nameText}>{user.displayName}</Text>
        <Pressable>
          <Ionicons
            onPress={onLogoutPressHandler}
            name="log-out-outline"
            size={25}
            color={colors.primary600}
          />
        </Pressable>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <SettingsList
          settingsList={[
            {
              title: "Unlock Premium",
              //selection: "",
              id: "1",
              icon: <Crown color="white" size={22} />,
              bgStyles: {
                backgroundColor: "#AC55DA",
                padding: 7,
                borderRadius: 6,
              },
            },
          ]}
        />
        <SettingsList
          settingsList={[
            {
              title: "Appearance",
              selection: "Light Mode",
              id: "1",
              icon: <SunMoon color="white" size={22} />,
              bgStyles: {
                backgroundColor: "#5F596D",
                padding: 7,
                borderRadius: 6,
              },
            },
            {
              title: "App Icons",
              //selection: "",
              id: "2",
              icon: <Gift color="white" size={22} />,
              bgStyles: {
                backgroundColor: "#FD9401",
                padding: 7,
                borderRadius: 6,
              },
            },
            {
              title: "Notifications",
              selection: "Every Morning",
              id: "3",
              icon: <BellRing color="white" size={22} />,
              bgStyles: {
                backgroundColor: "#FF2C55",
                padding: 7,
                borderRadius: 6,
              },
            },
            {
              title: "Common Currency",
              selection: "PKR",
              id: "4",
              icon: <DollarSign color="white" size={22} />,
              bgStyles: {
                backgroundColor: "#2BCF55",
                padding: 7,
                borderRadius: 6,
              },
            },
            {
              title: "Language",
              selection: "Engligh",
              id: "5",
              icon: <Globe color="white" size={22} />,
              bgStyles: {
                backgroundColor: "#3AA9E7",
                padding: 7,
                borderRadius: 6,
              },
            },
            {
              title: "Pricing Plan",
              selection: "Free",
              id: "6",
              icon: <BookCopy color="white" size={22} />,
              bgStyles: {
                backgroundColor: "#B450DC",
                padding: 7,
                borderRadius: 6,
              },
            },
          ]}
        />
        <SettingsList
          settingsList={[
            {
              title: "Account",
              //selection: "",
              id: "1",
              icon: <CreditCard color="white" size={22} />,
              bgStyles: {
                backgroundColor: "#0C77E8",
                padding: 7,
                borderRadius: 6,
              },
            },
            {
              title: "Categories",
              //selection: "",
              id: "2",
              icon: <List color="white" size={22} />,
              bgStyles: {
                backgroundColor: "#5757D5",
                padding: 7,
                borderRadius: 6,
              },
            },
            {
              title: "Import",
              //selection: "",
              id: "3",
              icon: <Download color="white" size={22} />,
              bgStyles: {
                backgroundColor: "#C6C6C8",
                padding: 7,
                borderRadius: 6,
              },
            },
            {
              title: "Export",
              //selection: "",
              id: "4",
              icon: <Upload color="white" size={22} />,
              bgStyles: {
                backgroundColor: "#B450DC",
                padding: 7,
                borderRadius: 6,
              },
            },
            {
              title: "Erase Data",
              //selection: "",
              id: "5",
              icon: <CircleX color="white" size={22} />,
              bgStyles: {
                backgroundColor: "#FB3D2D",
                padding: 7,
                borderRadius: 6,
              },
            },
          ]}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: colors.gray300,
  },
  logoutButtonContainer: {
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
});

export default Settings;
