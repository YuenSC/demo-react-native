import { Button, Input, Text, makeStyles } from "@rneui/themed";
import { memo } from "react";
import { Controller, useController, useForm } from "react-hook-form";
import { View } from "react-native";

import ProfileFormAvatarSelect from "./ProfileFormAvatarSelect";

import { useAppDispatch, useAppSelector } from "@/hooks/reduxHook";
import { updateProfile } from "@/store/reducers/profile";
import { AvatarColor } from "@/types/AvatarColor";
import { IProfileCreatePayload } from "@/types/ProfileCreate";

type IProfileFormProps = {
  isEdit: boolean;
  onSubmit: () => void;
};

const ProfileForm = memo<IProfileFormProps>(({ isEdit, onSubmit }) => {
  const styles = useStyles();
  const { name } = useAppSelector((state) => state.profile);
  const { control, handleSubmit } = useForm<IProfileCreatePayload>({
    defaultValues: {
      name: name || "Calvin", // TODO: remove default value after testing
      avatarColor: AvatarColor.AmethystPurple,
    },
  });
  const dispatch = useAppDispatch();

  const nameController = useController({
    name: "name",
    control,
    rules: { required: "Your name is required" },
  });

  return (
    <View style={styles.container}>
      <Text h1 style={styles.title}>
        {name ? `Hi ${name}` : "Create Profile"}
      </Text>

      <Input
        autoFocus
        onChangeText={nameController.field.onChange}
        value={nameController.field.value}
        placeholder="Name"
        label="Who are you?"
        errorMessage={nameController.fieldState.error?.message}
      />

      <View>
        <Text style={styles.label}>Your avatar color</Text>
        <Controller
          name="avatarColor"
          control={control}
          render={({ field: { value, onChange } }) => (
            <ProfileFormAvatarSelect
              userName={nameController.field.value}
              selectedColor={value}
              onSelectColor={onChange}
            />
          )}
        />
      </View>

      <Button
        title="Next"
        containerStyle={styles.button}
        onPress={handleSubmit((values) => {
          dispatch(updateProfile({ ...values, name: values.name.trim() }));
          onSubmit();
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
  label: {
    color: theme.colors.grey3,
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 10,
  },
}));

ProfileForm.displayName = "ProfileForm";

export default ProfileForm;
