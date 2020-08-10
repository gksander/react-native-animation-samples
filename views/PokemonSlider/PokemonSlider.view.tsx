// See: https://github.com/catalinmiron/react-native-headphones-carousel/blob/master/App.js
import * as React from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import { AppText } from "../../components/AppText";
import { data, PokeDetail } from "./data";

const { width, height } = Dimensions.get("window");

/**
 * Slider
 */
export const PokemonSliderView: React.FC = () => {
  const scrollX = React.useRef(new Animated.Value(0)).current;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Animated.FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item: PokeDetail) => item.name}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true },
        )}
        renderItem={({ item, index }: { item: PokeDetail; index: number }) => (
          <PokeItem pokemon={item} scrollX={scrollX} itemIndex={index} />
        )}
        scrollEventThrottle={16}
        decelerationRate={-1}
        snapToInterval={width}
      />
    </SafeAreaView>
  );
};

const PokeItem: React.FC<{
  pokemon: PokeDetail;
  scrollX: Animated.Value;
  itemIndex: number;
}> = ({ pokemon, scrollX, itemIndex }) => {
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
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <Animated.Image
          source={pokemon.image}
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
      <View style={{ paddingHorizontal: 20 }}>
        <Animated.Text
          style={{
            fontWeight: "bold",
            fontSize: 36,
            marginBottom: 8,
            transform: [{ translateX: translateXHeading }],
          }}
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

const styles = StyleSheet.create({
  imageStyle: {
    width: width / 1.8,
    height: width / 1.8,
    resizeMode: "contain",
  },
});
