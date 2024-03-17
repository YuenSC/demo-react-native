import { ListItem, Text, makeStyles } from "@rneui/themed";
import { useState } from "react";
import { useWatch } from "react-hook-form";
import { View } from "react-native";

import { useAppSelector } from "@/hooks/reduxHook";

const PayerSelectForm = () => {
  const styles = useStyles();

  const groupIdWatch = useWatch({ name: "groupId" });
  const group = useAppSelector((state) =>
    state.groups.groups.find((group) => group.id === groupIdWatch)
  );

  const [checked, setChecked] = useState([false, false]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Payer</Text>
      {group?.members.map((member) => (
        <ListItem key={member.id} bottomDivider style={{ width: "100%" }}>
          <ListItem.CheckBox
            iconType="material-community"
            checkedIcon="checkbox-marked"
            uncheckedIcon="checkbox-blank-outline"
            checked={checked[0]}
            onPress={() => setChecked([!checked[0], checked[1]])}
          />
          <ListItem.Content>
            <ListItem.Title>User 1</ListItem.Title>
            <ListItem.Subtitle>CA, US</ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      ))}
    </View>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 8,
    paddingTop: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
  },
  label: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.grey3,
    marginBottom: 6,
  },
}));

export default PayerSelectForm;
