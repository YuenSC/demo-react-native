import { Text, makeStyles } from "@rneui/themed";
import { memo } from "react";
import { View } from "react-native";

import { VStack } from "./common/Stack";

import { AvatarColor } from "@/types/AvatarColor";

type IAvatarIconProps = {
  color: AvatarColor;
  userName: string;
  size?: "small" | "medium" | "large";
  isShowName?: boolean;
};

const AvatarIcon = memo<IAvatarIconProps>(
  ({ color, userName, size = "medium", isShowName }) => {
    const styles = useStyles({ color, size });
    const extractFirstLetterInEveryWord = (str: string) =>
      str
        .split(" ")
        .map((word) => word[0])
        .join("");

    return (
      <VStack style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.text}>
            {extractFirstLetterInEveryWord(userName).slice(0, 2)}
          </Text>
        </View>
        {isShowName && <Text numberOfLines={1}>{userName}</Text>}
      </VStack>
    );
  },
);

const useStyles = makeStyles(
  (
    theme,
    {
      color,
      size,
    }: {
      color: AvatarColor;
      size: "small" | "medium" | "large";
    },
  ) => {
    const avatarSize = {
      small: 40,
      medium: 60,
      large: 80,
    };

    const fontSize = {
      small: 16,
      medium: 24,
      large: 32,
    };

    return {
      avatarContainer: {
        maxWidth: avatarSize[size] + 16,
      },
      avatar: {
        backgroundColor: color,
        width: avatarSize[size],
        height: avatarSize[size],
        borderRadius: avatarSize[size] / 2,
        justifyContent: "center",
        alignItems: "center",
      },
      text: {
        fontSize: fontSize[size],
        color: theme.colors.white,
        fontWeight: "bold",
      },
    };
  },
);

AvatarIcon.displayName = "AvatarIcon";

export default AvatarIcon;
