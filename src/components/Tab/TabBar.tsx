import { makeStyles } from "@rneui/themed";
import { memo } from "react";
import { Dimensions, TouchableOpacity, View, ViewStyle } from "react-native";
import Animated, {
  AnimatedStyleProp,
  interpolate,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

import { ITabViewProps } from "./TabView";
import StyledText from "../common/StyledText";

import Device from "@/constants/Device";
import { ProfileTabBarHeight } from "@/constants/Tab";
import { useTab } from "@/context/tab";

type ITabBarProps = {
  navigationState: ITabViewProps["navigationState"];
  onIndexChange: ITabViewProps["onIndexChange"];
};

const TabBar = memo<ITabBarProps>(({ navigationState, onIndexChange }) => {
  const styles = useStyles();
  const { scrollY } = useTab();

  const numberOfTabs = navigationState.routes.length;

  const tabAnimatedStyle = useAnimatedStyle(
    () =>
      ({
        width: `${100 / navigationState.routes.length}%`,
        transform: [
          {
            translateX: scrollY?.value
              ? interpolate(
                  scrollY.value,
                  [0, Device.screen.width * numberOfTabs],
                  [0, Device.screen.width]
                )
              : 0,
          },
        ],
      }) as AnimatedStyleProp<ViewStyle>
  );

  return (
    <View style={styles.container}>
      {navigationState.routes.map((route, index) => (
        <TouchableOpacity
          key={route.key}
          style={styles.tabItem}
          onPress={() => onIndexChange(index)}
        >
          <StyledText style={{ color: "white" }}>{route.title}</StyledText>
        </TouchableOpacity>
      ))}
      <Animated.View style={[tabAnimatedStyle, styles.tabBarActiveIndicator]} />
    </View>
  );
});

const useStyles = makeStyles((theme) => ({
  container: {
    height: ProfileTabBarHeight,
    flexDirection: "row",
    width: "100%",
    borderBottomWidth: 1,
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
