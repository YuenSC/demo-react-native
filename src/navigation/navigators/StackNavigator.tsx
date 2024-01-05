import { AntDesign } from "@expo/vector-icons";
import { makeStyles, useTheme } from "@rneui/themed";
import { memo } from "react";
import { TouchableOpacity } from "react-native";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";

import Device from "@/constants/Device";
import AppSuggestionDetailScreen from "@/screens/AppSuggestionDetailScreen";
import ChatDetailScreen from "@/screens/ChatDetailScreen";
import HomeScreen from "@/screens/HomeScreen";
import ProfileScreen from "@/screens/ProfileScreen";
import { IStackParamList } from "@/types/navigation";

const Stack = createSharedElementStackNavigator<IStackParamList>();

const StackNavigator = memo(() => {
  const styles = useStyles();
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        gestureResponseDistance: Device.screen.width,
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerStyle: styles.headerStyle,
          headerTitleStyle: styles.headerTitleStyle,
          headerShadowVisible: false,
          headerLeft: ({ onPress }) => (
            <TouchableOpacity onPress={onPress} style={styles.headerLeft}>
              <AntDesign name="left" size={24} color={theme.colors.white} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="ChatDetail"
        component={ChatDetailScreen}
        options={{
          presentation: "transparentModal",
          headerTransparent: true,
          headerLeft: () => null,
          headerTitle: "",
        }}
      />
      <Stack.Screen
        name="AppSuggestionDetail"
        component={AppSuggestionDetailScreen}
        options={{
          headerTransparent: true,
        }}
        sharedElements={(route, otherRoute, showing) => {
          const { id } = route.params;
          return [
            {
              id: `appSuggestion.${id}.photo`,
              animation: "fade",
            },
          ];
        }}
      />
    </Stack.Navigator>
  );
});

const useStyles = makeStyles((theme) => ({
  headerStyle: {
    backgroundColor: theme.colors.black,
    borderBottomWidth: 0,
  },
  headerTitleStyle: {
    color: theme.colors.white,
  },
  headerLeft: {
    marginLeft: theme.spacing.xs,
  },
}));

StackNavigator.displayName = "StackNavigator";
export default StackNavigator;
