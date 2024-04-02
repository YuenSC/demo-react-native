import { makeStyles } from "@rneui/themed";
import { memo } from "react";
import { TouchableOpacity, ViewStyle } from "react-native";
import Animated, {
  AnimatedStyleProp,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

import { ITabViewProps } from "./TabView";
import StyledText from "../common/StyledText";

import Device from "@/constants/Device";
import { TabBarHeight } from "@/constants/Tab";
import { useTab } from "@/context/tab";

type ITabBarProps = {
  navigationState: ITabViewProps["navigationState"];
  onIndexChange: ITabViewProps["onIndexChange"];
};

const TabBar = memo<ITabBarProps>(({ navigationState, onIndexChange }) => {
  const styles = useStyles();
  const {
    scrollY,
    isHeaderCollapsible,
    innerScrollY,
    tabHeaderHeight,
    onScrollToTop,
  } = useTab();

  const numberOfTabs = navigationState.routes.length;

  const tabAnimatedStyle = useAnimatedStyle(() => {
    const isTabBarSticky = true;

    return {
      transform: [
        {
          translateY: innerScrollY?.value
            ? interpolate(
                innerScrollY.value,
                [0, tabHeaderHeight + (isTabBarSticky ? 0 : 1000)],
                [tabHeaderHeight, 0 + (isTabBarSticky ? 0 : -1000)],
                Extrapolation.CLAMP,
              )
            : tabHeaderHeight,
        },
      ],
    } as AnimatedStyleProp<ViewStyle>;
  });

  const indicatorAnimatedStyle = useAnimatedStyle(
    () =>
      ({
        width: `${100 / navigationState.routes.length}%`,
        transform: [
          {
            translateX: scrollY?.value
              ? interpolate(
                  scrollY.value,
                  [0, Device.screen.width * numberOfTabs],
                  [0, Device.screen.width],
                )
              : 0,
          },
        ],
      }) as AnimatedStyleProp<ViewStyle>,
  );

  return (
    <Animated.View
      style={[
        styles.container,
        isHeaderCollapsible && styles.absoluteContainer,
        isHeaderCollapsible && tabAnimatedStyle,
      ]}
    >
      {navigationState.routes.map((route, index) => (
        <TouchableOpacity
          key={route.key}
          style={styles.tabItem}
          onPress={() => {
            if (navigationState.index === index) {
              onScrollToTop(route.key);
            }
            onIndexChange(index);
          }}
        >
          <StyledText style={{ color: "white" }}>{route.title}</StyledText>
        </TouchableOpacity>
      ))}
      <Animated.View
        style={[indicatorAnimatedStyle, styles.tabBarActiveIndicator]}
      />
    </Animated.View>
  );
});

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.colors.black,
    height: TabBarHeight,
    flexDirection: "row",
    width: "100%",
    borderBottomWidth: 1,
  },
  absoluteContainer: {
    position: "absolute",
    top: 0,
    zIndex: 1,
  },
  tabItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabBarActiveIndicator: {
    position: "absolute",
    height: 2,
    borderRadius: 2,
    bottom: 0,
    width: "100%",
    backgroundColor: "white",
  },
}));

TabBar.displayName = "TabBar";

export default TabBar;
