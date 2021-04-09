// See: https://github.com/catalinmiron/react-native-headphones-carousel/blob/master/App.js
import * as React from "react";
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import { pokemonData1, PokeDetail } from "../../utils/pokemonData1";
import { LinearGradient } from "expo-linear-gradient";
import { AppText } from "../../components/AppText";
import RAnimated, {
  interpolate,
  interpolateColor,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

// Sizing
const { width } = Dimensions.get("window");
const TICKER_HEIGHT = 40;
const THUMB_SIZE = 50;
const THUMB_IMAGE_SIZE = 0.9 * THUMB_SIZE;

// Extract some values
const breakpoints = pokemonData1.map((_, i) => i * width);
const pokeLightMutedColors = pokemonData1.map((poke) => poke.lightMuted);
const pokeDarkVibrantColors = pokemonData1.map((poke) => poke.darkVibrant);
const pokeNumbers = pokemonData1.map((poke) => poke.number);

/**
 * Slider
 */
export const PokemonSliderView: React.FC = () => {
  const scrollX = useSharedValue(0);

  const BgAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      scrollX.value,
      breakpoints,
      pokeLightMutedColors,
    ) as string,
  }));

  const scrollHandler = useAnimatedScrollHandler((evt) => {
    scrollX.value = evt.contentOffset.x;
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Backdrop */}
      <RAnimated.View style={[StyleSheet.absoluteFill, BgAnimatedStyle]} />
      <LinearGradient
        colors={["transparent", "#fff"]}
        locations={[0, 0.6]}
        style={[StyleSheet.absoluteFill]}
      />
      {/* Number ticker */}
      <Ticker scrollX={scrollX} />
      <View style={{ flexGrow: 1 }}>
        {/* FlatList of Pokemon */}
        <FlatList
          data={pokemonData1}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item: PokeDetail) => item.name}
          renderItem={({ item, index }) => (
            <PokeItem pokemon={item} scrollX={scrollX} itemIndex={index} />
          )}
          renderScrollComponent={(props) => (
            <RAnimated.ScrollView
              {...props}
              scrollEventThrottle={16}
              decelerationRate={-1}
              snapToInterval={width}
              onScroll={scrollHandler}
            />
          )}
        />
      </View>
      {/* Pagination on bottom */}
      <Pagination scrollX={scrollX} />
    </SafeAreaView>
  );
};

/**
 * Actual pokemon details
 */
const PokeItem: React.FC<{
  pokemon: PokeDetail;
  scrollX: RAnimated.SharedValue<number>;
  itemIndex: number;
  // primaryColor: Animated.AnimatedInterpolation;
}> = ({ pokemon, scrollX, itemIndex }) => {
  const inputRange = [
    (itemIndex - 1) * width,
    itemIndex * width,
    (itemIndex + 1) * width,
  ];

  const animatedImageStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollX.value,
      [(itemIndex - 0.5) * width, itemIndex * width, (itemIndex + 0.5) * width],
      [0, 1, 0],
    ),
    transform: [
      { scale: interpolate(scrollX.value, inputRange, [0, 1, 0]) },
      { translateY: -50 },
    ],
  }));

  const animatedHeadingStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(scrollX.value, inputRange, [
          width * 0.1,
          0,
          -width * 0.1,
        ]),
      },
    ],
    color: interpolateColor(
      scrollX.value,
      breakpoints,
      pokeDarkVibrantColors,
    ) as string,
  }));

  const animatedDescriptionStyle = useAnimatedStyle(() => ({
    color: "gray",
    transform: [
      {
        translateX: interpolate(scrollX.value, inputRange, [
          width * 0.7,
          0,
          -width * 0.7,
        ]),
      },
    ],
  }));

  return (
    <View style={{ width, justifyContent: "center" }}>
      <View style={{ alignItems: "center" }}>
        <RAnimated.Image
          source={pokemon.image}
          style={[styles.imageStyle, animatedImageStyle]}
          resizeMode="contain"
        />
      </View>
      <View style={{ paddingHorizontal: 20 }}>
        <RAnimated.Text style={[styles.pokeNameText, animatedHeadingStyle]}>
          {pokemon.name}
        </RAnimated.Text>
        <RAnimated.Text numberOfLines={3} style={animatedDescriptionStyle}>
          {pokemon.description}
        </RAnimated.Text>
      </View>
    </View>
  );
};

/**
 * Number ticker
 */
const Ticker: React.FC<{ scrollX: RAnimated.SharedValue<number> }> = ({
  scrollX,
}) => {
  const animatedTickerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scrollX.value,
          [-width, 0, width],
          [TICKER_HEIGHT, 0, -TICKER_HEIGHT],
        ),
      },
    ],
  }));

  return (
    <View style={styles.tickerContainer}>
      <RAnimated.View style={animatedTickerStyle}>
        {pokeNumbers.map((num, index) => (
          <AppText key={index} style={styles.tickerText}>
            <AppText style={styles.tickerSubText}>#</AppText>
            {num}
          </AppText>
        ))}
      </RAnimated.View>
    </View>
  );
};

/**
 * Pagination on bottom
 */
const Pagination: React.FC<{ scrollX: RAnimated.SharedValue<number> }> = ({
  scrollX,
}) => {
  const inputRange = [-width, 0, width];

  const animatedWrapperStyle = useAnimatedStyle(() => ({
    flexDirection: "row",
    transform: [
      {
        translateX: width / 2 - THUMB_SIZE / 2,
      },
      {
        translateX: interpolate(scrollX.value, inputRange, [
          THUMB_SIZE,
          0,
          -THUMB_SIZE,
        ]),
      },
    ],
  }));

  return (
    <View>
      <RAnimated.View style={animatedWrapperStyle}>
        {pokemonData1.map((pokemon, index) => (
          <PaginationItem {...{ pokemon, index, scrollX }} key={pokemon.name} />
        ))}
      </RAnimated.View>
    </View>
  );
};

const PaginationItem: React.FC<{
  scrollX: RAnimated.SharedValue<number>;
  pokemon: PokeDetail;
  index: number;
}> = ({ scrollX, pokemon, index }) => {
  const animatedImageStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollX.value,
      [
        (index - 2) * width,
        (index - 1) * width,
        index * width,
        (index + 1) * width,
        (index + 2) * width,
      ],
      [0.25, 0.5, 1, 0.5, 0.25],
    ),
    transform: [
      {
        scale: interpolate(
          scrollX.value,
          [(index - 1) * width, index * width, (index + 1) * width],
          [0.7, 1, 0.7],
        ),
      },
    ],
  }));

  return (
    <View
      key={pokemon.name}
      style={{
        width: THUMB_SIZE,
        height: THUMB_SIZE,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <RAnimated.Image
        source={pokemon.image}
        style={[styles.paginationImage, animatedImageStyle]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    width: width / 1.8,
    height: width / 1.8,
    resizeMode: "contain",
  },
  pokeNameText: {
    fontWeight: "bold",
    fontSize: 36,
    marginBottom: 8,
  },
  tickerContainer: {
    position: "absolute",
    top: 50,
    left: 20,
    overflow: "hidden",
    height: TICKER_HEIGHT,
  },
  tickerText: {
    fontSize: TICKER_HEIGHT,
    lineHeight: TICKER_HEIGHT,
    fontWeight: "bold",
  },
  tickerSubText: {
    fontSize: TICKER_HEIGHT / 1.5,
    color: "rgba(0, 0, 0, 0.7)",
  },
  paginationImage: {
    width: THUMB_IMAGE_SIZE,
    height: THUMB_IMAGE_SIZE,
    resizeMode: "contain",
  },
});
