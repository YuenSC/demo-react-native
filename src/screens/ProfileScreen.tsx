import { makeStyles } from "@rneui/themed";
import { useState } from "react";
import { Text, View, useWindowDimensions } from "react-native";
import { SceneMap, TabView } from "react-native-tab-view";

import StyledText from "@/components/common/StyledText";
import ProfileHeader from "@/components/profile/ProfileHeader";
import UserStoryButton from "@/components/user/UserStoryButton";
import { users } from "@/data/users";
import { IStackScreenProps } from "@/types/navigation";

const FirstRoute = () => (
  <View style={{ flex: 1, backgroundColor: "#ff4081" }} />
);

const SecondRoute = () => (
  <View style={{ flex: 1, backgroundColor: "#673ab7" }} />
);

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
});

const ProfileScreen = ({
  route: {
    params: { userId },
  },
}: IStackScreenProps<"Profile">) => {
  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "first", title: "First" },
    { key: "second", title: "Second" },
  ]);

  const styles = useStyles();
  const user = users.find((user) => user.id === userId);

  if (!user) return null;

  return (
    <View style={styles.container}>
      <ProfileHeader user={user} />
      <Text>ProfileScreen</Text>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
    </View>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.black,
    paddingHorizontal: theme.spacing.sm,
  },
}));

export default ProfileScreen;
