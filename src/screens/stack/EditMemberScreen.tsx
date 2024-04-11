import { Text, makeStyles } from "@rneui/themed";
import { useEffect } from "react";
import { View } from "react-native";

import UserForm from "@/components/userForm/UserForm";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHook";
import { updateMember } from "@/store/reducers/groups";
import { IStackScreenProps } from "@/types/navigation";

const EditMemberScreen = ({
  navigation,
  route: {
    params: { id, groupId },
  },
}: IStackScreenProps<"EditMember">) => {
  const styles = useStyles();
  const dispatch = useAppDispatch();

  const group = useAppSelector((state) =>
    state.groups.groups.find((group) => group.id === groupId),
  );
  const member = group?.members?.find((member) => member.id === id);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: member?.name
        ? `Edit ${member.name}'s information`
        : "Edit Member",
    });
  }, [member?.name, navigation]);

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
        groupId={groupId}
        submitButtonText="Save"
        userId={id}
        type="groupUser"
        onSubmit={(values) => {
          dispatch(
            updateMember({
              groupIds: groupId,
              id,
              name: values.name.trim(),
              avatarColor: values.avatarColor,
            }),
          );
          navigation.goBack();
        }}
        onDelete={() => {
          navigation.navigate("GroupDeleteUserBottomSheet", {
            groupId,
            userId: id,
          });
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
