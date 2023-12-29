import { createContext, useCallback, useContext, useMemo, useRef } from "react";
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
}>({});

export const TabProvider = ({
  children,
  isHeaderCollapsible,
}: {
  children: React.ReactNode;
  isHeaderCollapsible?: boolean;
}) => {
  const scrollY = useSharedValue(0);
  const innerScrollY = useSharedValue(0);
  const listRefArr = useRef<{ key: string; value: Animated.FlatList<any> }[]>(
    []
  );
  const listOffset = useSharedValue<Record<string, number>>({});

  const syncScrollOffset = useCallback(
    (curRouteKey: string) => {
      const tabBarTopSpacing = TabHeaderInitialHeight + TabBarHeight;
      console.log("listOffset", listOffset);

      listRefArr.current.forEach((item) => {
        if (item.key !== curRouteKey) {
          if (
            innerScrollY.value < TabHeaderInitialHeight &&
            innerScrollY.value >= 0
          ) {
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
    [innerScrollY.value, listOffset]
  );

  return (
    <TabContext.Provider
      value={useMemo(
        () => ({
          scrollY,
          isHeaderCollapsible,
          innerScrollY,
          listRefArr,
          listOffset,
          syncScrollOffset,
        }),
        [
          innerScrollY,
          isHeaderCollapsible,
          listOffset,
          scrollY,
          syncScrollOffset,
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