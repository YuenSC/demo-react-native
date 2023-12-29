import { makeStyles } from "@rneui/themed";
import { ReactNode, memo, useEffect, useRef } from "react";
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
} from "react-native";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";

import TabBar from "./TabBar";
import TabHeader from "./TabHeader";

import Device from "@/constants/Device";
import { TabProvider, useTab } from "@/context/tab";

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
  scenes: Record<string, React.NamedExoticComponent<{ routeKey: string }>>;
  onIndexChange: (index: number) => void;
  header?: ReactNode;
  isHeaderCollapsible?: boolean;
};

const TabViewContent = memo<ITabViewProps>(
  ({ navigationState, onIndexChange, scenes, header }) => {
    const styles = useStyles();
    const ref = useRef<ScrollView>(null);

    const { scrollY } = useTab();

    const index = navigationState.index;

    const scrollHandler = useAnimatedScrollHandler({
      onScroll: (event) => {
        if (scrollY) scrollY.value = event.contentOffset.x;
      },
      onMomentumEnd: (event) => {
        console.log("event", event);
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
        <TabHeader>{header}</TabHeader>
        <TabBar
          navigationState={navigationState}
          onIndexChange={onIndexChange}
        />
        <Animated.ScrollView
          ref={ref as any}
          scrollEventThrottle={16}
          horizontal
          pagingEnabled
          directionalLockEnabled
          onScroll={scrollHandler}
          overScrollMode="always"
          onMomentumScrollEnd={(
            event: NativeSyntheticEvent<NativeScrollEvent>
          ) => {
            console.log("onMomentumEnd Tab");
            const currentIndex = Math.round(
              event.nativeEvent.contentOffset.x / Device.screen.width
            );
            onIndexChange(currentIndex);
          }}
        >
          {Object.keys(scenes).map((key) => {
            const Component = scenes[key];
            return (
              <Animated.View style={styles.page} key={key}>
                <Component routeKey={key} />
              </Animated.View>
            );
          })}
        </Animated.ScrollView>
      </>
    );
  }
);

const TabView = memo<ITabViewProps>((props) => {
  return (
    <TabProvider isHeaderCollapsible={props.isHeaderCollapsible}>
      <TabViewContent {...props} />
    </TabProvider>
  );
});

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
