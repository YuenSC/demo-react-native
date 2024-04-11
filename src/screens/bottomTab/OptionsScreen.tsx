import { AntDesign } from "@expo/vector-icons";
import { Button, Text, makeStyles, useTheme } from "@rneui/themed";
import { Fragment } from "react";
import { Pressable, ScrollView, View } from "react-native";

import { HStack } from "@/components/common/Stack";

const OptionsScreen = () => {
  const styles = useStyles();

  return (
    <ScrollView
      contentContainerStyle={styles.contentContainer}
      style={styles.container}
    >
      <Text h1>Options</Text>

      <Section
        title="Personal"
        sections={[<SectionItem title="Profile" onPress={() => {}} />]}
      />

      <Section
        title="Group Related"
        sections={[
          <SectionItem title="Group" onPress={() => {}} />,
          <SectionItem title="Member" onPress={() => {}} />,
          <SectionItem title="Category" onPress={() => {}} />,
        ]}
      />

      <Section
        title="App Related"
        sections={[
          <SectionItem title="Language" onPress={() => {}} />,
          <SectionItem title="Online Mode" onPress={() => {}} />,
        ]}
      />

      <Button title="Delete Group" type="outline" color="error" />
    </ScrollView>
  );
};

const Section = ({
  title,
  sections,
}: {
  title: string;
  sections: React.ReactNode[];
}) => {
  const styles = useStyles();

  return (
    <View>
      <Text style={styles.sectionLabel}>{title}</Text>
      <View style={styles.section}>
        {sections.map((section, index) => {
          const isLast = index === sections.length - 1;
          return (
            <Fragment key={index}>
              {section}
              {isLast ? null : <View style={styles.divider} />}
            </Fragment>
          );
        })}
      </View>
    </View>
  );
};

const SectionItem = ({
  title,
  onPress,
  disabled,
  itemRight,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  itemRight?: React.ReactNode;
}) => {
  const styles = useStyles();
  const { theme } = useTheme();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.sectionItem,
        pressed && styles.sectionItemPressed,
      ]}
      disabled={disabled}
      onPress={onPress}
    >
      <HStack>
        <Text>{title}</Text>
        {itemRight ? (
          itemRight
        ) : (
          <AntDesign name="arrowright" size={24} color={theme.colors.primary} />
        )}
      </HStack>
    </Pressable>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    padding: 16,
    gap: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
  },

  section: {
    backgroundColor: theme.colors.modal,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.colors.divider,
  },
  sectionLabel: {
    fontSize: 12,
    color: theme.colors.grey1,
    marginBottom: 4,
  },
  sectionItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  sectionItemPressed: {
    backgroundColor: theme.colors.grey5,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.divider,
    marginHorizontal: 16,
  },
}));

export default OptionsScreen;
