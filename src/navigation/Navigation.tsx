import { NavigationContainer } from "@react-navigation/native";
import { memo } from "react";

import MainNavigation from "./navigators/MainNavigation";

const Navigation = memo(() => (
  <NavigationContainer>
    <MainNavigation />
  </NavigationContainer>
));

Navigation.displayName = "Navigation";

export default Navigation;
