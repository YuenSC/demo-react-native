import { StyleSheet, View } from "react-native";
import { Appbar, Text } from "react-native-paper";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const HeaderHeight = 64;

const HomeScreen = () => {
  const translationY = useSharedValue(0);
  const hideHeader = useSharedValue(false);
  const insets = useSafeAreaInsets();

  const scrollHandler = useAnimatedScrollHandler<{ startY: number }>({
    onScroll: (event, ctx) => {
      const diff = event.contentOffset.y - ctx.startY;
      hideHeader.value = diff > 0 ? diff > 10 : diff < -10;
      translationY.value = event.contentOffset.y;
    },
    onBeginDrag: (event, ctx) => {
      ctx.startY = event.contentOffset.y;
    },
  });

  const headerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: "black",
      opacity: withTiming(hideHeader.value ? 0 : 1, { duration: 500 }),
    };
  });

  const testStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(hideHeader.value ? -HeaderHeight : 0, {
            duration: 500,
          }),
        },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[headerStyle, testStyle]}>
        <Appbar.Header mode="small" style={styles.appBarHeader}>
          <Appbar.Content title="Calvin" titleStyle={{ color: "white" }} />
          <Appbar.Action icon="calendar" onPress={() => {}} />
          <Appbar.Action icon="magnify" onPress={() => {}} />
        </Appbar.Header>
      </Animated.View>

      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        style={testStyle}
      >
        <Text style={styles.whiteColor}>HomeScreen</Text>
        <Text variant="bodyLarge" style={styles.whiteColor}>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquid
          veritatis accusamus explicabo sint incidunt non perspiciatis
          assumenda! Neque aut earum repudiandae similique dicta sint quod qui
          magni! Dignissimos, quas vel earum atque ratione eos inventore et
          voluptates, dolorem voluptas, ullam at odit eveniet numquam! Atque
          delectus cum debitis earum eos dolores odit fugit sequi temporibus
          iure. Mollitia minus, cum, fugit nulla dolorum tempore, pariatur
          veniam obcaecati ipsa enim quisquam reiciendis aperiam reprehenderit
          impedit magnam odio rerum consectetur necessitatibus asperiores nobis
          assumenda adipisci dignissimos repellat. Voluptatem veniam hic aliquam
          ducimus atque esse cum, ab maxime minima ut architecto assumenda
          voluptatum doloremque.
        </Text>
        <Text variant="bodyLarge" style={styles.whiteColor}>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquid
          veritatis accusamus explicabo sint incidunt non perspiciatis
          assumenda! Neque aut earum repudiandae similique dicta sint quod qui
          magni! Dignissimos, quas vel earum atque ratione eos inventore et
          voluptates, dolorem voluptas, ullam at odit eveniet numquam! Atque
          delectus cum debitis earum eos dolores odit fugit sequi temporibus
          iure. Mollitia minus, cum, fugit nulla dolorum tempore, pariatur
          veniam obcaecati ipsa enim quisquam reiciendis aperiam reprehenderit
          impedit magnam odio rerum consectetur necessitatibus asperiores nobis
          assumenda adipisci dignissimos repellat. Voluptatem veniam hic aliquam
          ducimus atque esse cum, ab maxime minima ut architecto assumenda
          voluptatum doloremque.
        </Text>
        <Text variant="bodyLarge" style={styles.whiteColor}>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquid
          veritatis accusamus explicabo sint incidunt non perspiciatis
          assumenda! Neque aut earum repudiandae similique dicta sint quod qui
          magni! Dignissimos, quas vel earum atque ratione eos inventore et
          voluptates, dolorem voluptas, ullam at odit eveniet numquam! Atque
          delectus cum debitis earum eos dolores odit fugit sequi temporibus
          iure. Mollitia minus, cum, fugit nulla dolorum tempore, pariatur
          veniam obcaecati ipsa enim quisquam reiciendis aperiam reprehenderit
          impedit magnam odio rerum consectetur necessitatibus asperiores nobis
          assumenda adipisci dignissimos repellat. Voluptatem veniam hic aliquam
          ducimus atque esse cum, ab maxime minima ut architecto assumenda
          voluptatum doloremque.
        </Text>
        <Text variant="bodyLarge" style={styles.whiteColor}>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquid
          veritatis accusamus explicabo sint incidunt non perspiciatis
          assumenda! Neque aut earum repudiandae similique dicta sint quod qui
          magni! Dignissimos, quas vel earum atque ratione eos inventore et
          voluptates, dolorem voluptas, ullam at odit eveniet numquam! Atque
          delectus cum debitis earum eos dolores odit fugit sequi temporibus
          iure. Mollitia minus, cum, fugit nulla dolorum tempore, pariatur
          veniam obcaecati ipsa enim quisquam reiciendis aperiam reprehenderit
          impedit magnam odio rerum consectetur necessitatibus asperiores nobis
          assumenda adipisci dignissimos repellat. Voluptatem veniam hic aliquam
          ducimus atque esse cum, ab maxime minima ut architecto assumenda
          voluptatum doloremque.
        </Text>
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
    borderColor: "white",
  },
});
