import { makeStyles } from "@rneui/themed";
import { Text, View } from "react-native";

const GroupDetailScreen = () => {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <Text>GroupDetailScreen</Text>
    </View>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
}));

export default GroupDetailScreen;
