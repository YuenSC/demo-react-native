import { memo } from "react";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";

import DrawerNavigator from "./DrawerNavigator";

import Device from "@/constants/Device";
import { useAppSelector } from "@/hooks/reduxHook";
import AddPaymentScreen from "@/screens/AddPaymentScreen";
import EditMemberScreen from "@/screens/EditMemberScreen";
import OnboardingScreen from "@/screens/OnboardingScreen";
import SignUpSuccessBottomSheetModal from "@/screens/SignUpSuccessBottomSheetModal";
import WelcomeScreen from "@/screens/WelcomeScreen";
import { IStackParamList } from "@/types/navigation";

const Stack = createSharedElementStackNavigator<IStackParamList>();

const StackNavigator = memo(() => {
  const isInitialSetupDone = useAppSelector(
    (state) => !!state.profile.id && !!state.groups?.groups?.[0]?.id
  );

  return (
    <Stack.Navigator
      initialRouteName={
        isInitialSetupDone ? "SignUpSuccessBottomSheetModal" : "Welcome"
      }
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
      <Stack.Screen
        component={EditMemberScreen}
        name="EditMember"
        options={{
          headerShown: false,
          presentation: "modal",
        }}
      />
      <Stack.Screen
        component={AddPaymentScreen}
        name="AddPayment"
        options={{
          presentation: "modal",
        }}
      />
      <Stack.Screen
        component={DrawerNavigator}
        name="Drawer"
        options={{ headerShown: false }}
      />

      <Stack.Screen
        component={SignUpSuccessBottomSheetModal}
        name="SignUpSuccessBottomSheetModal"
        options={{
          presentation: "transparentModal",
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
});

StackNavigator.displayName = "StackNavigator";
export default StackNavigator;
