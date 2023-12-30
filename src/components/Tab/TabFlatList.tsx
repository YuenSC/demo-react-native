import { memo } from "react";
import { FlatListProps } from "react-native";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";

import { TabBarHeight } from "@/constants/Tab";
import { useTab } from "@/context/tab";

interface ITabFlatListProps<T> extends FlatListProps<T> {
  routeKey: string;
}

const TabFlatList = <T extends any>({
  routeKey,
  ...props
}: ITabFlatListProps<T>) => {
  const {
    syncScrollOffset,
    tabHeaderHeight,
    innerScrollY,
    listOffset,
    listRefArr,
  } = useTab();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      console.log("onScroll", routeKey);
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
          if (!found) {
            listRefArr?.current.push({ key: routeKey, value: ref });
          }
        }
      }}
      indicatorStyle="white"
      scrollIndicatorInsets={{
        top: tabHeaderHeight + TabBarHeight,
      }}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      onScrollEndDrag={() => {
        console.log("onScrollEndDrag", routeKey);
        syncScrollOffset?.(routeKey);
      }}
      onMomentumScrollEnd={() => {
        console.log("onMomentumScrollEnd", routeKey);
        syncScrollOffset?.(routeKey);
      }}
      directionalLockEnabled
      numColumns={3}
      contentContainerStyle={{
        paddingTop: tabHeaderHeight + TabBarHeight,
      }}
      {...props}
    />
  );
};

TabFlatList.displayName = "TabFlatList";

export default memo(TabFlatList) as typeof TabFlatList;
