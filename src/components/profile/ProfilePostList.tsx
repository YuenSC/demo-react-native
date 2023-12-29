import { makeStyles } from "@rneui/themed";
import { memo } from "react";
import { Image } from "react-native";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";

import { TabBarHeight } from "@/constants/Tab";
import { useTab } from "@/context/tab";
import { posts } from "@/data/posts";

type IProfilePostListProps = {
  routeKey: string;
};

const ProfilePostList = memo<IProfilePostListProps>(({ routeKey }) => {
  const styles = useStyles();
  const {
    innerScrollY,
    listRefArr,
    listOffset,
    syncScrollOffset,
    tabHeaderHeight,
  } = useTab();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      if (innerScrollY) {
        innerScrollY.value = event.contentOffset.y;
      }
      if (listOffset?.value) {
        listOffset.value[routeKey] = event.contentOffset.y;
      }
    },
  });

  return (
    <Animated.FlatList
      ref={(ref) => {
        if (ref) {
          const found = listRefArr?.current.find((e) => e.key === routeKey);
          console.log("found", found, routeKey);
          if (!found) {
            listRefArr?.current.push({ key: routeKey, value: ref });
          }
        }
      }}
      onScroll={scrollHandler}
      onScrollEndDrag={() => {
        console.log("onEndDrag ProfilePostList");
        syncScrollOffset?.(routeKey);
      }}
      onMomentumScrollEnd={() => {
        console.log("onMomentumEnd ProfilePostList");
        syncScrollOffset?.(routeKey);
      }}
      directionalLockEnabled
      scrollEventThrottle={16}
      data={posts.slice(0, 30)}
      numColumns={3}
      contentContainerStyle={{
        paddingTop: tabHeaderHeight + TabBarHeight,
      }}
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

ProfilePostList.displayName = "ProfilePostList";

export default ProfilePostList;
