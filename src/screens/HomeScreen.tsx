import { StyleSheet, View } from "react-native";
import { Appbar, Text } from "react-native-paper";
import Animated, {
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
  const insets = useSafeAreaInsets();

  const scrollHandler = useAnimatedScrollHandler((event) => {
    console.log("event.contentOffset.y", event.contentOffset.y);
    translationY.value = event.contentOffset.y;
  });

  const headerStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(translationY.value > HeaderHeight ? 0 : 1),
      height: withTiming(
        translationY.value > HeaderHeight
          ? insets.top
          : HeaderHeight + insets.top
      ),
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={headerStyle}>
        <Appbar.Header
          mode="small"
          style={{
            backgroundColor: "black",
            borderBottomWidth: 1,
            borderColor: "white",
          }}
        >
          <Appbar.Content title="Calvin" titleStyle={{ color: "white" }} />
          <Appbar.Action icon="calendar" onPress={() => {}} />
          <Appbar.Action icon="magnify" onPress={() => {}} />
        </Appbar.Header>
      </Animated.View>

      <Animated.ScrollView scrollEventThrottle={16} onScroll={scrollHandler}>
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
});
