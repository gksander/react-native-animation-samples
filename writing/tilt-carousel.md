## Overview

React Native has a `FlatList` component that takes a list of items, and then _smartly_ renders an element for each item in the list. At first glance, it _seems_ like this component is just for rendering large lists of elements. It turns out, React Native `FlatList`s can do a _ton_ of cool stuff! In this post, we'll look at one of those things: building a carousel that has a fancy tilt effect. See the sample below.

[Sample of tilt carousel](https://dev-to-uploads.s3.amazonaws.com/i/ze7ig1yyk8gwbi00svpe.gif)

You can find the source code for this example [here](https://github.com/gksander/react-native-animation-samples/blob/master/views/TiltCarousel/TiltCarousel.view.tsx).

## A Little Setup

Let's start with a little setup. We'll create a list of data that we'll use to render our carousel slides. We'll also
 use the `Dimensions` API from React Native to get the width and height of the screen.
 
```ts
import { Dimensions } from "react-native";

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
```

## Building the Carousel

Now that we have our data setup, let's go ahead and put together the bones of our carousel. This will consist of a
 `FlatList` that will take in our `SLIDES` data, and a custom component `CarouselSlide` that is used to render each
  slide of the carousel. There's a `styles` object that holds styles for the carousel, but let's not worry about
   those details right now.

```tsx
/**
 * Tilt Carousel View
 */
export const TiltCarousel: React.FC = () => {
  return (
    <View style={styles.background}>
      <FlatList
        data={SLIDES}
        renderItem={({ item, index }: { item: Slide; index: number }) => (
          <CarouselSlide slide={item} />
        )}
        horizontal
        snapToInterval={width}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        decelerationRate={-1}
        bounces={true}
        keyExtractor={(slide: Slide) => slide.title}
      />
    </View>
  );
};

/**
 * Slide item
 */
const CarouselSlide: React.FC<{
  slide: Slide;
}> = ({ slide }) => {
  return (
    <View style={styles.cardContainer}>
      <ImageBackground source={slide.image} style={{ flex: 1 }}>
        <Spacer height={0.7 * height} />
        <View style={styles.cardContentContainer}>
          <AppText style={styles.title}>{slide.title}</AppText>
          <AppText style={styles.subtitle}>{slide.subtitle}</AppText>
        </View>
      </ImageBackground>
    </View>
  );
};
```

There are a few things to note here:

- We'll use the `horizontal` prop on the `FlatList` to make our list render horizontally.
- We'll set `snapToInterval={width}` so that the `FlatList` "snaps" at certain intervals. Importantly: we'll snap to
 `width`, the width of the screen. Each carousel slide has a width of `width` as well, so that we can snap each carousel slide into view.
- We'll use `scrollEventThrottle={16}` and `decelerationRate={-1}` to control the carousel's slide physics.
- At this point, the `SlideCarousel` just renders an image background using the slide's image, and some text. I'm using custom `AppText` and `Spacer` components that render text and space, accordingly.
 
 At this point, we've got a pretty good start. This is what we have:
 
 [Basic version](https://dev-to-uploads.s3.amazonaws.com/i/372nxskjc6x4clgpa14g.gif)

However, we're going to spice this thing up with some custom animation!

## Sprinkling in Some Animation

We're going to give our carousel slides a nice "tilt" effect when they come in and out of view. To do this, we need to do a couple things:

- Keep track of the user's scroll position in the `FlatList`.
- Use this scroll position to animate some transforms on each carousel slide.

### Keeping Track of the User's Scroll Position.

To add animation around our `FlatList` scroll, we need to create and track an `Animated` value that corresponds to how far the user has scrolled along in the `FlatList`. React Native has an `Animated.Value` API for creating an animated value (that we can animate the value of and use in styles to created animated effects). We'll use this animated value to _track_ how far the user has scrolled along in the list. To do this, we'll use the `onScroll` prop of the `FlatList` and the `Animated.event` API. We'll go ahead and pass the `scrollX` value on to each `<CarouselSlide />` element.


```diff
export const TiltCarousel: React.FC = () => {
+  const scrollX = React.useRef(new Animated.Value(0)).current;

  return (
    <View style={styles.background}>
      <Animated.FlatList
        data={SLIDES}
        renderItem={({ item, index }: { item: Slide; index: number }) => (
-         <CarouselSlide slide={item} />
+         <CarouselSlide slide={item} scrollX={scrollX} index={index} />
        )}
        horizontal
        snapToInterval={width}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        decelerationRate={-1}
        bounces={true}
        keyExtractor={(slide: Slide) => slide.title}
+       onScroll={Animated.event(
+         [{ nativeEvent: { contentOffset: { x: scrollX } } }],
+         { useNativeDriver: true },
+       )}
      />
    </View>
  );
};

const CarouselSlide: React.FC<{
  slide: Slide;
+ scrollX: Animated.Value;
+ index: number;
-}> = ({ slide }) => {
+}> = ({ slide, scrollX, index }) => {
```

This change hasn't added any visual changes, but now we have access to `scrollX`, which keeps track of the user's horizontal scroll position - and we'll use this to animate the carousel slides.

### Animate the Carousel Slides

We're going to add a little "tilt" effect to the carousel slides.

[Sample of the tilt animation](https://dev-to-uploads.s3.amazonaws.com/i/y35f6z9slels2jxkflag.gif)

To do this, we're going to use the value of `scrollX` (how far the user has scrolled along the `FlatList`) and the value of `index` (the index for each slide item). We'll apply a few transformations to the carousel slide that we'll eventually animate. For now, let's just do a little setup.

```tsx
const CarouselSlide: React.FC<{
  slide: Slide;
  scrollX: Animated.Value;
  index: number;
}> = ({ slide, scrollX, index }) => {
  // Transforms
  const opacity = 1;
  const scale = 1;
  const perspective = 800;
  const translateX = 0;
  const rotateY = '0deg';

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
```

In the above code snippet, we're setting some base values for `opacity`, `scale`, `perspective`, `translateX`, and `rotateY` - and then applying these to our slide wrapper. We also turned the `View` into an `Animated.View`, since we'll be turning the aforementioned property values into _animated_ values.

Now, let's talk about these properties that we'll be animating - and why.

- We'll animate `opacity` so that as the slide comes in/out of view, we can add a bit of a "disappearing" effect.
- We'll animate `scale` so that as the slide comes in/out of view, it shrinks/grows a little bit.
- We'll animate `perspective`, `translateX`, and `rotateY` to give the slide a "tilt" effect. If you swipe the card out to the left, it should "tilt" around the left side of the screen. If you swipe the card out to the right, it should "tilt" around the right side of the screen.

Let's fill these animated values in, and then look at the logic behind them.

```ts
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
```

At this point, we've created the "tilt" effect! But we need to loop back and take a look at how we constructed these animated values.

#### Animated Interpolation

React Native animated values have an `interpolate` method that allows us to transform an animated value. This is a tremendously powerful tool! We're going to be transforming our `scrollX` value. The `interpolate` method takes an `inputRange` and an `outputRange` that defines the transformation.

In our case, we have this line:

```ts
const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
```

We can think of this as three "breakpoints" that we'll map to relative to each slide. For example, for the first slide, we can think of this as follows:

[Zones for input range](https://dev-to-uploads.s3.amazonaws.com/i/60n5ipfgd2hezkqt0ew0.png)

As you swipe left, `scrollX` will vary from `index * width` to `(index - 1) * width`. If you were to swipe right, it'd vary from `index * width` to `(index + 1) * width`. Therefore, we can think of this `inputRange` as defining the breakpoints for when the slide is all the way out of the screen's view (to the left), when the slide is fully centered in the screen's view, and all the way out of the screen's view (to the right).

We can then think about how to transform other values based on these "breakpoints". For example, when a slide is out of the screen's view (either to the left _or_ to the right), we want it to "disappear" by applying `opacity: 1`. When the slide is in the screen's view, we want `opacity: 1`. Therefore, we can define `opacity` with the following transformation on `scrollX`:

```ts
const opacity = scrollX.interpolate({
  inputRange,
  outputRange: [0, 1, 0],
});
```

In a similar manner, we want the slide to sort of "shrink" as it goes out of the view, so we can define:

```ts
const scale = scrollX.interpolate({
  inputRange,
  outputRange: [0.6, 1, 0.6],
});
```

We can think of this like:

- Slide is swiped out to the left? `scale: 0.6`.
- Slide is fully in view? `scale: 1`.
- Slide is swiped out to the right? `scale: 0.6`.
- Smoothly animated everything in-between (using linear interpolation).

#### Transformations for the Tilt

Now all that's left to unwrap is:

```ts
const perspective = scrollX.interpolate({
  inputRange,
  outputRange: [1200, 800, 1200],
});
const translateX = Animated.subtract(scrollX, index * width);
const rotateY = scrollX.interpolate({
  inputRange,
  outputRange: ["-45deg", "0deg", "45deg"],
});
```

I don't want to go into boring details with this, but to create the "tilt" effect around the edges of the screen, we need to perform three consecutive transformations (and order matters!). From a high-level, we can think of these transforms in the following way:

- Use `perspective` to make it seem like the slide is being "pushed away" from the user as the slide is moved off of screen.
- Use `translateX` to shift the slide left/right to determine the axis of rotation for the "tilt".
- Use `rotateY` to create the rotation effect.

With these in place, we get a "tilt" effect! And that concludes this tutorial.

## Conclusion

Although the whole "tilt" effect has some complicated math/transformations, I hope that the setup to these transformations is helpful and gives you the tools to start creating your own fancy animations on top of React Native `FlatList`s! For the purpose of thoroughness, here's the whole code:

```tsx
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
```