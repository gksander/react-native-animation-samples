import * as React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle, G } from "react-native-svg";

type CircularProgressProps = {
  totalAmount: number;
  currentAmount: number;
  animDuration?: number;
  color?: string;
  radius?: number;
  strokeWidth?: number;
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedInput = Animated.createAnimatedComponent(TextInput);

export const CircularProgress: React.FC<CircularProgressProps> = ({
  totalAmount,
  currentAmount,
  animDuration = 500,
  color = "green",
  radius = 100,
  strokeWidth = 10,
}) => {
  // Derived values
  const CIRCUMFERENCE = 2 * Math.PI * radius;
  const HALF_WIDTH = radius + strokeWidth;

  // Animations
  // Track a shared value
  const animValue = useSharedValue(0);

  /**
   * Animated input props
   */
  const animatedInputProps = useAnimatedProps(() => {
    const percentComplete = animValue.value / totalAmount;

    return {
      text: `${Math.round(animValue.value)}`,
      color: interpolateColor(
        percentComplete,
        [0, 0.5, 1],
        [color, color, "white"],
      ),
      opacity: 1,
    };
  });

  /**
   * Animated progress props. Animate strokeDashOffset to handle animation
   */
  const animatedProgressProps = useAnimatedProps(() => {
    const percentComplete = animValue.value / totalAmount;
    return {
      strokeDashoffset: (1 - percentComplete) * CIRCUMFERENCE,
    };
  });

  /**
   * Animated BG props. Animate color/opacity.
   */
  const animatedBgProps = useAnimatedProps(() => {
    const percentComplete = animValue.value / totalAmount;
    return {
      fill: color,
      fillOpacity: 0.7 * percentComplete,
    };
  });

  // On amount change, animate to new value
  React.useEffect(() => {
    animValue.value = withTiming(currentAmount, {
      duration: animDuration,
      easing: Easing.out(Easing.ease),
    });
  }, [currentAmount, animDuration]);

  return (
    <View style={{ width: radius * 2, height: radius * 2 }}>
      <Svg
        width={radius * 2}
        height={radius * 2}
        viewBox={`${-HALF_WIDTH} ${-HALF_WIDTH} ${2 * HALF_WIDTH} ${
          2 * HALF_WIDTH
        }`}
      >
        <G rotation="-90">
          {/* Progress */}
          <AnimatedCircle
            cx={0}
            cy={0}
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            animatedProps={animatedProgressProps}
          />
          {/* Background */}
          <AnimatedCircle
            cx={0}
            cy={0}
            r={radius}
            stroke={color}
            strokeWidth={1}
            strokeLinejoin="round"
            strokeOpacity="0.1"
            animatedProps={animatedBgProps}
          />
        </G>
      </Svg>
      <AnimatedInput
        undlinerColorAndroid="transparent"
        editable={false}
        defaultValue="0"
        style={[
          StyleSheet.absoluteFill,
          {
            fontSize: radius / 2,
            color,
            fontWeight: "500",
            textAlign: "center",
            textShadowColor: "black",
            textShadowOffset: { width: 2, height: 2 },
            textShadowRadius: 4,
          },
        ]}
        // @ts-ignore
        animatedProps={animatedInputProps}
      />
    </View>
  );
};
