import { makeStyles } from "@rneui/themed";
import { ReactNode, memo } from "react";
import { View, ViewStyle } from "react-native";
import Animated, {
  AnimatedStyleProp,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

import { ProfileTabHeaderInitialHeight } from "@/constants/Tab";
import { useTab } from "@/context/tab";

type ITabHeaderProps = {
  children?: ReactNode;
};

const TabHeader = memo<ITabHeaderProps>(({ children }) => {
  const styles = useStyles();
  const { isHeaderCollapsible, innerScrollY } = useTab();

  const tabHeaderAnimatedStyle = useAnimatedStyle(
    () =>
      ({
        transform: [
          {
            translateY: innerScrollY?.value
              ? interpolate(
                  innerScrollY.value,
                  [0, ProfileTabHeaderInitialHeight],
                  [0, -ProfileTabHeaderInitialHeight],
                  Extrapolation.CLAMP
                )
              : 0,
          },
        ],
      }) as AnimatedStyleProp<ViewStyle>
  );

  return (
    <Animated.View
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
    zIndex: 1,
    width: "100%",
  },
  absoluteContainer: {
    position: "absolute",
    height: ProfileTabHeaderInitialHeight,
  },
}));

TabHeader.displayName = "TabHeader";

export default TabHeader;
