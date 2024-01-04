import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { FlatList } from "react-native";
import Animated, { SharedValue, useSharedValue } from "react-native-reanimated";

import { TabBarHeight, TabHeaderInitialHeight } from "@/constants/Tab";

const TabContext = createContext<{
  scrollY?: SharedValue<number>;
  innerScrollY?: SharedValue<number>;
  isHeaderCollapsible?: boolean;
  listRefArr?: React.MutableRefObject<
    {
      key: string;
      value: Animated.FlatList<any>;
    }[]
  >;
  listOffset?: SharedValue<Record<string, number>>;
  syncScrollOffset?: (curRouteKey: string) => void;
  tabHeaderHeight: number;
  setTabHeaderHeight: (height: number) => void;
  onScrollToTop: (curRouteKey: string) => void;
  activeRouteKey?: string;
}>({
  tabHeaderHeight: TabHeaderInitialHeight,
  setTabHeaderHeight: () => {},
  onScrollToTop: () => {},
});

export const TabProvider = ({
  children,
  isHeaderCollapsible,
  activeRouteKey,
}: {
  children: React.ReactNode;
  isHeaderCollapsible?: boolean;
  activeRouteKey?: string;
}) => {
  const scrollY = useSharedValue(0);
  const innerScrollY = useSharedValue(0);
  const listRefArr = useRef<{ key: string; value: Animated.FlatList<any> }[]>(
    []
  );
  const listOffset = useSharedValue<Record<string, number>>({});
  const [tabHeaderHeight, setTabHeaderHeight] = useState(
    TabHeaderInitialHeight
  );

  const syncScrollOffset = useCallback(
    (curRouteKey: string) => {
      const tabBarTopSpacing = tabHeaderHeight + TabBarHeight;

      listRefArr.current.forEach((item) => {
        if (item.key !== curRouteKey) {
          if (innerScrollY.value < tabHeaderHeight && innerScrollY.value >= 0) {
            if (item.value) {
              (item.value as any as FlatList).scrollToOffset({
                offset: innerScrollY.value,
                animated: false,
              });
              listOffset.value[item.key] = innerScrollY.value;
            }
          } else if (innerScrollY.value >= tabBarTopSpacing) {
            if (
              listOffset.value[item.key] < tabBarTopSpacing ||
              listOffset.value[item.key] == null
            ) {
              if (item.value) {
                (item.value as any as FlatList).scrollToOffset({
                  offset: tabBarTopSpacing,
                  animated: false,
                });
                listOffset.value[item.key] = tabBarTopSpacing;
              }
            }
          }
        }
      });
    },
    [innerScrollY.value, listOffset.value, tabHeaderHeight]
  );

  const onScrollToTop = useCallback(
    (curRouteKey: string) => {
      const currentScrollViewRef = listRefArr.current.find(
        (item) => item.key === curRouteKey
      );

      if (currentScrollViewRef?.value) {
        (currentScrollViewRef.value as any as FlatList).scrollToOffset({
          offset: tabHeaderHeight,
          animated: true,
        });
        listOffset.value[curRouteKey] = tabHeaderHeight;
      }
    },
    [listOffset.value, tabHeaderHeight]
  );

  return (
    <TabContext.Provider
      value={useMemo(
        () => ({
          scrollY,
          isHeaderCollapsible,
          innerScrollY,
          listRefArr,
          activeRouteKey,
          listOffset,
          syncScrollOffset,
          tabHeaderHeight,
          setTabHeaderHeight,
          onScrollToTop,
        }),
        [
          innerScrollY,
          isHeaderCollapsible,
          listOffset,
          onScrollToTop,
          scrollY,
          syncScrollOffset,
          tabHeaderHeight,
          activeRouteKey,
        ]
      )}
    >
      {children}
    </TabContext.Provider>
  );
};

export const useTab = () => {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error("useTab must be used within a ProfileProvider");
  }
  return context;
};
