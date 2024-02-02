import { memo } from "react";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";

import Device from "@/constants/Device";
import CreateGroupScreen from "@/screens/CreateGroupScreen";
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
        component={CreateGroupScreen}
        name="CreateGroup"
        options={{
          presentation: "modal",
          headerLeft: () => null,
          headerTitle: "Create Group",
        }}
      />
      <Stack.Screen component={SampleScreen} name="Drawer" />
    </Stack.Navigator>
  );
});

StackNavigator.displayName = "StackNavigator";
export default StackNavigator;
