import { createStackNavigator } from "@react-navigation/stack";
import { memo } from "react";

import DrawerNavigator from "./DrawerNavigator";

import Device from "@/constants/Device";
import { useAppSelector } from "@/hooks/reduxHook";
import SampleScreen from "@/screens/SampleScreen";
import EditMemberScreen from "@/screens/stack/EditMemberScreen";
import GroupDeletePaymentRecordBottomSheet from "@/screens/stack/GroupDeletePaymentRecordBottomSheet";
import GroupDeleteUserBottomSheet from "@/screens/stack/GroupDeleteUserBottomSheet";
import GroupUserListScreen from "@/screens/stack/GroupUserListScreen";
import OnboardingScreen from "@/screens/stack/OnboardingScreen";
import PaymentFormScreen from "@/screens/stack/PaymentFormScreen";
import PaymentRecordFilterScreen from "@/screens/stack/PaymentRecordFilterScreen";
import SignUpSuccessBottomSheet from "@/screens/stack/SignUpSuccessBottomSheet";
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

      <Stack.Screen component={PaymentFormScreen} name="EditPayment" />

      {/* Bottom Sheet */}
      <Stack.Group
        screenOptions={{
          presentation: "transparentModal",
          headerShown: false,
        }}
      >
        <Stack.Screen
          component={SignUpSuccessBottomSheet}
          name="SignUpSuccessBottomSheet"
        />
        <Stack.Screen
          component={GroupDeleteUserBottomSheet}
          name="GroupDeleteUserBottomSheet"
        />
        <Stack.Screen
          component={PaymentRecordFilterScreen}
          name="PaymentRecordFilter"
        />
        <Stack.Screen
          component={GroupDeletePaymentRecordBottomSheet}
          name="GroupDeletePaymentRecordBottomSheet"
        />
      </Stack.Group>

      {/* Modal */}
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen
          component={GroupUserListScreen}
          name="GroupUserList"
          options={{ title: "Users" }}
        />

        <Stack.Screen component={EditMemberScreen} name="EditMember" />

        <Stack.Screen component={PaymentFormScreen} name="AddPayment" />
        <Stack.Screen component={PaymentFormScreen} name="EditPaymentModal" />
        <Stack.Screen component={SampleScreen} name="MemberList" />
      </Stack.Group>
    </Stack.Navigator>
  );
});

StackNavigator.displayName = "StackNavigator";
export default StackNavigator;
