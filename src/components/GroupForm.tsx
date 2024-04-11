import { Button, Input, Text, makeStyles } from "@rneui/themed";
import { memo } from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import { v4 as uuidv4 } from "uuid";

import { useAppSelector } from "@/hooks/reduxHook";
import { AvatarColor } from "@/types/AvatarColor";
import { IGroupCreatePayload } from "@/types/GroupCreate";

import "react-native-get-random-values";

type IGroupFormProps = {
  groupId?: string;
  onSubmit: (values: IGroupCreatePayload) => void;
  isProfileUserIncluded?: boolean;
};

const GroupForm = memo<IGroupFormProps>(({ groupId, onSubmit }) => {
  const styles = useStyles();

  const isEdit = groupId;

  const group = useAppSelector((state) =>
    state.groups.groups.find((group) => group.id === groupId),
  );
  const profile = useAppSelector((state) => state.profile);
  const { control, handleSubmit } = useForm<IGroupCreatePayload>({
    defaultValues: {
      name: "Calvin Group", // TODO: remove default value after testing,
      members: [
        {
          id: profile.id,
          name: profile.name,
          avatarColor: profile.avatarColor,
        },
        {
          id: uuidv4(),
          name: "Cyu",
          avatarColor: AvatarColor.CoralPink,
        },
        {
          id: uuidv4(),
          name: "Ching To",
          avatarColor: AvatarColor.GoldenrodYellow,
        },
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
        title={isEdit ? "Done" : "Create"}
        containerStyle={styles.button}
        onPress={handleSubmit((values) =>
          onSubmit({
            ...values,
            name: values.name.trim(),
          }),
        )}
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
