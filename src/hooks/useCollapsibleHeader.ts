import { useCallback } from "react";
import {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import clamp from "@/utils/reanimated/clamp";

const useCollapsibleHeader = ({
  headerHeight,
  maxScrollViewHeight,
  minScrollViewHeight,
}: {
  maxScrollViewHeight: number;
  minScrollViewHeight: number;
  headerHeight: number;
}) => {
  const headerTranslateY = useSharedValue(0);

  const onShowHeader = useCallback(() => {
    headerTranslateY.value = withTiming(0, { duration: 300 });
  }, []);

  const onHideHeader = useCallback(() => {
    headerTranslateY.value = withTiming(-headerHeight, { duration: 300 });
  }, []);

  const scrollHandler = useAnimatedScrollHandler<{
    startY: number;
    initialHeaderTranslateY: number;
    isEndDrag: boolean;
  }>({
    onScroll: (event, ctx) => {
      if (ctx.isEndDrag) return;
      const diff = event.contentOffset.y - ctx.startY;
      const nextHeaderTranslateY = clamp(
        ctx.initialHeaderTranslateY - diff,
        -headerHeight,
        0,
      );

      headerTranslateY.value = nextHeaderTranslateY;
    },
    onBeginDrag: (event, ctx) => {
      ctx.startY = event.contentOffset.y;
      ctx.initialHeaderTranslateY = headerTranslateY.value;
      ctx.isEndDrag = false;
    },
    onEndDrag: (event, ctx) => {
      ctx.isEndDrag = true;

      const diff = event.contentOffset.y - ctx.startY;
      headerTranslateY.value = withTiming(diff > 0 ? -headerHeight : 0, {
        duration: 300,
      });
    },
  });

  const headerStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(headerTranslateY.value, [-headerHeight, 0], [0, 1]),
      transform: [{ translateY: headerTranslateY.value }],
    };
  });

  const scrollViewStyle = useAnimatedStyle(() => {
    return {
      maxHeight: interpolate(
        headerTranslateY.value,
        [-headerHeight, 0],
        [maxScrollViewHeight, minScrollViewHeight],
      ),
    };
  });

  return {
    scrollHandler,
    headerStyle,
    scrollViewStyle,
    onShowHeader,
    onHideHeader,
  };
};

export default useCollapsibleHeader;
