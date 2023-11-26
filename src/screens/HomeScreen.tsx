import StyledText from "@/components/common/StyledText";
import Device from "@/constants/Device";
import useCollapsibleHeader from "@/hooks/useCollapsibleHeader";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { makeStyles } from "@rneui/themed";
import { useMemo } from "react";
import { Image, View } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HEADER_HEIGHT = 64;

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const bottomTabHeight = useBottomTabBarHeight();
  const styles = useStyles();

  const { headerStyle, scrollHandler, scrollViewStyle } = useCollapsibleHeader(
    useMemo(
      () => ({
        headerHeight: HEADER_HEIGHT,
        maxScrollViewHeight:
          Device.screen.height - insets.top - bottomTabHeight,
        minScrollViewHeight:
          Device.screen.height - insets.top - HEADER_HEIGHT - bottomTabHeight,
      }),
      [insets, bottomTabHeight]
    )
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Animated.View
        style={[styles.appBarHeader, headerStyle, { marginTop: insets.top }]}
      >
        <StyledText h3 style={styles.whiteColor}>
          Calvin
        </StyledText>
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
