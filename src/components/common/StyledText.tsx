import { Text, TextProps, makeStyles } from "@rneui/themed";
import { memo } from "react";

const StyledText = memo<TextProps>(({ children, ...props }) => {
  const styles = useStyles();

  return (
    <Text
      {...props}
      h1Style={[styles.h1Style, props.h1Style]}
      h2Style={[styles.h2Style, props.h2Style]}
      h3Style={[styles.h3Style, props.h3Style]}
      h4Style={[styles.h4Style, props.h4Style]}
    >
      {children}
    </Text>
  );
});

const useStyles = makeStyles(() => ({
  h1Style: {
    fontSize: 32,
  },
  h2Style: {
    fontSize: 24,
  },
  h3Style: {
    fontSize: 20,
  },
  h4Style: {
    fontSize: 16,
  },
}));

StyledText.displayName = "StyledText";

export default StyledText;
