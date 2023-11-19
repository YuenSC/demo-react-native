import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

type ISampleComponentProps = {};

const SampleComponent = memo<ISampleComponentProps>(() => (
  <View>
    <Text>SampleComponent</Text>
  </View>
));

const styles = StyleSheet.create({});

SampleComponent.displayName = "SampleComponent";

export default SampleComponent;
