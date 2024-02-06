import { useHeaderHeight } from "@react-navigation/elements";
import { Button, Text, makeStyles } from "@rneui/themed";
import AnimatedLottieView from "lottie-react-native";
import { View } from "react-native";

import { useAppSelector } from "@/hooks/reduxHook";
import { IDrawerScreenProps } from "@/types/navigation";

const GroupDetailScreen = ({
  route: {
    params: { id },
  },
}: IDrawerScreenProps<"GroupDetail">) => {
  const styles = useStyles();
  const headerHeight = useHeaderHeight();
  const group = useAppSelector(
    (state) => state.groups?.groups?.find((g) => g.id === id)
  );

  if (!group) {
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
      <Text h1>{group.name}</Text>
      <Text>You owed/lent someone how much in total.</Text>
    </View>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 16,
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
}));

export default GroupDetailScreen;
