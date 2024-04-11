import { AntDesign } from "@expo/vector-icons";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { Button, makeStyles, Text, useTheme } from "@rneui/themed";
import { memo } from "react";
import { TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

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

  const currentGroup = useAppSelector(currentGroupSelector);
  const dispatch = useAppDispatch();

  return (
    <SafeAreaView style={styles.container}>
      <Text h2 style={{ marginBottom: 16 }}>
        Groups
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
                navigation.navigate("GroupForm", { step: 0 });
              }}
            >
              <AntDesign
                name="addusergroup"
                size={24}
                color={theme.colors.primary}
              />
              Add Group
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
        <Text>Version 1.0.0</Text>
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
