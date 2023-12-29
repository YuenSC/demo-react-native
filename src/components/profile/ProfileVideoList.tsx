import { makeStyles, useTheme } from "@rneui/themed";
import { memo, useCallback, useState } from "react";
import { Image, RefreshControl } from "react-native";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";

import { TabBarHeight, TabHeaderInitialHeight } from "@/constants/Tab";
import { useTab } from "@/context/tab";
import { posts } from "@/data/posts";

type IProfileVideoListProps = {
  routeKey: string;
};

const ProfileVideoList = memo<IProfileVideoListProps>(({ routeKey }) => {
  const styles = useStyles();
  const { theme } = useTheme();
  const { innerScrollY, listRefArr, listOffset, syncScrollOffset } = useTab();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

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
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          tintColor={theme.colors.warning}
          onRefresh={onRefresh}
          progressViewOffset={TabHeaderInitialHeight + TabBarHeight}
        />
      }
      data={posts}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      onScrollEndDrag={() => {
        console.log("onEndDrag ProfileVideoList");
        syncScrollOffset?.(routeKey);
      }}
      onMomentumScrollEnd={(event) => {
        console.log("onMomentumEnd ProfileVideoList");
        syncScrollOffset?.(routeKey);
      }}
      directionalLockEnabled
      numColumns={3}
      contentContainerStyle={{
        paddingTop: TabHeaderInitialHeight + TabBarHeight,
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

ProfileVideoList.displayName = "ProfileVideoList";

export default ProfileVideoList;
