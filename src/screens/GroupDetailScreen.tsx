import { makeStyles } from "@rneui/themed";
import { Text, View } from "react-native";

import { IDrawerScreenProps } from "@/types/navigation";

const GroupDetailScreen = ({
  route: { params },
}: IDrawerScreenProps<"GroupDetail">) => {
  const styles = useStyles();

  console.log("params", params);

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
