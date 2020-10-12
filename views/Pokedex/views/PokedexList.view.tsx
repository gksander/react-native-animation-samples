import * as React from "react";
import { ActivityIndicator, FlatList, SafeAreaView, View } from "react-native";
import { AppText } from "../components/AppText";
import { PokeListContext } from "../components/PokeListContainer";
import { PokeListCard } from "../components/PokeListCard";
import { spacing } from "../styleConfig";

export const PokedexListView: React.FC = () => {
  const {
    list,
    meta: { status, isFetchingMore, fetchMore, canFetchMore },
  } = React.useContext(PokeListContext)!;

  if (status === "loading") return <ActivityIndicator />;
  if (status === "error") return <AppText>Something went wrong</AppText>;

  return (
    <SafeAreaView style={{ backgroundColor: "white" }}>
      <FlatList
        data={list}
        renderItem={({ item }) => (
          <PokeListCard key={item.name} pokemon={item} />
        )}
        contentContainerStyle={{
          padding: spacing.base,
          paddingTop: 2 * spacing.base,
        }}
        onEndReached={() => {
          if (!isFetchingMore && canFetchMore) fetchMore();
        }}
        ItemSeparatorComponent={() => (
          <View style={{ height: 2 * spacing.base }} />
        )}
        ListFooterComponent={
          isFetchingMore ? (
            <View style={{ padding: spacing.base }}>
              <ActivityIndicator />
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
};
