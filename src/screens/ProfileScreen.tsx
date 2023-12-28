import { makeStyles } from "@rneui/themed";
import { useState } from "react";
import { View } from "react-native";

import TabView from "@/components/Tab/TabView";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfilePostList from "@/components/profile/ProfilePostList";
import ProfileVideoList from "@/components/profile/ProfileVideoList";
import { TabProvider } from "@/context/tab";
import { users } from "@/data/users";
import { IStackScreenProps } from "@/types/navigation";

const scenes = {
  posts: ProfilePostList,
  videos: ProfileVideoList,
};

const ProfileScreenContent = ({
  route: {
    params: { userId },
  },
}: IStackScreenProps<"Profile">) => {
  const styles = useStyles();
  const user = users.find((user) => user.id === userId);

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "posts", title: "Posts" },
    { key: "videos", title: "Videos" },
  ]);

  if (!user) return null;

  return (
    <View style={styles.container}>
      <ProfileHeader user={user} />

      <TabView
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        scenes={scenes}
      />
    </View>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.black,
  },
}));

const ProfileScreen = (props: IStackScreenProps<"Profile">) => {
  return (
    <TabProvider>
      <ProfileScreenContent {...props} />
    </TabProvider>
  );
};

export default ProfileScreen;
