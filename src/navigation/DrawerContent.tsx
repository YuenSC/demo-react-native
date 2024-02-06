import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { useRoute } from "@react-navigation/native";
import { makeStyles, Text } from "@rneui/themed";
import { memo } from "react";
import { TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppSelector } from "@/hooks/reduxHook";

type IDrawerContentProps = DrawerContentComponentProps;

const DrawerContent = memo<IDrawerContentProps>(({ state }) => {
  const styles = useStyles();
  const groups = useAppSelector((state) => state.groups.groups);
  const { params } = useRoute();
  const groupId = (params as { id?: string })?.id;

  return (
    <SafeAreaView style={styles.container}>
      <Text h2 style={{ marginBottom: 16 }}>
        Groups (TBC)
      </Text>
      <FlatList
        data={groups}
        bounces={false}
        renderItem={({ item }) => {
          const isCurrentGroupSelected = item.id === groupId;
          console.log("isCurrentGroupSelected", isCurrentGroupSelected);
          return (
            <TouchableOpacity style={styles.group}>
              <Text>{item.name}</Text>
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
    margin: 16,
  },
  group: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.grey5,
  },
}));

DrawerContent.displayName = "DrawerContent";

export default DrawerContent;
