import { NavigationContainer } from "@react-navigation/native";
import { memo } from "react";
import { StyleSheet } from "react-native";
import StackNavigator from "./navigators/StackNavigator";

const Navigation = memo(() => (
  <NavigationContainer>
    <StackNavigator />
  </NavigationContainer>
));

const styles = StyleSheet.create({});

Navigation.displayName = "Navigation";

export default Navigation;
