import BottomSheet from "@gorhom/bottom-sheet";
import { useHeaderHeight } from "@react-navigation/elements";
import { makeStyles } from "@rneui/themed";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { IStackScreenProps } from "@/types/navigation";

const ChatDetailScreen = ({ navigation }: IStackScreenProps<"ChatDetail">) => {
  const styles = useStyles();
  const headerHeight = useHeaderHeight();
  console.log("headerHeight", headerHeight);
  const insets = useSafeAreaInsets();

  return (
    <BottomSheet
      // ref={bottomSheetRef}
      // index={1}
      handleComponent={() => null}
      snapPoints={["100%"]}
      enablePanDownToClose
      onClose={navigation.goBack}
      // onChange={handleSheetChanges}
    >
      <View style={{ marginTop: insets.top }}>
        <Text>Awesome 🎉</Text>
      </View>
    </BottomSheet>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.black,
  },
}));

export default ChatDetailScreen;
