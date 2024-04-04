import { FontAwesome, AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Text, makeStyles, useTheme } from "@rneui/themed";
import { TouchableOpacity, View } from "react-native";

import BottomTabNavigator from "./BottomTabNavigator";
import DrawerContent from "../DrawerContent";

import { useAppDispatch, useAppSelector } from "@/hooks/reduxHook";
import {
  addPaymentRecord,
  currentGroupSelector,
} from "@/store/reducers/groups";
import { BillCategoryEnum } from "@/types/BillCategories";
import { PaymentRecordCreate } from "@/types/PaymentRecord";
import { IDrawerParamList } from "@/types/navigation";

const Drawer = createDrawerNavigator<IDrawerParamList>();

const DrawerNavigator = () => {
  const styles = useStyles();
  const { theme } = useTheme();

  const currentGroup = useAppSelector(currentGroupSelector);
  const dispatch = useAppDispatch();

  return (
    <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
      <Drawer.Screen
        name="BottomTab"
        component={BottomTabNavigator}
        options={({ navigation }) => ({
          headerRight: () => {
            return (
              <View style={styles.headerRight}>
                <TouchableOpacity
                  onPress={() => {
                    const currentMembers = currentGroup?.members;
                    if (!currentMembers || currentMembers.length < 2) {
                      return;
                    }

                    const generateRandomPaymentRecord = (index: number) => {
                      const userIndexes = Array.from(
                        Array(currentMembers.length).keys(),
                      );
                      const payerIndex =
                        userIndexes[
                          Math.floor(Math.random() * userIndexes.length)
                        ];

                      const currentDate = new Date();
                      currentDate.setDate(
                        currentDate.getDate() - Math.floor(Math.random() * 365),
                      );
                      currentDate.setMinutes(Math.floor(Math.random() * 60));
                      currentDate.setHours(Math.floor(Math.random() * 24));

                      const randomCategory =
                        Object.values(BillCategoryEnum)[
                          Math.floor(
                            Math.random() *
                              Object.values(BillCategoryEnum).length,
                          )
                        ];

                      const paymentRecord = {
                        groupId: currentGroup?.id,
                        amount: Math.floor(Math.random() * 1000),
                        category: randomCategory,
                        comment: "Random Payment " + index,
                        date: currentDate.toISOString(),
                        currencyCode: index % 2 === 0 ? "JPY" : "HKD",
                        payers: [
                          { amount: "auto", id: currentMembers[payerIndex].id },
                        ],
                        payees: currentMembers.map((member) => ({
                          amount: "auto",
                          id: member.id,
                        })),
                      } satisfies PaymentRecordCreate;

                      dispatch(addPaymentRecord(paymentRecord));
                    };

                    Array.from(Array(10).keys()).forEach((index) =>
                      generateRandomPaymentRecord(index),
                    );
                  }}
                >
                  <AntDesign
                    name="plus"
                    size={24}
                    color={theme.colors.primary}
                  />
                </TouchableOpacity>
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
                      groupId: currentGroup?.id,
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
