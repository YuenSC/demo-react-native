import { NavigationContainer } from "@react-navigation/native";
import { memo } from "react";

import StackNavigator from "./navigators/StackNavigator";

const Navigation = memo(() => (
  <NavigationContainer>
    <StackNavigator />
  </NavigationContainer>
));

Navigation.displayName = "Navigation";

export default Navigation;
