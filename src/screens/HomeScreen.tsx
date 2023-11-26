import Device from "@/constants/Device";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Image, StyleSheet, View } from "react-native";
import { Appbar, Text } from "react-native-paper";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HeaderHeight = 64;

const clamp = (value: number, lowerBound: number, upperBound: number) => {
  "worklet";
  return Math.min(Math.max(lowerBound, value), upperBound);
};

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const headerTranslateY = useSharedValue(0);
  const bottomTabHeight = useBottomTabBarHeight();

  const minScrollViewHeight =
    Device.screen.height - insets.top - HeaderHeight - bottomTabHeight;
  const maxScrollViewHeight = minScrollViewHeight + HeaderHeight;

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
        -HeaderHeight,
        0
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
      headerTranslateY.value = withTiming(diff > 0 ? -HeaderHeight : 0, {
        duration: 300,
      });
    },
  });

  const headerStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(headerTranslateY.value, [-HeaderHeight, 0], [0, 1]),
      transform: [{ translateY: headerTranslateY.value }],
    };
  });

  const scrollViewStyle = useAnimatedStyle(() => {
    return {
      maxHeight: interpolate(
        headerTranslateY.value,
        [-HeaderHeight, 0],
        [maxScrollViewHeight, minScrollViewHeight]
      ),
    };
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Animated.View
        style={[styles.appBarHeader, headerStyle, { marginTop: insets.top }]}
      >
        <Text variant="headlineMedium" style={styles.whiteColor}>
          Calvin
        </Text>
      </Animated.View>

      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        style={[styles.scrollView, scrollViewStyle]}
      >
        {Array.from(Array(10).keys()).map((index) => (
          <Image
            key={index}
            source={{ uri: "https://picsum.photos/400/300?" + index }}
            style={styles.image}
            resizeMode="contain"
          />
        ))}
      </Animated.ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  whiteColor: {
    color: "#fff",
  },
  appBarHeader: {
    backgroundColor: "black",
    borderBottomWidth: 1,
    borderColor: "lightgray",
    height: HeaderHeight,
    width: "100%",
    position: "absolute",
    top: 0,
    zIndex: 10,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  scrollView: {
    marginTop: "auto",
  },
  image: {
    width: "100%",
    aspectRatio: 4 / 3,
    marginBottom: 16,
  },
});
