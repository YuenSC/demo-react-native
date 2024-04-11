import { makeStyles } from "@rneui/themed";
import { View } from "react-native";

import UserListForm from "@/components/UserListForm";
import { IStackScreenProps } from "@/types/navigation";

const GroupUserListScreen = ({
  navigation,
  route: {
    params: { groupId },
  },
}: IStackScreenProps<"GroupUserList">) => {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <UserListForm
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
    backgroundColor: theme.colors.modal,
    padding: 16,
  },
}));

export default GroupUserListScreen;
