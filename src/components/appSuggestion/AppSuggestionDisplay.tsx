import { AppSuggestion } from "@/data/appSuggestions";
import { memo, useRef } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

interface IAppSuggestionDisplayProps {
  appSuggestion: AppSuggestion;
  onPress: () => void;
}

const AppSuggestionDisplay = memo<IAppSuggestionDisplayProps>(
  ({ appSuggestion: { description, id, imageUrl, title }, onPress }) => {
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    return (
      <Pressable
        onPress={onPress}
        onPressIn={() => {
          scale.value = withTiming(0.95, { duration: 300 });
          Haptics.impactAsync();
        }}
        onPressOut={() => {
          scale.value = withTiming(1, { duration: 300 });
        }}
      >
        <Animated.View style={[styles.container, animatedStyle]}>
          <ImageBackground
            source={{ uri: imageUrl }}
            style={styles.imageBackground}
          >
            <Text style={[styles.text, styles.title]}>{title}</Text>
            <Text style={[styles.text, styles.description]}>{description}</Text>
          </ImageBackground>
        </Animated.View>
      </Pressable>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    aspectRatio: 3 / 4,
    borderRadius: 16,
    backgroundColor: "lightgray",
    overflow: "hidden",
  },
  imageBackground: {
    flex: 1,
    paddingVertical: 32,
    justifyContent: "space-between",
  },
  text: {
    color: "white",
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
    marginTop: 16,
  },
  description: {
    fontSize: 20,
  },
});

AppSuggestionDisplay.displayName = "AppSuggestionDisplay";
export default AppSuggestionDisplay;
