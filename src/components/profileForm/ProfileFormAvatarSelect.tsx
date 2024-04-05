import { AntDesign } from "@expo/vector-icons";
import { Text, makeStyles } from "@rneui/themed";
import { memo } from "react";
import { TouchableOpacity, View } from "react-native";

import AvatarIcon from "../AvatarIcon";
import { HStack } from "../common/Stack";

import { AvatarColor } from "@/types/AvatarColor";

type IProfileFormAvatarSelectProps = {
  userName?: string;
  selectedColor?: AvatarColor;
  onSelectColor: (color: AvatarColor) => void;
};

const ProfileFormAvatarSelect = ({
  userName,
  onSelectColor,
  selectedColor,
}: IProfileFormAvatarSelectProps) => {
  const styles = useStyles();

  if (!userName) {
    return <Text>Username is required for avatar generation</Text>;
  }

  return (
    <HStack flexWrap="wrap" gap={6} style={styles.container}>
      {Object.entries(AvatarColor).map(([key, color]) => (
        <TouchableOpacity
          key={key}
          activeOpacity={0.8}
          style={styles.button}
          onPress={() => onSelectColor(color)}
        >
          <View>
            <AvatarIcon color={color} userName={userName} />
            {selectedColor === color && (
              <View style={styles.selectedTick}>
                <AntDesign name="check" size={12} color="white" />
              </View>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </HStack>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: 16,
  },
  button: {
    width: "32%",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedTick: {
    position: "absolute",
    bottom: 0,
    right: 0,
    padding: 4,
    width: 20,
    height: 20,
    backgroundColor: theme.colors.success,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
}));

export default memo(ProfileFormAvatarSelect);
