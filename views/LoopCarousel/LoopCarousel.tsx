import * as React from "react";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { StyleSheet, View } from "react-native";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";

/**
 * Emulate some FlatList props
 */
type LoopCarouselType = <T>(props: {
  data: T[];
  renderItem: LoopCarouselRenderItem<T>;
  keyExtractor: (item: T, index: number) => string;
  aspectRatio?: number;
}) => React.ReactElement;
/**
 * Render signature available to consumer
 */
export type LoopCarouselRenderItem<T> = (args: {
  item: T;
  index: number;
}) => React.ReactElement;

/**
 * Our actual loop carousel
 */
export const LoopCarousel: LoopCarouselType = ({
  data,
  renderItem,
  keyExtractor,
  aspectRatio = 1,
}) => {
  const [carouselWidth, setCarouselWidth] = React.useState(0);
  const numItems = data?.length || 1;
  const innerContentWidth = numItems * carouselWidth;

  // Track translation
  const translateX = useSharedValue(0);
  // Modularized translateX to be in [0, innerContentWidth], pretend like it's a scroll
  const scrollX = useDerivedValue(() => {
    if (innerContentWidth <= 0) {
      return 0;
    }

    const x = -translateX.value % innerContentWidth;
    return x < 0 ? innerContentWidth + x : x;
  }, [carouselWidth, numItems]);

  const progress = useDerivedValue(() => {
    return carouselWidth <= 0 ? 0 : scrollX.value / carouselWidth;
  });

  /**
   * Tracking pan
   */
  const panHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { currentX: number }
  >({
    // Stateful gesture, so keep track of starting value
    onStart: (_, ctx) => {
      ctx.currentX = translateX.value;
    },
    // Adjust on pan
    onActive: (evt, ctx) => {
      translateX.value = ctx.currentX + evt.translationX;
    },
    // On end, we need to "snap"
    onEnd: (evt, ctx) => {
      const previousI = Math.round(
        carouselWidth > 0 ? ctx.currentX / carouselWidth : 0,
      );
      // 0.2 * evt.velocityX is like, "what if we use this velocity for 200ms?"
      const endI =
        carouselWidth > 0
          ? (translateX.value + 0.2 * evt.velocityX) / carouselWidth
          : 0;

      const newI = (() => {
        // Snap left one spot
        if (endI <= previousI - SNAP_THRESHOLD) {
          return previousI - 1;
        }
        // Snap right one spot
        else if (endI >= previousI + SNAP_THRESHOLD) {
          return previousI + 1;
        }
        // Snap back to where we were
        else {
          return previousI;
        }
      })();

      translateX.value = withSpring(newI * carouselWidth, { mass: 0.2 });
    },
  });

  return (
    <PanGestureHandler
      onGestureEvent={panHandler}
      activeOffsetX={[-10, 10]}
      failOffsetY={[-10, 10]}
    >
      <Animated.View
        onLayout={(evt) => {
          setCarouselWidth(evt.nativeEvent.layout.width);
        }}
        style={styles.wrapper}
      >
        <View style={{ aspectRatio }}>
          {data.map((item, index) => (
            <CarouselItem
              key={keyExtractor(item, index)}
              carouselWidth={carouselWidth}
              numItems={numItems}
              index={index}
              progress={progress}
            >
              {renderItem({ item, index })}
            </CarouselItem>
          ))}
        </View>
        {carouselWidth > 0 && (
          <ScrollBar {...{ scrollX, numItems, carouselWidth }} />
        )}
      </Animated.View>
    </PanGestureHandler>
  );
};

/**
 * Carousel Item
 */
const CarouselItem: React.FC<{
  progress: Animated.SharedValue<number>;
  carouselWidth: number;
  numItems: number;
  index: number;
}> = ({ progress, carouselWidth, numItems, index, children }) => {
  const style = useAnimatedStyle(() => {
    const i = progress.value;

    // This element is in view on LHS of "view window"
    if (isInInterval(i, index, index + 1)) {
      return {
        transform: [{ translateX: -(i % 1) * carouselWidth }],
      };
    }
    // This element is in view on RHS of "view window"
    // We do a LHS-open check so we're not overlapping elements
    else if (
      (index === 0 && isInInterval(i, numItems - 1, numItems, true)) ||
      isInInterval(i, index - 1, index, true)
    ) {
      return {
        transform: [{ translateX: carouselWidth - (i % 1) * carouselWidth }],
      };
    }
    // This element is out of "view window"
    else {
      return {
        transform: [{ translateX: -4 * carouselWidth }],
      };
    }
  });

  return (
    <Animated.View style={[StyleSheet.absoluteFill, style]}>
      {children}
    </Animated.View>
  );
};

const ScrollBar: React.FC<{
  scrollX: Animated.SharedValue<number>;
  numItems: number;
  carouselWidth: number;
}> = ({ scrollX, numItems, carouselWidth }) => {
  const mainScrollBarStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: scrollX.value / numItems,
      },
    ],
    width: withTiming(`${(1 / numItems) * 100}%`),
  }));

  const peekScrollBarStyle = useAnimatedStyle(() => {
    const relativeBarEnd = (scrollX.value + carouselWidth) / numItems;
    const overscrollAmount = relativeBarEnd - carouselWidth;
    return {
      width: overscrollAmount > 0 ? overscrollAmount : 0,
    };
  });

  return (
    <View style={styles.track}>
      <Animated.View style={[styles.bar, mainScrollBarStyle]} />
      <Animated.View style={[styles.bar, peekScrollBarStyle]} />
    </View>
  );
};

function isInInterval(x: number, a: number, b: number, LHSOpen = false) {
  "worklet";
  return (LHSOpen ? x > a : x >= a) && x < b;
}

const SNAP_THRESHOLD = 0.3;
const BAR_HEIGHT = 8;
const styles = StyleSheet.create({
  wrapper: {
    overflow: "hidden",
  },
  track: {
    height: BAR_HEIGHT,
    backgroundColor: "gray",
  },
  bar: {
    height: BAR_HEIGHT,
    backgroundColor: "red",
    position: "absolute",
    top: 0,
    bottom: 0,
    borderRadius: BAR_HEIGHT / 2,
  },
});
