import { memo } from "react";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";

import Device from "@/constants/Device";
import OnboardingScreen from "@/screens/OnboardingScreen";
import SampleScreen from "@/screens/SampleScreen";
import WelcomeScreen from "@/screens/WelcomeScreen";
import { IStackParamList } from "@/types/navigation";

const Stack = createSharedElementStackNavigator<IStackParamList>();

const StackNavigator = memo(() => {
  return (
    <Stack.Navigator
      screenOptions={{
        gestureResponseDistance: Device.screen.width,
      }}
    >
      <Stack.Screen
        component={WelcomeScreen}
        name="Welcome"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        component={OnboardingScreen}
        name="Onboarding"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen component={SampleScreen} name="Drawer" />
    </Stack.Navigator>
  );
});

StackNavigator.displayName = "StackNavigator";
export default StackNavigator;
