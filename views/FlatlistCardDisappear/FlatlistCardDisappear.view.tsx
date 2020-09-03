import * as React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppText } from "../../components/AppText";
import { Animated, Dimensions, Image, StyleSheet, View } from "react-native";
import { PokeDetail, pokemonData1 } from "../../utils/pokemonData1";
import { SHADOW_STYLES } from "../../utils/styleUtils";
import { Spacer } from "../../components/Spacer";
import { LinearGradient } from "expo-linear-gradient";

// Constants
const CONTAINER_PADDING = 24;
const MARGIN = 12;
const CARD_HEIGHT = 130;
const CARD_CONTAINER_HEIGHT = CARD_HEIGHT + 2 * MARGIN;
const height = Dimensions.get("window").height;

// Flatlist details
export const FlatlistCardDisappear: React.FC = () => {
  const y = React.useRef(new Animated.Value(0)).current;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={StyleSheet.absoluteFill}>
        <View style={{ backgroundColor: "red", flex: 1 }} />
        <View style={{ backgroundColor: "blue", flex: 1 }} />
      </View>
      <Animated.FlatList
        data={pokemonData1}
        keyExtractor={(item: PokeDetail) => item.name}
        renderItem={({ item, index }: { item: PokeDetail; index: number }) => (
          <PokeCard pokemon={item} index={index} y={y} />
        )}
        onScroll={Animated.event(
          [
            {
              nativeEvent: { contentOffset: { y } },
            },
          ],
          { useNativeDriver: true },
        )}
        scrollEventThrottle={16}
        bounces={false}
        contentContainerStyle={{
          padding: CONTAINER_PADDING,
          transform: [{ translateY: height / 2 - CARD_CONTAINER_HEIGHT }],
        }}
      />
    </SafeAreaView>
  );
};

// The Poke card
const PokeCard: React.FC<{
  pokemon: PokeDetail;
  y: Animated.Value;
  index: number;
}> = ({ pokemon, y, index }) => {
  // Some computations here
  const offset = Animated.subtract(index * CARD_CONTAINER_HEIGHT, y);
  const opacity = offset.interpolate({
    inputRange: [-CARD_CONTAINER_HEIGHT, 0],
    outputRange: [0.5, 1],
    extrapolate: "clamp",
  });
  const scale = offset.interpolate({
    inputRange: [-CARD_CONTAINER_HEIGHT, 0],
    outputRange: [0.5, 1],
    extrapolate: "clamp",
  });
  const translateY = 0;

  return (
    <Animated.View
      style={[
        styles.card,
        SHADOW_STYLES.default,
        { opacity, transform: [{ scale }, { translateY }] },
      ]}
    >
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
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 8,
    flexDirection: "row",
    // overflow: "hidden",
    marginVertical: MARGIN,
    height: CARD_HEIGHT,
  },
});
