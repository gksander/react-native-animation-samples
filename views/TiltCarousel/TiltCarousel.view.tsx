import * as React from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
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
const AnimatedImageBackground = Animated.createAnimatedComponent(
  ImageBackground,
);

/**
 * Actual view
 */
export const TiltCarousel: React.FC = () => {
  const scrollX = React.useRef(new Animated.Value(0)).current;

  return (
    <View style={{ flex: 1 }}>
      {/*<Image*/}
      {/*  source={require("./img/summer.jpg")}*/}
      {/*  style={{*/}
      {/*    width,*/}
      {/*    flex: 1,*/}
      {/*    transform: [*/}
      {/*      { perspective: 800 },*/}
      {/*      {*/}
      {/*        translateX: -0.25 * width,*/}
      {/*      },*/}
      {/*      { rotateY: "40deg" },*/}
      {/*    ],*/}
      {/*  }}*/}
      {/*/>*/}
      <Animated.FlatList
        data={SLIDES}
        renderItem={({ item, index }: { item: Slide; index }) => (
          <CarouselSlide slide={item} scrollX={scrollX} index={index} />
        )}
        horizontal
        snapToInterval={width}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        decelerationRate={-1}
        bounces={false}
        keyExtractor={(slide: Slide) => slide.title}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true },
        )}
        contentContainerStyle={{ backgroundColor: "rgba(30,30,30,0.8)" }}
      />
    </View>
  );
};

const CarouselSlide: React.FC<{
  slide: Slide;
  scrollX: Animated.Value;
  index: number;
}> = ({ slide, scrollX, index }) => {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

  const scale = scrollX.interpolate({
    inputRange,
    outputRange: [0.6, 1, 0.6],
  });
  const perspective = scrollX.interpolate({
    inputRange,
    outputRange: [1000, 800, 1000],
  });
  const translateX = scrollX.interpolate({
    inputRange,
    outputRange: [-0.4 * width, 0, 0.4 * width],
  });
  const rotateY = scrollX.interpolate({
    inputRange,
    outputRange: ["-45deg", "0deg", "45deg"],
  });

  return (
    <Animated.View
      style={{
        width,
        flex: 1,
        justifyContent: "center",
        transform: [{ scale }, { perspective }, { translateX }, { rotateY }],
        borderRadius: 30,
        overflow: "hidden",
      }}
    >
      <ImageBackground source={slide.image} style={{ flex: 1 }}>
        <Spacer height={0.7 * height} />
        <View
          style={{
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.3)",
            padding: 16,
          }}
        >
          <AppText
            style={{
              color: "white",
              fontWeight: "bold",
              fontSize: 64,
              textShadowColor: "black",
              textShadowRadius: 4,
              textShadowOffset: {
                width: 1,
                height: 1,
              },
            }}
          >
            {slide.title}
          </AppText>
          <AppText
            style={{
              color: "rgb(230,230,230)",
              fontWeight: "600",
              fontSize: 18,
            }}
          >
            {slide.subtitle}
          </AppText>
        </View>
      </ImageBackground>
    </Animated.View>
  );
};
