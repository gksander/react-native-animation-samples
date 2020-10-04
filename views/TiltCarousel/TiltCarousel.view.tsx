import * as React from "react";
import {
  Animated,
  Dimensions,
  ImageBackground,
  StyleSheet,
  View,
} from "react-native";
import { AppText } from "../../components/AppText";
import { Spacer } from "../../components/Spacer";

// Set up our slides
type Slide = {
  image: any;
  title: string;
  subtitle: string;
};
const SLIDES: Slide[] = [
  {
    image: require("./img/summer.jpg"),
    title: "Summer",
    subtitle: "Warm days, fun nights.",
  },
  {
    image: require("./img/fall.jpg"),
    title: "Fall",
    subtitle: "Sweater weather, baby.",
  },
  {
    image: require("./img/winter.jpg"),
    title: "Winter",
    subtitle: "The season to be jolly.",
  },
  {
    image: require("./img/spring.jpg"),
    title: "Spring",
    subtitle: "April showers, may flowers.",
  },
];

// Utils
const { width, height } = Dimensions.get("window");

/**
 * Tilt Carousel View
 */
export const TiltCarousel: React.FC = () => {
  const scrollX = React.useRef(new Animated.Value(0)).current;

  return (
    <View style={styles.background}>
      <Animated.FlatList
        data={SLIDES}
        renderItem={({ item, index }: { item: Slide; index: number }) => (
          <CarouselSlide slide={item} scrollX={scrollX} index={index} />
        )}
        horizontal
        snapToInterval={width}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        decelerationRate={-1}
        bounces={true}
        keyExtractor={(slide: Slide) => slide.title}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true },
        )}
      />
    </View>
  );
};

/**
 * Slide item
 */
const CarouselSlide: React.FC<{
  slide: Slide;
  scrollX: Animated.Value;
  index: number;
}> = ({ slide, scrollX, index }) => {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

  const opacity = scrollX.interpolate({
    inputRange,
    outputRange: [0, 1, 0],
  });
  const scale = scrollX.interpolate({
    inputRange,
    outputRange: [0.6, 1, 0.6],
  });
  const perspective = scrollX.interpolate({
    inputRange,
    outputRange: [1200, 800, 1200],
  });
  const translateX = Animated.subtract(scrollX, index * width);
  const rotateY = scrollX.interpolate({
    inputRange,
    outputRange: ["-45deg", "0deg", "45deg"],
  });

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          opacity,
          transform: [{ scale }, { perspective }, { translateX }, { rotateY }],
        },
      ]}
    >
      <ImageBackground source={slide.image} style={{ flex: 1 }}>
        <Spacer height={0.7 * height} />
        <View style={styles.cardContentContainer}>
          <AppText style={styles.title}>{slide.title}</AppText>
          <AppText style={styles.subtitle}>{slide.subtitle}</AppText>
        </View>
      </ImageBackground>
    </Animated.View>
  );
};

/**
 * Styling
 */
const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: "rgba(30,30,30,0.8)" },
  cardContainer: {
    width,
    flex: 1,
    justifyContent: "center",
    borderRadius: 30,
    overflow: "hidden",
  },
  cardContentContainer: {
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
