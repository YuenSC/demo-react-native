import { useFocusEffect } from "@react-navigation/native";
import { RefObject, useCallback } from "react";
import { FlatList } from "react-native";
import {
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import clamp from "@/utils/reanimated/clamp";

const useCollapsibleHeader = ({
  headerHeight,
  scrollViewRef,
}: {
  headerHeight: number;
  scrollViewRef: RefObject<FlatList>;
}) => {
  const headerTranslateY = useSharedValue(0);

  const onShowHeader = useCallback(() => {
    headerTranslateY.value = withTiming(0, { duration: 300 });
  }, [headerTranslateY]);

  const onHideHeader = useCallback(() => {
    headerTranslateY.value = withTiming(-headerHeight, { duration: 300 });
  }, [headerHeight, headerTranslateY]);

  const scrollToOffset = (offset: number) => {
    scrollViewRef.current?.scrollToOffset({ offset, animated: true });
  };

  const scrollHandler = useAnimatedScrollHandler<{
    startY: number;
    initialHeaderTranslateY: number;
  }>({
    onScroll: (event, ctx) => {
      const nextHeaderTranslateY = clamp(
        ctx.initialHeaderTranslateY,
        event.contentOffset.y - headerHeight,
        event.contentOffset.y
      );
      console.log("headerTranslateY.value", headerTranslateY.value);

      headerTranslateY.value = nextHeaderTranslateY;
    },
    onBeginDrag: (event, ctx) => {
      ctx.startY = event.contentOffset.y;
      ctx.initialHeaderTranslateY = headerTranslateY.value;
    },
    onEndDrag: (event, ctx) => {
      const diff = event.contentOffset.y - ctx.startY;
      console.log("diff", diff);
      if (Math.abs(diff) > headerHeight) return;
      runOnJS(scrollToOffset)(
        diff > 0 ? ctx.startY + headerHeight : ctx.startY - headerHeight
      );
    },
  });

  const animatedHeaderStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: headerTranslateY.value }],
      zIndex: 100,
    };
  });

  useFocusEffect(
    useCallback(() => {
      return onShowHeader;
    }, [onShowHeader])
  );

  return {
    onShowHeader,
    onHideHeader,
    animatedHeaderStyle,
    scrollHandler,
  };
};

export default useCollapsibleHeader;
