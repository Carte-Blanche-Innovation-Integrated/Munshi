import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import Expense from "./screens/Expense";
import Reports from "./screens/Reports";
import Settings from "./screens/Settings";
import colors from "./constants/colors";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "./firebaseConfig";
import { useState } from "react";
import { useFonts } from "expo-font";
import Ionicons from "@expo/vector-icons/Ionicons";

import AppLoading from "expo-app-loading";

console.disableYellowBox = true;

const Tab = createBottomTabNavigator();

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.primary900 },
          headerTintColor: "white",
          contentStyle: { backgroundColor: colors.primary100 },
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function AuthenticatedStack() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Weekly Report"
        screenOptions={({ route }) => ({
          headerStyle: { backgroundColor: colors.primary900 },
          headerTintColor: "white",
          contentStyle: { backgroundColor: colors.primary900 },
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === "Expense Log") {
              iconName = focused ? "file-tray-full" : "file-tray-full-outline";
            } else if (route.name === "Weekly Report") {
              iconName = focused ? "stats-chart" : "stats-chart-outline";
            } else if (route.name === "Settings") {
              iconName = focused ? "settings" : "settings-outline";
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: colors.primary900,
          tabBarInactiveTintColor: colors.gray700,
          tabBarShowLabel: false,
        })}
      >
        <Tab.Screen name="Expense Log" component={Expense} />
        <Tab.Screen name="Weekly Report" component={Reports} />
        <Tab.Screen name="Settings" component={Settings} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

function Navigation() {
  const auth = getAuth(app);
  const [isLoggedIn, setIsLoggedIn] = useState(undefined);

  onAuthStateChanged(auth, (user) => setIsLoggedIn(!!user));

  if (isLoggedIn === undefined) return null;

  return isLoggedIn ? <AuthenticatedStack /> : <AuthStack />;
}

export default function App() {
  const [fontsLoaded] = useFonts({
    "ubuntu-bold": require("./assets/fonts/Ubuntu-Bold.ttf"),
    "ubuntu-light": require("./assets/fonts/Ubuntu-Light.ttf"),
    "ubuntu-medium": require("./assets/fonts/Ubuntu-Medium.ttf"),
    "ubuntu-regular": require("./assets/fonts/Ubuntu-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <>
      <StatusBar style="light" />
      <Navigation />
    </>
  );
}
