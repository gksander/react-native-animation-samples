import * as React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppText } from "../../components/AppText";
import { Animated, Image, StyleSheet, View } from "react-native";
import { PokeDetail, pokemonData1 } from "../../utils/pokemonData1";
import { SHADOW_STYLES } from "../../utils/styleUtils";
import { Spacer } from "../../components/Spacer";
import { LinearGradient } from "expo-linear-gradient";

// Constants
const CONTAINER_PADDING = 24;

// Flatlist details
export const FlatlistCardDisappear: React.FC = () => {
  const scrollY = React.useRef(new Animated.Value(0)).current;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Animated.FlatList
        data={pokemonData1}
        keyExtractor={(item: PokeDetail) => item.name}
        renderItem={({ item }: { item: PokeDetail }) => (
          <PokeCard pokemon={item} />
        )}
        onScroll={Animated.event(
          [
            {
              nativeEvent: { contentOffset: { y: scrollY } },
            },
          ],
          { useNativeDriver: true },
        )}
        scrollEventThrottle={16}
        bounces={false}
        contentContainerStyle={{
          padding: CONTAINER_PADDING,
        }}
        ItemSeparatorComponent={ItemSpacer}
      />
    </SafeAreaView>
  );
};

// The Poke card
const PokeCard: React.FC<{ pokemon: PokeDetail }> = ({ pokemon }) => {
  return (
    <View style={[styles.card, SHADOW_STYLES.default]}>
      <LinearGradient
        colors={[pokemon.lightMuted, "transparent"]}
        locations={[0, 0.3]}
        style={[StyleSheet.absoluteFill, { borderRadius: 8 }]}
        start={{ x: 1, y: 1 }}
        end={{ x: 0, y: -4 }}
      />
      <View>
        <Image
          source={pokemon.image}
          style={{ width: 100, height: 100, resizeMode: "contain" }}
        />
      </View>
      <Spacer width={CONTAINER_PADDING} />
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <AppText style={{ fontSize: 24, color: pokemon.darkVibrant }}>
            {pokemon.name}
          </AppText>
          <AppText style={{ fontSize: 20, color: pokemon.darkVibrant }}>
            #{pokemon.number}
          </AppText>
        </View>
        <Spacer height={8} />
        <AppText numberOfLines={4}>{pokemon.description}</AppText>
      </View>
    </View>
  );
};

const ItemSpacer: React.FC = () => (
  <View style={{ height: CONTAINER_PADDING }} />
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 8,
    flexDirection: "row",
    // overflow: "hidden",
  },
});
