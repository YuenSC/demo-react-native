import { AntDesign } from "@expo/vector-icons";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { Button, Text, makeStyles, useTheme } from "@rneui/themed";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import Config from "@/Config";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHook";
import {
  currentGroupSelector,
  setCurrentGroupId,
} from "@/store/reducers/groups";

type IDrawerContentProps = DrawerContentComponentProps;

const DrawerContent = memo<IDrawerContentProps>(({ state }) => {
  const styles = useStyles();
  const groups = useAppSelector((state) => state.groups.groups);
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { t } = useTranslation();

  const currentGroup = useAppSelector(currentGroupSelector);
  const dispatch = useAppDispatch();

  return (
    <SafeAreaView style={styles.container}>
      <Text h2 style={{ marginBottom: 16 }}>
        {t("DrawerContent:groups")}
      </Text>
      <FlatList
        data={groups}
        bounces={false}
        contentContainerStyle={styles.contentContainer}
        ListFooterComponent={() => {
          return (
            <Button
              type="clear"
              size="sm"
              onPress={() => {
                navigation.navigate("GroupForm", {
                  step: 0,
                  shouldEditUserList: true,
                });
              }}
            >
              <AntDesign
                name="addusergroup"
                size={24}
                color={theme.colors.primary}
              />
              {t("DrawerContent:add-group")}
            </Button>
          );
        }}
        renderItem={({ item }) => {
          const isCurrentGroupSelected = item.id === currentGroup?.id;
          return (
            <TouchableOpacity
              style={[
                styles.group,
                isCurrentGroupSelected && styles.groupSelected,
              ]}
              onPress={() => dispatch(setCurrentGroupId(item.id))}
            >
              <Text
                style={[isCurrentGroupSelected && styles.groupNameSelected]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
      <View>
        <Text>
          {t("DrawerContent:version", {
            version: Config.version,
          })}
        </Text>
      </View>
    </SafeAreaView>
  );
});

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    gap: 16,
    paddingBottom: 32,
  },
  group: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.modal,
  },
  groupSelected: {
    backgroundColor: theme.colors.primary,
  },
  groupNameSelected: {
    color: theme.colors.white,
    fontWeight: "bold",
  },
}));

DrawerContent.displayName = "DrawerContent";

export default DrawerContent;
