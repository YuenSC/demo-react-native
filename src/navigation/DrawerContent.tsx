import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { makeStyles, Text } from "@rneui/themed";
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
        <TouchableOpacity>
          <Text>Add Group</Text>
        </TouchableOpacity>

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
  group: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.grey5,
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
