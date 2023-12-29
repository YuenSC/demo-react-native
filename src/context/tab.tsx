import { createContext, useCallback, useContext, useMemo, useRef } from "react";
import { FlatList } from "react-native";
import Animated, { SharedValue, useSharedValue } from "react-native-reanimated";

import { ProfileTabHeaderInitialHeight } from "@/constants/Tab";

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
  listOffset?: React.MutableRefObject<Record<string, number>>;
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
  const listOffset = useRef<Record<string, number>>({});

  const syncScrollOffset = useCallback(
    (curRouteKey: string) => {
      console.log("syncScrollOffset");
      console.log("listRefArr.current.length", listRefArr.current.length);
      console.log("innerScrollY.value", innerScrollY.value);
      listRefArr.current.forEach((item) => {
        if (item.key !== curRouteKey) {
          if (
            innerScrollY.value < ProfileTabHeaderInitialHeight &&
            innerScrollY.value >= 0
          ) {
            if (item.value) {
              (item.value as any as FlatList).scrollToOffset({
                offset: innerScrollY.value,
                animated: false,
              });
              listOffset.current[item.key] = innerScrollY.value;
            }
          } else if (innerScrollY.value >= ProfileTabHeaderInitialHeight) {
            if (
              listOffset.current[item.key] < ProfileTabHeaderInitialHeight ||
              listOffset.current[item.key] == null
            ) {
              if (item.value) {
                (item.value as any as FlatList).scrollToOffset({
                  offset: ProfileTabHeaderInitialHeight,
                  animated: false,
                });
                listOffset.current[item.key] = ProfileTabHeaderInitialHeight;
              }
            }
          }
        }
      });
    },
    [innerScrollY.value]
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
        [innerScrollY, isHeaderCollapsible, scrollY, syncScrollOffset]
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
