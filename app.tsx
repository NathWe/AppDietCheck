import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { AppRegistry } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./app/(tabs)/index";
import ScanScreen from "./app/screens/ScanScreen";
import ExploreScreen from "./app/(tabs)/explore";
import SignUpScreen from "./app/screens/SignUpScreen";
import SignInScreen from "./app/screens/SignInScreen";
import ForgotPasswordScreen from "./app/screens/ForgotPasswordScreen";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./app/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Tab = createBottomTabNavigator();

const App = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="ScanScreen" component={ScanScreen} />
        <Tab.Screen name="Explore">
          {() => (user ? <ExploreScreen /> : <SignInScreen />)}
        </Tab.Screen>
        <Tab.Screen name="SignUp" component={SignUpScreen} />
        <Tab.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

AppRegistry.registerComponent("main", () => App);

export default App;
