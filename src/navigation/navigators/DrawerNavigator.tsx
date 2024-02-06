import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { makeStyles, useTheme } from "@rneui/themed";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";

import DrawerContent from "../DrawerContent";

import { useAppSelector } from "@/hooks/reduxHook";
import GroupDetailScreen from "@/screens/GroupDetailScreen";
import { IDrawerParamList } from "@/types/navigation";

const Drawer = createDrawerNavigator<IDrawerParamList>();

const DrawerNavigator = () => {
  const styles = useStyles();
  const { theme } = useTheme();
  const firstGroupId = useAppSelector((state) => state.groups?.groups?.[0]?.id);

  return (
    <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
      <Drawer.Screen
        name="GroupDetail"
        component={GroupDetailScreen}
        initialParams={{ id: firstGroupId }}
        options={{
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
              </View>
            );
          },
        }}
      />
    </Drawer.Navigator>
  );
};

const useStyles = makeStyles((theme) => ({
  headerRight: {
    marginRight: 16,
  },
}));

export default DrawerNavigator;
