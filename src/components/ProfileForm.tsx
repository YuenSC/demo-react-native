import { Button, Input, Text, makeStyles } from "@rneui/themed";
import { memo } from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";

import { useAppDispatch, useAppSelector } from "@/hooks/reduxHook";
import { updateProfile } from "@/store/reducers/profile";
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
    },
  });
  const dispatch = useAppDispatch();

  return (
    <View style={styles.container}>
      <Text h1 style={styles.title}>
        {name ? `Hi ${name}` : "Create Profile"}
      </Text>
      <Controller
        control={control}
        name="name"
        rules={{ required: "Your name is required" }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <Input
            autoFocus
            onChangeText={onChange}
            value={value}
            placeholder="Name"
            label="Who are you?"
            errorMessage={error?.message}
          />
        )}
      />
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
}));

ProfileForm.displayName = "ProfileForm";

export default ProfileForm;
