import { Text, makeStyles } from "@rneui/themed";
import { useWatch } from "react-hook-form";
import { View } from "react-native";

const PayeeSelectForm = () => {
  const styles = useStyles();

  const groupIdWatch = useWatch({ name: "groupId" });

  return (
    <View style={styles.container}>
      <Text>PayeeSelectForm</Text>
    </View>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
  },
}));

export default PayeeSelectForm;
