import { makeStyles, useTheme } from "@rneui/themed";
import { memo, useCallback, useState } from "react";
import { FlatList, Image, RefreshControl } from "react-native";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";

import TabFlatList from "../Tab/TabFlatList";

import { TabBarHeight } from "@/constants/Tab";
import { useTab } from "@/context/tab";
import { posts } from "@/data/posts";

type IProfileVideoListProps = {
  routeKey: string;
};

const ProfileVideoList = memo<IProfileVideoListProps>(({ routeKey }) => {
  const styles = useStyles();
  const { theme } = useTheme();
  const { tabHeaderHeight } = useTab();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <TabFlatList
      routeKey={routeKey}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          tintColor={theme.colors.warning}
          onRefresh={onRefresh}
          progressViewOffset={tabHeaderHeight + TabBarHeight}
        />
      }
      data={posts.slice(0, 9)}
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
