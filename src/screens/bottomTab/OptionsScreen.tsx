import { AntDesign } from "@expo/vector-icons";
import { Button, Text, makeStyles, useTheme } from "@rneui/themed";
import { Fragment } from "react";
import { Pressable, ScrollView, View } from "react-native";

import { HStack, VStack } from "@/components/common/Stack";
import { useAppSelector } from "@/hooks/reduxHook";
import { currentGroupSelector } from "@/store/reducers/groups";
import { profileUserSelector } from "@/store/reducers/profile";
import { IBottomTabScreenProps } from "@/types/navigation";

const OptionsScreen = ({ navigation }: IBottomTabScreenProps<"Option">) => {
  const styles = useStyles();
  const currentGroup = useAppSelector(currentGroupSelector);
  const profileUser = useAppSelector(profileUserSelector);

  return (
    <ScrollView
      contentContainerStyle={styles.contentContainer}
      style={styles.container}
    >
      <VStack alignItems="stretch">
        <Text h1>Options</Text>
        <Text style={styles.sectionLabel}>
          Hi, {profileUser?.name || "User"}! Hope you are having a great day!
        </Text>
      </VStack>

      {profileUser?.id && (
        <Section
          title="Personal"
          sections={[
            <SectionItem
              title="Profile"
              onPress={() =>
                navigation.navigate("EditMember", {
                  id: profileUser.id,
                })
              }
            />,
          ]}
        />
      )}
      {currentGroup?.id && (
        <Section
          title={`"${currentGroup.name}" Related`}
          sections={[
            <SectionItem
              title="Group Detail"
              onPress={() =>
                navigation.navigate("GroupForm", {
                  step: 0,
                  groupId: currentGroup.id,
                })
              }
            />,
            <SectionItem
              title="Group Members"
              onPress={() =>
                navigation.navigate("UserList", {
                  groupId: currentGroup.id,
                })
              }
            />,
            <SectionItem
              title="Category"
              onPress={() => {}}
              disabled
              itemRight={<Text style={styles.sectionLabel}>Coming Soon</Text>}
            />,
          ]}
        />
      )}

      <Section
        title="App Related"
        sections={[
          <SectionItem
            title="All Members"
            onPress={() => navigation.navigate("UserList", {})}
          />,
          <SectionItem title="Language" onPress={() => {}} />,
          <SectionItem
            title="Online Mode"
            onPress={() => {}}
            disabled
            itemRight={<Text style={styles.sectionLabel}>Coming Soon</Text>}
          />,
        ]}
      />

      <Button
        title="Delete Group"
        type="outline"
        color="error"
        onPress={() => {}}
      />
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
      <HStack style={{ minHeight: 24 }}>
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
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.colors.divider,
    marginTop: 4,
  },
  sectionLabel: {
    fontSize: 12,
    color: theme.colors.grey1,
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
