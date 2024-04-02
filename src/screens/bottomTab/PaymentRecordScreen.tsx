import { Text, makeStyles } from "@rneui/themed";
import { View } from "react-native";

import { IBottomTabScreenProps } from "@/types/navigation";

const PaymentRecordScreen = ({
  navigation,
  route,
}: IBottomTabScreenProps<"PaymentRecord">) => {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <Text h1>Payments</Text>
    </View>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 16,
  },
}));

export default PaymentRecordScreen;
