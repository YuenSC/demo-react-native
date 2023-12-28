import { makeStyles } from "@rneui/themed";
import { memo } from "react";
import { Text, View } from "react-native";

type IProfileTabSceneProps = object;

const ProfileTabScene = memo<IProfileTabSceneProps>(() => {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <Text>ProfileTabScene</Text>
    </View>
  );
});

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.black,
  },
}));

ProfileTabScene.displayName = "ProfileTabScene";

export default ProfileTabScene;
