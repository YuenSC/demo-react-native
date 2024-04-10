import GorhomBottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { makeStyles } from "@rneui/themed";
import { ComponentProps, forwardRef } from "react";
import { StyleSheet } from "react-native";

type IStyledBottomSheetProps = ComponentProps<typeof GorhomBottomSheet>;

const StyledBottomSheet = forwardRef<
  GorhomBottomSheet,
  IStyledBottomSheetProps
>(({ children, ...props }, ref) => {
  const styles = useStyles();

  return (
    <GorhomBottomSheet
      {...props}
      ref={ref}
      containerStyle={[props.containerStyle]}
      backgroundStyle={[styles.background, props.backgroundStyle]}
      handleIndicatorStyle={[
        styles.handleIndicator,
        props.handleIndicatorStyle,
      ]}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          opacity={0.5}
          enableTouchThrough={false}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          style={[styles.backdrop, StyleSheet.absoluteFillObject]}
        />
      )}
    >
      {children}
    </GorhomBottomSheet>
  );
});

const useStyles = makeStyles((theme) => ({
  backdrop: {
    backgroundColor: theme.colors.backdrop,
  },
  background: {
    backgroundColor: theme.colors.modal,
  },
  handleIndicator: {
    backgroundColor: theme.colors.black,
  },
}));

StyledBottomSheet.displayName = "BottomSheet";

export default StyledBottomSheet;
