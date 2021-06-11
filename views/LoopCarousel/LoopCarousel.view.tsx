import * as React from "react";
import { Image, SafeAreaView, StyleSheet, View } from "react-native";
import { AppText } from "../../components/AppText";
import { LoopCarousel, LoopCarouselRenderItem } from "./LoopCarousel";

type Item = {
  name: string;
  number: number;
  image: any;
  darkVibrant: string;
};
const ITEMS: Item[] = [
  {
    name: "Charizard",
    number: 6,
    darkVibrant: `rgb(4, 132, 132)`,
    image: require("../PokemonSlider/img/charizard.png"),
  },
  {
    name: "Pikachu",
    number: 25,
    darkVibrant: `rgb(124, 116, 12)`,
    image: require("../PokemonSlider/img/pikachu.png"),
  },
  {
    name: "Jigglypuff",
    number: 39,
    darkVibrant: `rgb(44, 132, 124)`,
    image: require("../PokemonSlider/img/jigglypuff.png"),
  },
  {
    name: "Mewtwo",
    number: 150,
    darkVibrant: `rgb(84.2, 48.4, 83.1)`,
    image: require("../PokemonSlider/img/mewtwo.png"),
  },
];

export const LoopCarouselView: React.FC = () => {
  const renderItem = React.useCallback<LoopCarouselRenderItem<Item>>(
    ({ item: slide }) => {
      return (
        <View style={{ flex: 1, padding: 16 }}>
          <Image
            source={slide.image}
            style={{ width: 200, height: 200, resizeMode: "contain" }}
          />
          <View style={styles.cardContentContainer}>
            <AppText style={styles.title}>{slide.name}</AppText>
            {/*<Text style={styles.subtitle}>{slide.subtitle}</Text>*/}
          </View>
        </View>
      );
    },
    [],
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LoopCarousel
        data={ITEMS}
        renderItem={renderItem}
        keyExtractor={(slide) => slide.name}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  cardContentContainer: {
    position: "absolute",
    bottom: 32,
    left: 0,
    right: 0,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 16,
  },
  title: {
    color: "white",
    fontWeight: "bold",
    fontSize: 64,
    textShadowColor: "black",
    textShadowRadius: 4,
    textShadowOffset: {
      width: 1,
      height: 1,
    },
  },
  subtitle: {
    color: "rgb(230,230,230)",
    fontWeight: "600",
    fontSize: 18,
  },
});
