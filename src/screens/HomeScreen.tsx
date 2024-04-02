import { Entypo, Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/core";
import { makeStyles } from "@rneui/themed";
import { ReactNode, forwardRef, useEffect, useMemo, useRef } from "react";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import StyledText from "@/components/common/StyledText";
import UserStoryButton from "@/components/user/UserStoryButton";
import { Post, posts } from "@/data/posts";
import { users } from "@/data/users";
import useCollapsibleHeader from "@/hooks/useCollapsibleHeader";
import { IBottomTabScreenProps, IStackScreenProps } from "@/types/navigation";

const HEADER_HEIGHT = 64;

const HomeScreen = ({ navigation }: IStackScreenProps<"Home">) => {
  const insets = useSafeAreaInsets();
  const styles = useStyles();
  const flatListRef = useRef<FlatList<Post>>(null);
  const isFocused = useIsFocused();
  const bottomTabNavigation =
    navigation.getParent<IBottomTabScreenProps<"Main">["navigation"]>();

  const { onShowHeader, scrollHandler, animatedHeaderStyle } =
    useCollapsibleHeader(
      useMemo(
        () => ({
          headerHeight: HEADER_HEIGHT,
          scrollViewRef: flatListRef,
        }),
        [],
      ),
    );

  useEffect(() => {
    const unsubscribe = bottomTabNavigation?.addListener("tabPress", () => {
      if (isFocused) {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
        onShowHeader();
      }
    });
    return unsubscribe;
  }, [isFocused, navigation, onShowHeader, bottomTabNavigation]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Animated.FlatList
        ref={flatListRef as any}
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        style={styles.scrollView}
        data={posts}
        contentContainerStyle={styles.contentContainer}
        stickyHeaderIndices={[0]}
        stickyHeaderHiddenOnScroll
        StickyHeaderComponent={forwardRef<
          Animated.View,
          { children: ReactNode }
        >(({ children }, ref) => (
          <Animated.View ref={ref} style={animatedHeaderStyle}>
            {children}
          </Animated.View>
        ))}
        ListHeaderComponent={() => {
          return (
            <View style={styles.appBarHeader}>
              <StyledText h3 style={styles.whiteColor}>
                Calvin
              </StyledText>
              <TouchableOpacity
                onPress={() => navigation.navigate("ChatDetail", { id: "" })}
              >
                <Ionicons
                  name="chatbox-ellipses-outline"
                  size={24}
                  color="white"
                />
              </TouchableOpacity>
            </View>
          );
        }}
        renderItem={({ item, index }) => {
          const user = users.find((user) => user.id === item.userId);
          const isFirst = index === 0;

          return (
            <View>
              {isFirst && (
                <ScrollView
                  horizontal
                  style={styles.storyScrollView}
                  contentContainerStyle={styles.storyContentContainer}
                  showsHorizontalScrollIndicator={false}
                >
                  {users.map((user) => {
                    return <UserStoryButton key={user.id} userId={user.id} />;
                  })}
                </ScrollView>
              )}
              {user && (
                <Pressable
                  style={styles.userRow}
                  onPress={() =>
                    navigation.navigate("Profile", { userId: item.userId })
                  }
                >
                  <Image
                    source={{ uri: user.imageUrl }}
                    style={styles.userAvatar}
                  />
                  <StyledText style={styles.userName}>{user.name}</StyledText>
                </Pressable>
              )}
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.image}
                resizeMode="contain"
              />
            </View>
          );
        }}
      />
    </View>
  );
};

const useStyles = makeStyles((theme) => {
  return {
    container: {
      flex: 1,
      backgroundColor: theme.colors.black,
    },
    contentContainer: {
      paddingVertical: 0,
    },
    whiteColor: {
      color: theme.colors.white,
    },
    appBarHeader: {
      backgroundColor: theme.colors.black,
      borderBottomWidth: 1,
      borderColor: theme.colors.grey0,
      height: HEADER_HEIGHT,
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
    },
    scrollView: {
      marginTop: "auto",
    },
    image: {
      width: "100%",
      aspectRatio: 4 / 3,
      marginBottom: 16,
      backgroundColor: theme.colors.grey0,
    },

    storyScrollView: {
      paddingVertical: 12,
    },
    storyContentContainer: {
      gap: 16,
      paddingHorizontal: 16,
      marginBottom: 16,
    },

    userRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 8,
      marginBottom: 16,
    },
    userName: {
      color: theme.colors.white,
      fontSize: 12,
      fontWeight: "bold",
    },
    userAvatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      marginRight: 8,
      backgroundColor: theme.colors.grey0,
    },
  };
});

export default HomeScreen;
