import Device from "@/constants/Device";
import clamp from "@/utils/reanimated/clamp";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { makeStyles } from "@rneui/themed";
import { Image, Text, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HEADER_HEIGHT = 64;

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const headerTranslateY = useSharedValue(0);
  const bottomTabHeight = useBottomTabBarHeight();
  const styles = useStyles();

  const minScrollViewHeight =
    Device.screen.height - insets.top - HEADER_HEIGHT - bottomTabHeight;
  const maxScrollViewHeight = minScrollViewHeight + HEADER_HEIGHT;

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
        -HEADER_HEIGHT,
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
      headerTranslateY.value = withTiming(diff > 0 ? -HEADER_HEIGHT : 0, {
        duration: 300,
      });
    },
  });

  const headerStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(headerTranslateY.value, [-HEADER_HEIGHT, 0], [0, 1]),
      transform: [{ translateY: headerTranslateY.value }],
    };
  });

  const scrollViewStyle = useAnimatedStyle(() => {
    return {
      maxHeight: interpolate(
        headerTranslateY.value,
        [-HEADER_HEIGHT, 0],
        [maxScrollViewHeight, minScrollViewHeight]
      ),
    };
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Animated.View
        style={[styles.appBarHeader, headerStyle, { marginTop: insets.top }]}
      >
        <Text style={styles.whiteColor}>Calvin</Text>
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

const useStyles = makeStyles((theme) => {
  console.log("theme.colors", theme.colors);
  return {
    container: {
      flex: 1,
      backgroundColor: theme.colors.black,
    },
    whiteColor: {
      color: theme.colors.white,
    },
    appBarHeader: {
      backgroundColor: theme.colors.black,
      borderBottomWidth: 1,
      borderColor: theme.colors.grey0,
      height: HEADER_HEIGHT,
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
  };
});

export default HomeScreen;
