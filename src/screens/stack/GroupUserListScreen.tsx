import { makeStyles } from "@rneui/themed";
import { View } from "react-native";

import UserList from "@/components/UserList";
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
      <UserList
        groupId={groupId}
        buttonText="Done"
        onSubmitSuccess={() => {
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
