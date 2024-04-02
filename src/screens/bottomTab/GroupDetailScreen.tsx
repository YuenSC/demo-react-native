import { AntDesign } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import { Button, Text, makeStyles, useTheme } from "@rneui/themed";
import AnimatedLottieView from "lottie-react-native";
import { useMemo } from "react";
import { TouchableOpacity, View } from "react-native";

import HStack from "@/components/common/HStack";
import { useCurrentGroup } from "@/context/currentGroup";
import { useAppSelector } from "@/hooks/reduxHook";
import { IBottomTabScreenProps } from "@/types/navigation";

const GroupDetailScreen = ({
  navigation,
}: IBottomTabScreenProps<"GroupDetail">) => {
  const styles = useStyles();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const { currentGroup } = useCurrentGroup();

  const profile = useAppSelector((state) => state.profile);

  const memberListText = useMemo(() => {
    if (!currentGroup) return "";
    const names = currentGroup.members
      .filter((item) => item.name !== profile.name)
      .map((item) => item.name);

    return names.length > 2
      ? `${names.slice(0, 2).join(", ")} and more ...`
      : names.join(" and ");
  }, [currentGroup, profile.name]);

  if (!currentGroup) {
    return (
      <View style={[styles.emptyContainer, { paddingBottom: headerHeight }]}>
        <AnimatedLottieView
          autoPlay
          style={styles.lottie}
          source={require("@/assets/lottie/empty.json")}
        />
        <Text style={styles.emptyText}>
          You haven't created any group yet. Please create a group to get
          started
        </Text>
        <Button
          onPress={() => {
            console.log("onPress");
          }}
          title="Add Group"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View>
        <Text h1>{currentGroup.name}</Text>
        <Text>You owed/lent someone how much in total.</Text>
      </View>

      <View>
        <Text style={styles.label}>Member</Text>
        <TouchableOpacity
          style={styles.members}
          onPress={() =>
            navigation.navigate("GroupAddMember", { groupId: currentGroup.id })
          }
        >
          <Text>{`Current: ${profile.name}`}</Text>
          <Text>{memberListText}</Text>
        </TouchableOpacity>
      </View>

      <View>
        <Text style={styles.label}>Payment</Text>
        <HStack>
          <Text>
            You have {currentGroup.paymentRecords.length} records in this group
          </Text>

          <TouchableOpacity
            onPress={() => navigation.navigate("PaymentRecord")}
          >
            <AntDesign
              name="arrowright"
              size={24}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        </HStack>
      </View>
    </View>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 16,
    gap: 16,
  },
  emptyContainer: {
    justifyContent: "center",
    padding: 16,
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  emptyText: {
    textAlign: "center",
    marginBottom: 16,
    fontSize: 16,
    fontWeight: "500",
  },

  lottie: {
    height: 300,
    aspectRatio: 1,
    alignSelf: "center",
    marginBottom: 32,
  },
  label: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  members: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.divider,
    justifyContent: "space-between",
  },
}));

export default GroupDetailScreen;
