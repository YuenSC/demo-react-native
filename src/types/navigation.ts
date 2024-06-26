import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";

import { CurrencyCode } from "./Currency";
import { PaymentRecordCreate } from "./PaymentRecord";

// Structure of the navigation params
// Tab -> BottomTab -> Stack
// Tab has Chat and BottomTab for switching
// Every Stack Screen is inside the BottomTab

declare global {
  namespace ReactNavigation {
    interface RootParamList extends IStackParamList {}
  }
}

export type IStackParamList = {
  AddPayment: {
    groupId: string;
    recordId?: string;
    defaultValue?: PaymentRecordCreate;
  };
  Drawer: NavigatorScreenParams<IDrawerParamList> | undefined;

  EditMember: { id: string };
  EditPayment: {
    groupId: string;
    recordId: string;
    defaultValue?: PaymentRecordCreate;
  };
  EditPaymentModal: {
    groupId: string;
    recordId: string;
    defaultValue?: PaymentRecordCreate;
  };

  Language: undefined;

  GroupCreateSuccessBottomSheet: { isOnboarding: boolean };
  GroupDeleteBottomSheet: { groupId: string };
  GroupExistingUserSelectBottomSheet: {
    groupId: string;
  };
  GroupDeletePaymentRecordBottomSheet: {
    groupId: string;
    recordId: string;
  };
  GroupSummary: {
    groupId: string;
  };
  GroupForm: {
    groupId?: string;
    step: number;
    shouldEditUserList?: boolean;
  };

  CurrencyCodeSelect: {
    selectedCurrency: CurrencyCode | null;
    setSelectedCurrency: React.Dispatch<
      React.SetStateAction<CurrencyCode | null>
    >;
    isCurrencyNullable: boolean;
  };
  PaymentFormDatePickerBottomSheet: {
    date: string;
    setDate: React.Dispatch<React.SetStateAction<string>>;
  };
  PaymentFormCurrencySelectBottomSheet: {
    currencyCode: CurrencyCode;
    setCurrencyCode: React.Dispatch<React.SetStateAction<CurrencyCode>>;
  };
  UserList: { groupId?: string };
  UserDeleteBottomSheet: {
    groupId?: string;
    userId: string;
    onDeleteSuccess: () => void;
  };

  Welcome: undefined;
  Onboarding: { step: number; groupId?: string };
};

export type IStackScreenProps<Screen extends keyof IStackParamList> =
  StackScreenProps<IStackParamList, Screen>;

export type IDrawerParamList = {
  BottomTab: { id?: string };
};

export type IDrawerScreenProps<Screen extends keyof IDrawerParamList> =
  CompositeScreenProps<
    DrawerScreenProps<IDrawerParamList, Screen>,
    StackScreenProps<IStackParamList>
  >;

export type IBottomTabParamList = {
  GroupDetail: undefined;
  PaymentRecordList: undefined; // TODO: Update params
  Statistic: undefined; // TODO: Update params
  Option: undefined; // TODO: Update params
};

export type IBottomTabScreenProps<Screen extends keyof IBottomTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<IBottomTabParamList, Screen>,
    CompositeScreenProps<
      DrawerScreenProps<IDrawerParamList>,
      StackScreenProps<IStackParamList>
    >
  >;

export type IAddPaymentTabParamList = {
  Bill: undefined;
  PayeeSelect: undefined;
  PayerSelect: undefined;
};

export type IAddPaymentTabScreenProps<
  Screen extends keyof IAddPaymentTabParamList,
> = CompositeScreenProps<
  MaterialTopTabScreenProps<IAddPaymentTabParamList, Screen>,
  CompositeScreenProps<
    DrawerScreenProps<IDrawerParamList>,
    StackScreenProps<IStackParamList>
  >
>;
