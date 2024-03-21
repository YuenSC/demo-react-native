import { makeStyles } from "@rneui/themed";
import { View } from "react-native";

import AddMemberForm from "@/components/AddMemberForm";
import { IStackScreenProps } from "@/types/navigation";

const GroupAddMemberScreen = ({
  navigation,
  route: {
    params: { groupId },
  },
}: IStackScreenProps<"GroupAddMember">) => {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <AddMemberForm
        groupId={groupId}
        buttonText="Done"
        onSubmit={() => {
          navigation.goBack();
        }}
      />
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

export default GroupAddMemberScreen;
