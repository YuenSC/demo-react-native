import { makeStyles } from "@rneui/themed";
import { LegacyRef, ReactNode, memo, useEffect, useRef } from "react";
import { Dimensions, ScrollView, View } from "react-native";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";

import TabBar from "./TabBar";

import Device from "@/constants/Device";
import { useTab } from "@/context/tab";

export type TabRoute = {
  key: string;
  icon?: string;
  title?: string;
};

export type ITabViewProps = {
  navigationState: {
    index: number;
    routes: TabRoute[];
  };
  scenes: Record<
    string,
    (() => React.JSX.Element) | React.NamedExoticComponent<object>
  >;
  onIndexChange: (index: number) => void;
};

const TabView = memo<ITabViewProps>(
  ({ navigationState, onIndexChange, scenes }) => {
    const styles = useStyles();
    const ref = useRef<ScrollView>(null);

    const { scrollY } = useTab();

    const index = navigationState.index;

    const scrollHandler = useAnimatedScrollHandler({
      onScroll: (event) => {
        if (scrollY) scrollY.value = event.contentOffset.x;
      },
    });

    useEffect(() => {
      if (ref.current) {
        ref.current.scrollTo({
          x: index * Device.screen.width,
          animated: true,
        });
      }
    }, [index]);

    return (
      <>
        <TabBar
          navigationState={navigationState}
          onIndexChange={onIndexChange}
        />
        <Animated.ScrollView
          ref={ref as any}
          scrollEventThrottle={16}
          horizontal
          pagingEnabled
          onScroll={scrollHandler}
          overScrollMode="always"
        >
          {Object.keys(scenes).map((key) => {
            const Component = scenes[key];
            return (
              <View style={styles.page}>
                <Component />
              </View>
            );
          })}
        </Animated.ScrollView>
      </>
    );
  }
);

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.black,
  },
  page: {
    width: Dimensions.get("window").width,
  },
}));

TabView.displayName = "TabView";

export default TabView;
