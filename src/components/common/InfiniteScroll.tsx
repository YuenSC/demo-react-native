import { makeStyles } from "@rneui/themed";
import { memo } from "react";
import { FlatListProps, RefreshControl } from "react-native";
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
}: IInfiniteScrollProps<T>) => {
  const styles = useStyles();

  return (
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
};

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.black,
  },
}));

InfiniteScroll.displayName = "InfiniteScroll";
export default memo(InfiniteScroll);
