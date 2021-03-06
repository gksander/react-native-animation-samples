import * as React from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { PokeListContext } from "../components/PokeListContainer";
import { IMG_BASE_URL } from "../config";
import { useNavigation, useRoute } from "@react-navigation/native";
import { colors, fontSizes, spacing } from "../styleConfig";
import { Spacer } from "../components/Spacer";
import { Pokeball } from "../components/Pokeball";
import { TypeChip } from "../components/TypeChip";
import { PokemonFromPokeList } from "../types";
import { PokeStatChart } from "../components/PokeStatChart";
import { useGetPokemonColor } from "../useGetPokemonColor";
import { PokeEvolutionChain } from "../components/PokeEvolutionChain";

const { width } = Dimensions.get("window");
const AnimatedFastImage = Animated.createAnimatedComponent(Image);

/**
 * Detail slider view
 */
export const PokedexDetailView: React.FC = () => {
  // Data
  const {
    list,
    meta: { status, canFetchMore, fetchMore, isFetchingMore },
  } = React.useContext(PokeListContext)!;

  // Local animation state
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const flatlistRef = React.useRef<FlatList>(null);

  // When route param for pokemon ID changes, we go to that route
  const navigation = useNavigation();
  const route = useRoute();
  const pokemonId = (route?.params as any)?.["id"];
  const pokemon = list.find((p) => p.id === pokemonId)!;

  // Effect to go to specific index if navigated in with pokemon ID
  React.useEffect(() => {
    const theIndex = list.findIndex((poke) => poke.id === pokemonId);
    if (theIndex > -1) {
      scrollX.setValue(theIndex * width);
      flatlistRef?.current?.scrollToIndex({ index: theIndex, animated: false });
    }
  }, [pokemonId]);

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <Animated.FlatList
        ref={flatlistRef}
        data={list}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.name}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true },
        )}
        getItemLayout={(_, index) => ({
          length: width,
          offset: index * width,
          index,
        })}
        scrollEventThrottle={16}
        decelerationRate={-1}
        snapToInterval={width}
        renderItem={({ item, index }) => (
          <PokeItem pokemon={item} scrollX={scrollX} itemIndex={index} />
        )}
        onEndReached={() =>
          canFetchMore && !isFetchingMore ? fetchMore() : null
        }
      />
    </View>
  );
};

/**
 * Item in the main carousel
 */
const PokeItem: React.FC<{
  pokemon: PokemonFromPokeList;
  scrollX: Animated.Value;
  itemIndex: number;
}> = ({ pokemon, scrollX, itemIndex }) => {
  const inputRange = [
    (itemIndex - 1) * width,
    itemIndex * width,
    (itemIndex + 1) * width,
  ];

  // Transforms
  const scale = scrollX.interpolate({
    inputRange,
    outputRange: [0, 1, 0],
  });
  const opacity = scrollX.interpolate({
    inputRange: [
      (itemIndex - 0.5) * width,
      itemIndex * width,
      (itemIndex + 0.5) * width,
    ],
    outputRange: [0, 1, 0],
  });
  const typesTranslateX = scrollX.interpolate({
    inputRange,
    outputRange: [40, 0, -40],
  });
  // Border color
  const color = useGetPokemonColor(pokemon);
  const pokeballScale = scrollX.interpolate({
    inputRange,
    outputRange: [0.5, 1, 0.5],
  });
  const statChartScale = scrollX.interpolate({
    inputRange,
    outputRange: [0.5, 1, 0.5],
  });

  return (
    <View style={{ width }}>
      <View
        style={{
          alignItems: "center",
          padding: spacing.base,
        }}
      >
        <View
          style={[
            StyleSheet.absoluteFill,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <Animated.View
            style={{
              width: width / 1.9,
              height: width / 1.9,
              transform: [{ scale: pokeballScale }],
            }}
          >
            <Pokeball fill={color} opacity={0.2} />
          </Animated.View>
        </View>

        <AnimatedFastImage
          source={{ uri: `${IMG_BASE_URL}/${pokemon.id}.png` }}
          style={[
            styles.imageStyle,
            {
              opacity,
              transform: [{ scale }],
            },
          ]}
          resizeMode="contain"
        />
      </View>
      <View style={{ padding: spacing.base, flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <Text style={{ color, fontSize: 36, fontWeight: "bold" }}>
            {pokemon.name}
          </Text>
          <Animated.Text
            style={{
              color: colors.gray,
              fontSize: fontSizes.lg,
              fontWeight: "600",
              opacity,
            }}
          >
            #{pokemon.id}
          </Animated.Text>
        </View>
        <Spacer height={spacing.sm} />
        <Animated.View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            transform: [{ translateX: typesTranslateX }],
          }}
        >
          <View style={{ flexDirection: "row" }}>
            {pokemon.types.map((type) => (
              <React.Fragment key={type.name}>
                <TypeChip type={type} />
                <Spacer width={spacing.base} />
              </React.Fragment>
            ))}
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialCommunityIcons
              name="scale"
              color={colors.gray}
              size={fontSizes.base}
            />
            <Spacer width={spacing.xs} />
            <Text style={{ color: colors.gray, fontSize: fontSizes.sm }}>
              {pokemon.weight} lbs
            </Text>
            <Spacer width={spacing.base} />
            <MaterialCommunityIcons
              name="ruler"
              color={colors.gray}
              size={fontSizes.base}
            />
            <Spacer width={spacing.xs} />
            <Text style={{ color: colors.gray, fontSize: fontSizes.sm }}>
              {pokemon.height}'
            </Text>
          </View>
        </Animated.View>
        <Spacer height={spacing.base} />
        <View style={{ flex: 1 }}>
          <View>
            <Text style={{ fontSize: fontSizes.sm, color: colors.gray }}>
              {pokemon.species.flavor_text}
            </Text>
          </View>
          <Spacer height={spacing.sm} />
          <View
            style={{
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Animated.View
              style={{
                width: width / 2,
                height: width / 2,
                transform: [{ scale: statChartScale }],
              }}
            >
              <PokeStatChart pokemon={pokemon} />
            </Animated.View>
          </View>
          <View style={{ height: 100, justifyContent: "center" }}>
            {pokemon?.species?.evolution_chain?.links?.length > 1 && (
              <PokeEvolutionChain pokemon={pokemon} />
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    width: width / 1.8,
    height: width / 1.8,
    resizeMode: "contain",
  },
});
