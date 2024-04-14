import { BottomSheetView } from "@gorhom/bottom-sheet";
import { DrawerActions, TabActions } from "@react-navigation/native";
import { Button, Text, makeStyles } from "@rneui/themed";
import { Trans, useTranslation } from "react-i18next";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";

import StyledBottomSheet from "@/components/common/StyledBottomSheet";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHook";
import { deleteGroup, groupSelector } from "@/store/reducers/groups";
import { IStackScreenProps } from "@/types/navigation";

const GroupDeleteBottomSheet = ({
  navigation,
  route: {
    params: { groupId },
  },
}: IStackScreenProps<"GroupDeleteBottomSheet">) => {
  const insets = useSafeAreaInsets();
  const styles = useStyles(insets);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const group = useAppSelector((state) => groupSelector(state, groupId));

  return (
    <StyledBottomSheet
      onClose={() => navigation.goBack()}
      enablePanDownToClose
      enableDynamicSizing
    >
      <BottomSheetView style={styles.content}>
        <Trans
          i18nKey="GroupDeleteBottomSheet:are-you-sure-to-delete-this-group" // optional -> fallbacks to defaults if not provided
          values={{
            groupName: group?.name,
          }}
          components={{
            Highlight: <Text style={styles.titleHighlight} />,
            Text: <Text style={styles.title} />,
          }}
        />

        <Text style={styles.subtitle}>
          {t("GroupDeleteBottomSheet:warning")}
        </Text>

        <Button
          title={t("Common:back")}
          color="success"
          onPress={() => {
            navigation.goBack();
          }}
        />

        <Button
          title={t("Common:delete")}
          color="error"
          type="clear"
          onPress={() => {
            dispatch(deleteGroup({ id: groupId }));
            navigation.goBack();
            navigation.dispatch(TabActions.jumpTo("GroupDetail"));
            navigation.dispatch(DrawerActions.openDrawer());
          }}
        />
      </BottomSheetView>
    </StyledBottomSheet>
  );
};

const useStyles = makeStyles((theme, inset: EdgeInsets) => ({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: theme.colors.backdrop,
  },

  content: {
    paddingHorizontal: 16,
    paddingBottom: inset.bottom,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 16,
    color: theme.colors.grey1,
  },
  titleHighlight: {
    color: theme.colors.primary,
  },
}));

export default GroupDeleteBottomSheet;
