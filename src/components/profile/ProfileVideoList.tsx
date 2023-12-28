import { makeStyles } from "@rneui/themed";
import { memo } from "react";
import { Image } from "react-native";
import { FlatList } from "react-native-gesture-handler";

import { posts } from "@/data/posts";

type IProfileVideoListProps = object;

const ProfileVideoList = memo<IProfileVideoListProps>(() => {
  const styles = useStyles();

  return (
    <FlatList
      data={posts}
      numColumns={3}
      renderItem={({ item }) => {
        return <Image source={{ uri: item.imageUrl }} style={styles.image} />;
      }}
    />
  );
});

const useStyles = makeStyles((theme) => ({
  image: {
    aspectRatio: 1,
    flex: 1 / 3,
    backgroundColor: theme.colors.grey0,
    margin: 1,
  },
}));

ProfileVideoList.displayName = "ProfileVideoList";

export default ProfileVideoList;
