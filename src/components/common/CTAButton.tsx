import { makeStyles } from "@rneui/themed";
import { memo } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import StyledText from "./StyledText";

type ICTAButtonProps = object;

const CTAButton = memo<ICTAButtonProps>(({ label, ...props }) => {
  const styles = useStyles();

  return (
    <TouchableOpacity style={styles.button} {...props}>
      <StyledText style={styles.buttonText}>{label}</StyledText>
    </TouchableOpacity>
  );
});

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.black,
  },
}));

CTAButton.displayName = "CTAButton";

export default CTAButton;
