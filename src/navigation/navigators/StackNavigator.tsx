import { createStackNavigator } from "@react-navigation/stack";
import { memo } from "react";

import DrawerNavigator from "./DrawerNavigator";

import Device from "@/constants/Device";
import { useAppSelector } from "@/hooks/reduxHook";
import SampleScreen from "@/screens/SampleScreen";
import EditMemberScreen from "@/screens/stack/EditMemberScreen";
import GroupAddMemberScreen from "@/screens/stack/GroupAddMemberScreen";
import OnboardingScreen from "@/screens/stack/OnboardingScreen";
import PaymentFormScreen from "@/screens/stack/PaymentFormScreen";
import PaymentRecordFilterScreen from "@/screens/stack/PaymentRecordFilterScreen";
import SignUpSuccessBottomSheetModal from "@/screens/stack/SignUpSuccessBottomSheetModal";
import WelcomeScreen from "@/screens/stack/WelcomeScreen";
import { IStackParamList } from "@/types/navigation";

const Stack = createStackNavigator<IStackParamList>();

const StackNavigator = memo(() => {
  const isInitialSetupDone = useAppSelector(
    (state) => !!state.profile.id && !!state.groups?.groups?.[0]?.id,
  );

  return (
    <Stack.Navigator
      initialRouteName={isInitialSetupDone ? "Drawer" : "Welcome"}
      screenOptions={{
        gestureResponseDistance: Device.screen.width,
        headerBackTitle: "",
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
        component={DrawerNavigator}
        name="Drawer"
        options={{ headerShown: false }}
      />

      {/* Bottom Sheet */}
      <Stack.Group
        screenOptions={{
          presentation: "transparentModal",
          headerShown: false,
        }}
      >
        <Stack.Screen
          component={SignUpSuccessBottomSheetModal}
          name="SignUpSuccessBottomSheetModal"
        />
        <Stack.Screen
          component={PaymentRecordFilterScreen}
          name="PaymentRecordFilter"
        />
      </Stack.Group>

      {/* Modal */}
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen
          component={GroupAddMemberScreen}
          name="GroupAddMember"
          options={{ title: "Configuration" }}
        />

        <Stack.Screen component={EditMemberScreen} name="EditMember" />

        <Stack.Screen component={PaymentFormScreen} name="AddPayment" />
        <Stack.Screen component={PaymentFormScreen} name="EditPayment" />
        <Stack.Screen component={SampleScreen} name="MemberList" />
      </Stack.Group>
    </Stack.Navigator>
  );
});

StackNavigator.displayName = "StackNavigator";
export default StackNavigator;
