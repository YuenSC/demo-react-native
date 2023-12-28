import { makeStyles } from "@rneui/themed";
import { memo } from "react";
import { View } from "react-native";

import StyledText from "../common/StyledText";
import UserStoryButton from "../user/UserStoryButton";

import { User } from "@/data/users";

type IProfileHeaderProps = {
  user: User;
};

const ProfileHeader = memo<IProfileHeaderProps>(({ user }) => {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <View style={styles.profileRow}>
        <UserStoryButton userId={user.id} size="lg" hideName />
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
    </View>
  );
});

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing.md,
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

ProfileHeader.displayName = "ProfileHeader";

export default ProfileHeader;
