import { memo } from "react";
import {
  FlatListProps,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";

interface IInfiniteScrollProps<T> extends FlatListProps<T> {
  isFetchingMore?: boolean;
  onRefetch?: () => Promise<unknown>;
  isRefetching?: boolean;
  onFetchMore?: () => void;
  hasMore?: boolean;
}

const InfiniteScroll = <T,>({
  isFetchingMore,
  onRefetch,
  isRefetching,
  onFetchMore,
  hasMore,
  ...props
}: IInfiniteScrollProps<T>) => (
  <FlatList
    {...props}
    refreshControl={
      onRefetch ? (
        <RefreshControl
          refreshing={Boolean(isRefetching)}
          onRefresh={onRefetch}
        />
      ) : undefined
    }
  />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

InfiniteScroll.displayName = "InfiniteScroll";
export default memo(InfiniteScroll);
