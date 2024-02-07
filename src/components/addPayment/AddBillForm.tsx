import { Text, makeStyles } from "@rneui/themed";
import { memo } from "react";
import { View } from "react-native";

type IAddBillFormProps = object;

const AddBillForm = memo<IAddBillFormProps>(() => {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <Text>AddBillForm</Text>
    </View>
  );
});

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
}));

AddBillForm.displayName = "AddBillForm";

export default AddBillForm;
