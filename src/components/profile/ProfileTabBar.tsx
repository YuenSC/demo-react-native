import { makeStyles } from "@rneui/themed";
import { memo } from "react";
import { Text, View } from "react-native";

type IProfileTabBarProps = object;

const ProfileTabBar = memo<IProfileTabBarProps>(() => {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <Text>ProfileTabBar</Text>
    </View>
  );
});

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.black,
  },
}));

ProfileTabBar.displayName = "ProfileTabBar";

export default ProfileTabBar;
