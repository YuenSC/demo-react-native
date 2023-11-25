import { Image, StyleSheet, View } from "react-native";
import { Appbar, Text } from "react-native-paper";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
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
  const maxHeaderHeight = HeaderHeight + insets.top;
  const minHeaderHeight = insets.top;
  const headerHeight = useSharedValue(maxHeaderHeight);

  const scrollHandler = useAnimatedScrollHandler<{ startY: number }>({
    onBeginDrag: (event, ctx) => {
      console.log("onBeginDrag");
      ctx.startY = event.contentOffset.y;
    },
    onEndDrag: (event, ctx) => {
      console.log("onEndDrag");
      const diff = event.contentOffset.y - ctx.startY;
      headerHeight.value = diff > 0 ? minHeaderHeight : maxHeaderHeight;
    },
  });

  const headerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: "black",
      opacity: withTiming(
        interpolate(
          headerHeight.value,
          [minHeaderHeight, maxHeaderHeight],
          [0, 1]
        ),
        { duration: 300 }
      ),
      height: withTiming(headerHeight.value, { duration: 300 }),
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={headerStyle}>
        <Appbar.Header mode="small" style={styles.appBarHeader}>
          <Appbar.Content title="Calvin" titleStyle={{ color: "white" }} />
          <Appbar.Action icon="calendar" onPress={() => {}} />
          <Appbar.Action icon="magnify" onPress={() => {}} />
        </Appbar.Header>
      </Animated.View>

      <Animated.ScrollView scrollEventThrottle={16} onScroll={scrollHandler}>
        {Array.from(Array(10).keys()).map((index) => (
          <Image
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
  },
  image: {
    width: "100%",
    aspectRatio: 4 / 3,
    marginBottom: 16,
  },
});
