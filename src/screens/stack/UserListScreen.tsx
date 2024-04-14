import { makeStyles } from "@rneui/themed";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import UserListForm from "@/components/UserListForm";
import { IStackScreenProps } from "@/types/navigation";

const UserListScreen = ({
  navigation,
  route: {
    params: { groupId },
  },
}: IStackScreenProps<"UserList">) => {
  const styles = useStyles();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <UserListForm
        groupId={groupId}
        buttonText={t("Common:done")}
        onSubmit={navigation.goBack}
      />
    </View>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingVertical: 16,
  },
}));

export default UserListScreen;
