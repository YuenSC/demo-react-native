import { memo } from "react";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";

import AppSuggestionDetailScreen from "@/screens/AppSuggestionDetailScreen";
import HomeScreen from "@/screens/HomeScreen";
import ProfileScreen from "@/screens/ProfileScreen";
import { IStackParamList } from "@/types/navigation";

const Stack = createSharedElementStackNavigator<IStackParamList>();

const StackNavigator = memo(() => (
  <Stack.Navigator>
    <Stack.Screen
      name="Home"
      component={HomeScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen name="Profile" component={ProfileScreen} />
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
