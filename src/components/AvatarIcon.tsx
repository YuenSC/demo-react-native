import { Text, makeStyles } from "@rneui/themed";
import { memo } from "react";
import { View } from "react-native";

import { AvatarColor } from "@/types/AvatarColor";

type IAvatarIconProps = {
  color: AvatarColor;
  userName: string;
};

const AvatarIcon = memo<IAvatarIconProps>(({ color, userName }) => {
  const styles = useStyles(color);
  const extractFirstLetterInEveryWord = (str: string) =>
    str
      .split(" ")
      .map((word) => word[0])
      .join("");

  return (
    <View style={styles.avatar}>
      <Text style={styles.text}>
        {extractFirstLetterInEveryWord(userName).slice(0, 2)}
      </Text>
    </View>
  );
});

const useStyles = makeStyles((theme, color: AvatarColor) => ({
  avatar: {
    backgroundColor: color,
    width: 60,
    height: 60,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    color: theme.colors.white,
    fontWeight: "bold",
  },
}));

AvatarIcon.displayName = "AvatarIcon";

export default AvatarIcon;
