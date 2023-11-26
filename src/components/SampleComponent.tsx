import { makeStyles } from "@rneui/themed";
import { memo } from "react";
import { Text, View } from "react-native";

type ISampleComponentProps = {};

const SampleComponent = memo<ISampleComponentProps>(() => {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <Text>SampleComponent</Text>
    </View>
  );
});

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.black,
  },
}));

SampleComponent.displayName = "SampleComponent";

export default SampleComponent;
