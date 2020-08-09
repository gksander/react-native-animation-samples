import * as React from "react";
import { View, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ItemCard } from "./ItemCard";

// Make 25 items
const ITEMS = Array.from({ length: 25 }).map((_, i) => i + 1);

/**
 * Image loading example.
 * Render FlatList here.
 * The cool stuff happens in ItemCard.tsx
 */
export const ImageLoadView: React.FC = () => {
  return (
    <SafeAreaView>
      <FlatList
        data={ITEMS}
        renderItem={({ item }) => <ItemCard num={item} />}
        keyExtractor={(item) => String(item)}
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 10 }}
        ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
        windowSize={2}
      />
    </SafeAreaView>
  );
};
