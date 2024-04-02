import { Button, Input, Text, makeStyles } from "@rneui/themed";
import { memo } from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";

import { useAppDispatch, useAppSelector } from "@/hooks/reduxHook";
import { addGroup } from "@/store/reducers/groups";
import { updateProfile } from "@/store/reducers/profile";
import { ICreateGroupPayload } from "@/types/GroupCreate";

import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

type IGroupFormProps = {
  groupId?: string;
  onSubmit: (groupId: string) => void;
};

const GroupForm = memo<IGroupFormProps>(({ groupId, onSubmit }) => {
  const styles = useStyles();
  const dispatch = useAppDispatch();

  const group = useAppSelector((state) =>
    state.groups.groups.find((group) => group.id === groupId),
  );
  const profile = useAppSelector((state) => state.profile);
  const { control, handleSubmit } = useForm<ICreateGroupPayload>({
    defaultValues: {
      name: "Calvin Group", // TODO: remove default value after testing,
      members: [
        { id: profile.id, name: profile.name },
        { id: "cyu", name: "Cyu" },
        { id: "ching to", name: "Ching To" },
      ],
    },
  });

  return (
    <View style={styles.container}>
      <Text h1 style={styles.title}>
        {group?.name || "Create Group"}
      </Text>
      <Controller
        control={control}
        name="name"
        rules={{ required: "Group Name is required" }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <Input
            autoFocus
            onChangeText={onChange}
            value={value}
            placeholder="Your first group expense"
            label="Group Name"
            errorMessage={error?.message}
          />
        )}
      />
      <Button
        title="Next"
        containerStyle={styles.button}
        onPress={handleSubmit((values) => {
          const createdGroupId = uuidv4();
          dispatch(
            addGroup({
              id: createdGroupId,
              ...values,
              name: values.name.trim(),
            }),
          );
          onSubmit(createdGroupId);
        })}
      />
    </View>
  );
});

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 24,
  },
  button: {
    marginTop: 16,
  },
}));

GroupForm.displayName = "GroupForm";

export default GroupForm;
