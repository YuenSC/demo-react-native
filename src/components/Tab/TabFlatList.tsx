import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useHeaderHeight } from "@react-navigation/elements";
import { memo, useCallback, useRef, useState } from "react";
import { Button, FlatList, FlatListProps, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import Device from "@/constants/Device";
import { TabBarHeight } from "@/constants/Tab";
import { useTab } from "@/context/tab";
import clamp from "@/utils/reanimated/clamp";

interface ITabFlatListProps<T> extends FlatListProps<T> {
  routeKey: string;
}

const TabFlatList = <T extends any>({
  routeKey,
  ...props
}: ITabFlatListProps<T>) => {
  const canScroll = useSharedValue(false);

  const {
    syncScrollOffset,
    tabHeaderHeight,
    innerScrollY,
    listOffset,
    listRefArr,
  } = useTab();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event, ctx) => {
      if (innerScrollY) {
        const isScrollEnd = event.contentOffset.y === innerScrollY.value;
        if (isScrollEnd && syncScrollOffset) {
          runOnJS(syncScrollOffset)(routeKey);
          return;
        }
        innerScrollY.value = event.contentOffset.y;

        canScroll.value =
          event.contentSize.height >= event.layoutMeasurement.height;
      }
      if (listOffset?.value) {
        listOffset.value[routeKey] = event.contentOffset.y;
      }
    },
  });

  const flatListStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY:
            canScroll.value || (listOffset?.value[routeKey] ?? 0) > 0
              ? 0
              : -clamp(innerScrollY?.value ?? 0, 0, tabHeaderHeight),
        },
      ],
    };
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
      directionalLockEnabled
      numColumns={3}
      contentContainerStyle={{
        paddingTop: tabHeaderHeight + TabBarHeight,
      }}
      {...props}
      style={[flatListStyle, props.style]}
    />
  );
};

TabFlatList.displayName = "TabFlatList";

export default memo(TabFlatList) as typeof TabFlatList;
