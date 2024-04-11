import { createDrawerNavigator } from "@react-navigation/drawer";
import { useTheme } from "@rneui/themed";

import BottomTabNavigator from "./BottomTabNavigator";
import DrawerContent from "../DrawerContent";

import { IDrawerParamList } from "@/types/navigation";

const Drawer = createDrawerNavigator<IDrawerParamList>();

const DrawerNavigator = () => {
  // const styles = useStyles();
  const { theme } = useTheme();

  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.black,
      }}
      drawerContent={(props) => <DrawerContent {...props} />}
    >
      <Drawer.Screen
        name="BottomTab"
        component={BottomTabNavigator}
        options={({ navigation }) => ({
          headerShown: false,
          headerTitle: "",
        })}
      />
    </Drawer.Navigator>
  );
};

// const useStyles = makeStyles((theme) => ({
//   headerRight: {
//     marginRight: 16,
//     flexDirection: "row",
//     gap: 16,
//   },
// }));

export default DrawerNavigator;
