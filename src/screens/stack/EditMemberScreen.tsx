import { Text, makeStyles } from "@rneui/themed";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import UserForm from "@/components/userForm/UserForm";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHook";
import { updateUser, userSelector } from "@/store/reducers/users";
import { IStackScreenProps } from "@/types/navigation";

const EditMemberScreen = ({
  navigation,
  route: {
    params: { id },
  },
}: IStackScreenProps<"EditMember">) => {
  const styles = useStyles();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const member = useAppSelector((state) => userSelector(state, id));

  if (!member) {
    return (
      <View style={styles.container}>
        <Text>Member not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <UserForm
        isEdit
        submitButtonText={t("Common:save")}
        userId={id}
        onSubmit={(values) => {
          dispatch(
            updateUser({
              id,
              name: values.name.trim(),
              avatarColor: values.avatarColor,
            }),
          );
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
    paddingVertical: 16,
  },
}));

export default EditMemberScreen;
