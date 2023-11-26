import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";

// Structure of the navigation params
// Stack -> Tab -> BottomTab

declare global {
  namespace ReactNavigation {
    interface RootParamList extends IRootStackParamList {}
  }
}

export type IRootStackParamList = {
  Root: NavigatorScreenParams<ITopTabParamList> | undefined;
  AppSuggestionDetail: {
    id: string;
  };
};

export type IRootStackScreenProps<Screen extends keyof IRootStackParamList> =
  StackScreenProps<IRootStackParamList, Screen>;

export type ITopTabParamList = {
  BottomTab: NavigatorScreenParams<IBottomTabParamList> | undefined;
  Chat: undefined;
};

export type ITopTabScreenProps<Screen extends keyof ITopTabParamList> =
  CompositeScreenProps<
    MaterialTopTabScreenProps<ITopTabParamList, Screen>,
    StackScreenProps<IRootStackParamList>
  >;

export type IBottomTabParamList = {
  Home: undefined;
  Settings: undefined;
  AppSuggestions: undefined;
};

export type IBottomTabScreenProps<Screen extends keyof IBottomTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<IBottomTabParamList, Screen>,
    StackScreenProps<ITopTabParamList>
  >;
