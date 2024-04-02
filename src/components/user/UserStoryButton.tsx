import { Image, makeStyles } from "@rneui/themed";
import { LinearGradient } from "expo-linear-gradient";
import { memo } from "react";
import { Pressable, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

import StyledText from "../common/StyledText";

import { users } from "@/data/users";

type IUserStoryButtonProps = {
  userId: string;
  size?: "sm" | "md" | "lg";
  hideName?: boolean;
};

const UserStoryButton = memo<IUserStoryButtonProps>(
  ({ userId, size = "md", hideName }) => {
    const user = users.find((user) => user.id === userId);
    const styles = useStyles({ size });
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ scale: withTiming(scale.value, { duration: 100 }) }],
      };
    });

    if (!user) return null;

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
              key={user.id}
              style={styles.storyButton}
            >
              <Image
                source={{ uri: user.imageUrl }}
                containerStyle={styles.storyImage}
                resizeMode="contain"
              />
            </LinearGradient>
          </Animated.View>
        </Pressable>
        {!hideName && (
          <StyledText style={styles.storyUsername} numberOfLines={1}>
            {user.name}
          </StyledText>
        )}
      </View>
    );
  },
);

const useStyles = makeStyles(
  (theme, props: { size: IUserStoryButtonProps["size"] }) => {
    const width = {
      sm: 60,
      md: 80,
      lg: 100,
    }[props.size || "md"];

    return {
      storyButton: {
        width,
        height: width,
        borderRadius: width / 2,
        backgroundColor: theme.colors.grey0,
        justifyContent: "center",
        alignItems: "center",
      },
      storyImage: {
        width: width - 3,
        height: width - 3,
        borderRadius: (width - 3) / 2,
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
    };
  },
);

UserStoryButton.displayName = "StoryButton";

export default UserStoryButton;
