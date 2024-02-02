import { Button, Input, makeStyles } from "@rneui/themed";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";

import { useAppDispatch } from "@/hooks/reduxHook";
import { addGroup } from "@/store/reducers/groupReducer";
import { ICreateGroupPayload } from "@/types/GroupCreate";
import { IStackScreenProps } from "@/types/navigation";

const CreateGroupScreen = ({ navigation }: IStackScreenProps<"Welcome">) => {
  const styles = useStyles();
  const { control, handleSubmit } = useForm<ICreateGroupPayload>();
  const dispatch = useAppDispatch();

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="name"
        rules={{ required: "Group name is required" }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <Input
            onChangeText={onChange}
            value={value}
            placeholder="Group name"
            label="Group name"
            errorMessage={error?.message}
          />
        )}
      />

      <Button
        title="Create your first group"
        onPress={handleSubmit((values) => {
          dispatch(addGroup(values));
          navigation.goBack();
        })}
      />
    </View>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
    padding: 16,
  },
}));

export default CreateGroupScreen;
