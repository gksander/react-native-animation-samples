// See: https://github.com/catalinmiron/react-native-headphones-carousel/blob/master/App.js
import * as React from "react";
import {
  Animated,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import { data, PokeDetail } from "./data";
import { LinearGradient } from "expo-linear-gradient";
import { AppText } from "../../components/AppText";

// Sizing
const { width } = Dimensions.get("window");
const TICKER_HEIGHT = 40;
const THUMB_SIZE = 50;
const THUMB_IMAGE_SIZE = 0.9 * THUMB_SIZE;

// Extract some values
const breakpoints = data.map((_, i) => i * width);
const pokeLightMutedColors = data.map((poke) => poke.lightMuted);
const pokeDarkVibrantColors = data.map((poke) => poke.darkVibrant);
const pokeNumbers = data.map((poke) => poke.number);

/**
 * Slider
 */
export const PokemonSliderView: React.FC = () => {
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const backgroundColor = scrollX.interpolate({
    inputRange: breakpoints,
    outputRange: pokeLightMutedColors,
  });
  const primaryColor = scrollX.interpolate({
    inputRange: breakpoints,
    outputRange: pokeDarkVibrantColors,
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Backdrop */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor,
          },
        ]}
      />
      <LinearGradient
        colors={["transparent", "#fff"]}
        locations={[0, 0.6]}
        style={[StyleSheet.absoluteFill]}
      />
      {/* Number ticker */}
      <Ticker scrollX={scrollX} />
      <View style={{ flexGrow: 1 }}>
        {/* FlatList of Pokemon */}
        <Animated.FlatList
          data={data}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item: PokeDetail) => item.name}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false },
          )}
          renderItem={({
            item,
            index,
          }: {
            item: PokeDetail;
            index: number;
          }) => (
            <PokeItem
              pokemon={item}
              scrollX={scrollX}
              itemIndex={index}
              primaryColor={primaryColor}
            />
          )}
          scrollEventThrottle={16}
          decelerationRate={-1}
          snapToInterval={width}
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
  scrollX: Animated.Value;
  itemIndex: number;
  primaryColor: Animated.AnimatedInterpolation;
}> = ({ pokemon, scrollX, itemIndex, primaryColor }) => {
  const inputRange = [
    (itemIndex - 1) * width,
    itemIndex * width,
    (itemIndex + 1) * width,
  ];

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
  const translateXHeading = scrollX.interpolate({
    inputRange,
    outputRange: [width * 0.1, 0, -width * 0.1],
  });
  const translateXDescription = scrollX.interpolate({
    inputRange,
    outputRange: [width * 0.7, 0, -width * 0.7],
  });

  return (
    <View style={{ width, justifyContent: "center" }}>
      <View style={{ alignItems: "center" }}>
        <Animated.Image
          source={pokemon.image}
          style={[
            styles.imageStyle,
            {
              opacity,
              transform: [{ scale }, { translateY: -50 }],
            },
          ]}
          resizeMode="contain"
        />
      </View>
      <View style={{ paddingHorizontal: 20 }}>
        <Animated.Text
          style={[
            styles.pokeNameText,
            {
              transform: [{ translateX: translateXHeading }],
              color: primaryColor,
            },
          ]}
        >
          {pokemon.name}
        </Animated.Text>
        <Animated.Text
          numberOfLines={3}
          style={{
            color: "gray",
            transform: [{ translateX: translateXDescription }],
          }}
        >
          {pokemon.description}
        </Animated.Text>
      </View>
    </View>
  );
};

/**
 * Number ticker
 */
const Ticker: React.FC<{ scrollX: Animated.Value }> = ({ scrollX }) => {
  const inputRange = [-width, 0, width];
  const translateY = scrollX.interpolate({
    inputRange,
    outputRange: [TICKER_HEIGHT, 0, -TICKER_HEIGHT],
  });

  return (
    <View style={styles.tickerContainer}>
      <Animated.View style={{ transform: [{ translateY }] }}>
        {pokeNumbers.map((num, index) => (
          <AppText key={index} style={styles.tickerText}>
            <AppText style={styles.tickerSubText}>#</AppText>
            {num}
          </AppText>
        ))}
      </Animated.View>
    </View>
  );
};

/**
 * Pagination on bottom
 */
const Pagination: React.FC<{ scrollX: Animated.Value }> = ({ scrollX }) => {
  const inputRange = [-width, 0, width];
  const translateX = scrollX.interpolate({
    inputRange,
    outputRange: [THUMB_SIZE, 0, -THUMB_SIZE],
  });

  return (
    <View>
      <Animated.View
        style={{
          flexDirection: "row",
          transform: [
            { translateX: width / 2 - THUMB_SIZE / 2 },
            { translateX },
          ],
        }}
      >
        {data.map((pokemon, index) => {
          const opacity = scrollX.interpolate({
            inputRange: [
              (index - 2) * width,
              (index - 1) * width,
              index * width,
              (index + 1) * width,
              (index + 2) * width,
            ],
            outputRange: [0.25, 0.5, 1, 0.5, 0.25],
            extrapolate: "clamp",
          });
          const scale = scrollX.interpolate({
            inputRange: [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ],
            outputRange: [0.7, 1, 0.7],
            extrapolate: "clamp",
          });

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
              <Animated.Image
                source={pokemon.image}
                style={[
                  styles.paginationImage,
                  {
                    opacity,
                    transform: [{ scale }],
                  },
                ]}
              />
            </View>
          );
        })}
      </Animated.View>
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
