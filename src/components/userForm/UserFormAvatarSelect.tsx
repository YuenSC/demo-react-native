import { AntDesign } from "@expo/vector-icons";
import { Text, makeStyles, useTheme } from "@rneui/themed";
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
  const { theme } = useTheme();

  if (!userName) {
    return (
      <Text style={styles.emptyText}>
        Username is required for avatar generation
      </Text>
    );
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
                <AntDesign name="check" size={12} color={theme.colors.white} />
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
    right: 8,
    padding: 4,
    width: 20,
    height: 20,
    backgroundColor: theme.colors.success,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  emptyText: {
    color: theme.colors.error,
    fontSize: 12,
    marginLeft: 16,
  },
}));

export default memo(ProfileFormAvatarSelect);
