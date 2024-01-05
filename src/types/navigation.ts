import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";

// Structure of the navigation params
// Tab -> BottomTab -> Stack
// Tab has Chat and BottomTab for switching
// Every Stack Screen is inside the BottomTab

declare global {
  namespace ReactNavigation {
    interface RootParamList extends ITopTabParamList {}
  }
}

export type ITopTabParamList = {
  BottomTab: NavigatorScreenParams<IBottomTabParamList> | undefined;
  Chat: undefined;
};

export type ITopTabScreenProps<Screen extends keyof ITopTabParamList> =
  MaterialTopTabScreenProps<ITopTabParamList, Screen>;

export type IBottomTabParamList = {
  Main: NavigatorScreenParams<IStackParamList> | undefined;
  Settings: undefined;
  AppSuggestions: undefined;
};

export type IBottomTabScreenProps<Screen extends keyof IBottomTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<IBottomTabParamList, Screen>,
    MaterialTopTabScreenProps<ITopTabParamList>
  >;

export type IStackParamList = {
  Home: undefined;
  Profile: { userId: string };
  AppSuggestionDetail: { id: string };
  ChatDetail: { id: string };
};

export type IStackScreenProps<Screen extends keyof IStackParamList> =
  CompositeScreenProps<
    StackScreenProps<IStackParamList, Screen>,
    CompositeScreenProps<
      BottomTabScreenProps<IBottomTabParamList>,
      MaterialTopTabScreenProps<ITopTabParamList>
    >
  >;
