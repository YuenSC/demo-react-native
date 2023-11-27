import { Image, makeStyles } from "@rneui/themed";
import { LinearGradient } from "expo-linear-gradient";
import { memo } from "react";
import { Pressable, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

import StyledText from "../common/StyledText";

import { Story } from "@/data/stories";

type IStoryButtonProps = {
  story: Story;
};

const MAX_SIZE = 80;

const StoryButton = memo<IStoryButtonProps>(({ story }) => {
  const styles = useStyles();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withTiming(scale.value, { duration: 100 }) }],
    };
  });

  return (
    <View>
      <Pressable
        onLongPress={() => {
          console.log("onLongPress");
        }}
        onPress={() => {
          console.log("onPress");
        }}
        onPressIn={() => {
          scale.value = withDelay(200, withTiming(0.9, { duration: 50 }));
        }}
        onPressOut={() => {
          scale.value = withTiming(1, { duration: 50 });
        }}
      >
        <Animated.View style={animatedStyle}>
          <LinearGradient
            colors={["#f09433", "#e6683c", "#dc2743", "#cc2366", "#bc1888"]}
            key={story.id}
            style={styles.storyButton}
          >
            <Image
              source={{ uri: story.imageUrl }}
              containerStyle={styles.storyImage}
              resizeMode="contain"
            />
          </LinearGradient>
        </Animated.View>
      </Pressable>

      <StyledText style={styles.storyUsername} numberOfLines={1}>
        {story.userName}
      </StyledText>
    </View>
  );
});

const useStyles = makeStyles((theme) => ({
  storyButton: {
    width: MAX_SIZE,
    height: MAX_SIZE,
    borderRadius: MAX_SIZE / 2,
    backgroundColor: theme.colors.grey0,
    justifyContent: "center",
    alignItems: "center",
  },
  storyImage: {
    width: MAX_SIZE - 3,
    height: MAX_SIZE - 3,
    borderRadius: (MAX_SIZE - 3) / 2,
    borderWidth: 2,
    borderColor: theme.colors.black,
    backgroundColor: theme.colors.grey0,
  },
  storyUsername: {
    textAlign: "center",
    color: theme.colors.white,
    fontSize: 12,
    marginTop: 4,
    maxWidth: 80,
  },
}));

StoryButton.displayName = "StoryButton";

export default StoryButton;
