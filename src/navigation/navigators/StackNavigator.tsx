import { createStackNavigator } from "@react-navigation/stack";
import { Text, useTheme } from "@rneui/themed";
import { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, View } from "react-native";
import {
  AdEventType,
  AppOpenAd,
  InterstitialAd,
} from "react-native-google-mobile-ads";

import DrawerNavigator from "./DrawerNavigator";

import Config from "@/Config";
import Device from "@/constants/Device";
import { useAppSelector } from "@/hooks/reduxHook";
import SampleScreen from "@/screens/SampleScreen";
import EditMemberScreen from "@/screens/stack/EditMemberScreen";
import GroupCreateSuccessBottomSheet from "@/screens/stack/GroupCreateSuccessBottomSheet";
import GroupDeleteBottomSheet from "@/screens/stack/GroupDeleteBottomSheet";
import GroupDeletePaymentRecordBottomSheet from "@/screens/stack/GroupDeletePaymentRecordBottomSheet";
import GroupExistingUserSelectBottomSheet from "@/screens/stack/GroupExistingUserSelectBottomSheet";
import GroupFormScreen from "@/screens/stack/GroupFormScreen";
import GroupSummaryScreen from "@/screens/stack/GroupSummaryScreen";
import LanguageScreen from "@/screens/stack/LanguageScreen";
import OnboardingScreen from "@/screens/stack/OnboardingScreen";
import PaymentFormCurrencySelectBottomSheet from "@/screens/stack/PaymentFormCurrencySelectBottomSheet";
import PaymentFormDatePickerBottomSheet from "@/screens/stack/PaymentFormDatePickerBottomSheet";
import PaymentFormScreen from "@/screens/stack/PaymentFormScreen";
import PaymentRecordFilterScreen from "@/screens/stack/PaymentRecordFilterScreen";
import UserDeleteBottomSheet from "@/screens/stack/UserDeleteBottomSheet";
import UserListScreen from "@/screens/stack/UserListScreen";
import WelcomeScreen from "@/screens/stack/WelcomeScreen";
import { IStackParamList } from "@/types/navigation";

const Stack = createStackNavigator<IStackParamList>();

const interstitialAd = InterstitialAd.createForAdRequest(
  Config.adInterstitialUnitId,
);

const StackNavigator = memo(() => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [loaded, setLoaded] = useState(false);

  const isInitialSetupDone = useAppSelector(
    (state) => !!state.profile.userId && !!state.groups?.groups?.[0]?.id,
  );

  const isFirstPaymentDone = useAppSelector((state) =>
    state.groups.groups.some((group) => group.paymentRecords.length > 0),
  );

  useEffect(() => {
    const unsubscribe = interstitialAd.addAdEventListener(
      AdEventType.LOADED,
      () => {
        interstitialAd.show();
        setLoaded(true);
      },
    );

    // Start loading the interstitial straight away
    if (isFirstPaymentDone) {
      interstitialAd.load();
    } else {
      setLoaded(true);
    }

    // Unsubscribe from events on unmount
    return unsubscribe;
  }, [isFirstPaymentDone]);

  if (!loaded) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
          justifyContent: "center",
          alignItems: "center",
          gap: 16,
        }}
      >
        <ActivityIndicator size="large" color={theme.colors.black} />
        <Text>{t("StackNavigator:loading-interstitial-ad")}</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={isInitialSetupDone ? "Drawer" : "Welcome"}
      screenOptions={{
        gestureResponseDistance: Device.screen.width,
        headerBackTitle: "",
        headerStyle: { backgroundColor: theme.colors.background },
        headerTitleStyle: { color: theme.colors.black },
        headerBackTitleStyle: { color: theme.colors.black },
        headerTintColor: theme.colors.black,
        headerTruncatedBackTitle: t("Common:back"),
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
      <Stack.Screen
        component={GroupSummaryScreen}
        name="GroupSummary"
        options={{
          headerTitle: t("StackNavigator:group-summary"),
        }}
      />
      <Stack.Screen
        component={GroupFormScreen}
        name="GroupForm"
        options={{ headerTitle: "" }}
      />

      <Stack.Screen
        component={LanguageScreen}
        name="Language"
        options={{ headerTitle: "" }}
      />

      {/* Bottom Sheet */}
      <Stack.Group
        screenOptions={{
          presentation: "transparentModal",
          headerShown: false,
        }}
      >
        <Stack.Screen
          component={GroupCreateSuccessBottomSheet}
          name="GroupCreateSuccessBottomSheet"
        />
        <Stack.Screen
          component={UserDeleteBottomSheet}
          name="UserDeleteBottomSheet"
        />
        <Stack.Screen
          component={PaymentRecordFilterScreen}
          name="PaymentRecordFilter"
        />
        <Stack.Screen
          component={GroupDeletePaymentRecordBottomSheet}
          name="GroupDeletePaymentRecordBottomSheet"
        />
        <Stack.Screen
          component={PaymentFormDatePickerBottomSheet}
          name="PaymentFormDatePickerBottomSheet"
        />
        <Stack.Screen
          component={PaymentFormCurrencySelectBottomSheet}
          name="PaymentFormCurrencySelectBottomSheet"
        />
        <Stack.Screen
          component={GroupExistingUserSelectBottomSheet}
          name="GroupExistingUserSelectBottomSheet"
        />
        <Stack.Screen
          component={GroupDeleteBottomSheet}
          name="GroupDeleteBottomSheet"
        />
      </Stack.Group>

      <Stack.Screen
        component={UserListScreen}
        name="UserList"
        options={{ title: t("StackNavigator:users") }}
      />

      {/* Modal */}
      <Stack.Group
        screenOptions={{
          presentation: "modal",
          headerStyle: { backgroundColor: theme.colors.modal },
        }}
      >
        <Stack.Screen
          component={EditMemberScreen}
          name="EditMember"
          options={{
            headerTitle: "",
          }}
        />
        <Stack.Screen component={PaymentFormScreen} name="AddPayment" />
        <Stack.Screen component={PaymentFormScreen} name="EditPaymentModal" />
      </Stack.Group>
    </Stack.Navigator>
  );
});

StackNavigator.displayName = "StackNavigator";
export default StackNavigator;
