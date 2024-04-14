import analytics from "@react-native-firebase/analytics";
import {
  NavigationContainer,
  NavigationContainerRef,
} from "@react-navigation/native";
import { memo, useRef } from "react";

import StackNavigator from "./navigators/StackNavigator";

import { IStackParamList } from "@/types/navigation";

const Navigation = memo(() => {
  const routeNameRef = useRef<string | null>(null);
  const navigationRef = useRef<NavigationContainerRef<IStackParamList>>(null);

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        routeNameRef.current =
          navigationRef.current?.getCurrentRoute()?.name || null;
      }}
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.current?.getCurrentRoute()?.name;

        if (!currentRouteName) return;
        if (previousRouteName !== currentRouteName) {
          await analytics().logScreenView({
            screen_name: currentRouteName,
            screen_class: currentRouteName,
          });
        }
        routeNameRef.current = currentRouteName;
      }}
    >
      <StackNavigator />
    </NavigationContainer>
  );
});

Navigation.displayName = "Navigation";

export default Navigation;
