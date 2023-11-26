import AppSuggestionDetailScreen from "@/screens/AppSuggestionDetailScreen";
import { IRootStackParamList } from "@/types/navigation";
import { memo } from "react";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import MainNavigation from "./MainNavigation";

const Stack = createSharedElementStackNavigator<IRootStackParamList>();

const StackNavigator = memo(() => (
  <Stack.Navigator>
    <Stack.Screen
      name="Root"
      component={MainNavigation}
      options={{ headerShown: false }}
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
));

StackNavigator.displayName = "StackNavigator";
export default StackNavigator;
