import { makeStyles } from "@rneui/themed";
import { Text, View } from "react-native";

import StyledText from "@/components/common/StyledText";
import UserStoryButton from "@/components/user/UserStoryButton";
import { users } from "@/data/users";
import { IStackScreenProps } from "@/types/navigation";

const ProfileScreen = ({
  route: {
    params: { userId },
  },
}: IStackScreenProps<"Profile">) => {
  const styles = useStyles();
  const user = users.find((user) => user.id === userId);

  console.log("userId", userId);
  if (!user) return null;

  return (
    <View style={styles.container}>
      <View style={styles.profileRow}>
        <UserStoryButton userId={userId} size="lg" hideName />
        <View style={styles.dataContainer}>
          <View style={styles.dataItem}>
            <StyledText style={styles.dataItemValue}>
              {user.postCount}
            </StyledText>
            <StyledText style={styles.dataItemLabel}>Posts</StyledText>
          </View>
          <View style={styles.dataItem}>
            <StyledText style={styles.dataItemValue}>
              {user.fansCount}
            </StyledText>
            <StyledText style={styles.dataItemLabel}>Fans</StyledText>
          </View>
          <View style={styles.dataItem}>
            <StyledText style={styles.dataItemValue}>
              {user.followingsCount}
            </StyledText>
            <StyledText style={styles.dataItemLabel}>Following</StyledText>
          </View>
        </View>
      </View>
      <View>
        <StyledText style={styles.userName}>{user.name}</StyledText>
        <StyledText style={styles.userDescription}>
          {user.description}
        </StyledText>
      </View>
      <Text>ProfileScreen</Text>
    </View>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.black,
  },
  profileRow: {
    flexDirection: "row",
  },
  dataContainer: {
    marginLeft: 30,
    flexDirection: "row",
    justifyContent: "space-around",
    flex: 1,
  },
  dataItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  dataItemValue: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  dataItemLabel: {
    color: theme.colors.white,
    fontSize: 14,
  },

  userName: {
    marginTop: theme.spacing.md,
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: "bold",
  },
  userDescription: {
    marginTop: theme.spacing.sm,
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: "500",
  },
}));

export default ProfileScreen;
