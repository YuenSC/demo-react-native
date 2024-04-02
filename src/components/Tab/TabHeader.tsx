import { makeStyles } from "@rneui/themed";
import { ReactNode, memo } from "react";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

import { TabHeaderInitialHeight } from "@/constants/Tab";
import { useTab } from "@/context/tab";

type ITabHeaderProps = {
  children?: ReactNode;
};

const TabHeader = memo<ITabHeaderProps>(({ children }) => {
  const styles = useStyles();
  const {
    isHeaderCollapsible,
    innerScrollY,
    tabHeaderHeight,
    setTabHeaderHeight,
  } = useTab();

  const tabHeaderAnimatedStyle = useAnimatedStyle(() => {
    const translateY = innerScrollY?.value
      ? interpolate(
          innerScrollY?.value,
          [0, tabHeaderHeight],
          [0, -tabHeaderHeight],
          Extrapolation.CLAMP,
        )
      : 0;

    return { transform: [{ translateY }] };
  });

  return (
    <Animated.View
      onLayout={({
        nativeEvent: {
          layout: { height },
        },
      }) => {
        setTabHeaderHeight(height);
      }}
      style={[
        styles.container,
        isHeaderCollapsible && styles.absoluteContainer,
        isHeaderCollapsible && tabHeaderAnimatedStyle,
      ]}
    >
      {children}
    </Animated.View>
  );
});

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.colors.black,
    width: "100%",
  },
  absoluteContainer: {
    position: "absolute",
    minHeight: TabHeaderInitialHeight,
  },
}));

TabHeader.displayName = "TabHeader";

export default TabHeader;
