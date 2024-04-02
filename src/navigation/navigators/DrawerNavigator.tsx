import { FontAwesome, AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { makeStyles, useTheme } from "@rneui/themed";
import { TouchableOpacity, View } from "react-native";

import BottomTabNavigator from "./BottomTabNavigator";
import DrawerContent from "../DrawerContent";

import { CurrentGroupProvider } from "@/context/currentGroup";
import { useAppSelector } from "@/hooks/reduxHook";
import { IDrawerParamList } from "@/types/navigation";

const Drawer = createDrawerNavigator<IDrawerParamList>();

const DrawerNavigator = () => {
  const styles = useStyles();
  const { theme } = useTheme();
  const firstGroupId = useAppSelector((state) => state.groups?.groups?.[0]?.id);

  return (
    <CurrentGroupProvider>
      <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
        <Drawer.Screen
          name="BottomTab"
          component={BottomTabNavigator}
          options={({ navigation }) => ({
            headerRight: () => {
              return (
                <View style={styles.headerRight}>
                  <TouchableOpacity onPress={() => AsyncStorage.clear()}>
                    <FontAwesome
                      name="undo"
                      size={24}
                      color={theme.colors.warning}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("GroupConfig", {
                        groupId: firstGroupId,
                      })
                    }
                  >
                    <AntDesign
                      name="setting"
                      size={24}
                      color={theme.colors.secondary}
                    />
                  </TouchableOpacity>
                </View>
              );
            },
            headerTitle: "",
          })}
        />
      </Drawer.Navigator>
    </CurrentGroupProvider>
  );
};

const useStyles = makeStyles((theme) => ({
  headerRight: {
    marginRight: 16,
    flexDirection: "row",
    gap: 16,
  },
}));

export default DrawerNavigator;
