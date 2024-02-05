import { Entypo, Feather } from "@expo/vector-icons";
import { Button, Input, Text, makeStyles } from "@rneui/themed";
import { memo, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { useAppDispatch, useAppSelector } from "@/hooks/reduxHook";
import { addMember } from "@/store/reducers/groups";
import { log } from "@/utils/log";
import "react-native-get-random-values";

type IAddMemberFormProps = {
  groupId: string;
  onSubmit: () => void;
};

const AddMemberForm = memo<IAddMemberFormProps>(({ groupId, onSubmit }) => {
  const styles = useStyles();
  const group = useAppSelector((state) =>
    state.groups.groups.find((group) => group.id === groupId)
  );
  const profile = useAppSelector((state) => state.profile);
  const dispatch = useAppDispatch();
  const [username, setUserName] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  log(group);

  return (
    <View style={styles.container}>
      <Text h1 style={styles.title}>
        Members
      </Text>

      <View>
        {group?.members?.map((member) => {
          const isOwner = member.id === profile.id;
          return (
            <View key={member.id} style={styles.memberContainer}>
              <Text style={styles.memberName}>{member.name}</Text>
              {isOwner ? (
                <Text>(Owner)</Text>
              ) : (
                <TouchableOpacity>
                  <Feather name="edit" size={24} color="black" />
                </TouchableOpacity>
              )}
            </View>
          );
        })}

        {isFocused ? (
          <Animated.View
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(300)}
          >
            <Input
              autoFocus
              onChangeText={setUserName}
              value={username}
              placeholder="Type participant name"
              renderErrorMessage={false}
              containerStyle={{ padding: 12, paddingHorizontal: 12 }}
              inputContainerStyle={{
                borderBottomWidth: 0,
                paddingHorizontal: 0,
              }}
              onEndEditing={() => {
                console.log("username", username);
                if (username) {
                  dispatch(
                    addMember({
                      groupId,
                      name: username,
                    })
                  );
                }
                setUserName("");
                setIsFocused(false);
              }}
            />
          </Animated.View>
        ) : (
          <Animated.View
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(300)}
          >
            <TouchableOpacity
              onPress={() => setIsFocused(true)}
              style={[styles.input]}
            >
              <Entypo name="plus" size={24} color="black" />
              <Text style={styles.memberName}>Add participant</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>

      <Button title="Next" containerStyle={styles.button} onPress={onSubmit} />
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

  memberContainer: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grey4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  memberName: {
    fontSize: 18,
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    height: 64,
    paddingHorizontal: 8,
  },
}));

AddMemberForm.displayName = "AddMemberForm";

export default AddMemberForm;
