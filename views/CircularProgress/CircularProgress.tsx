import * as React from "react";
import {
  Animated,
  Easing,
  NativeMethods,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import Svg, { Circle, G, Path, Rect } from "react-native-svg";

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

  // Local state
  const animValue = React.useRef(new Animated.Value(0)).current;
  const circleRef = React.useRef<NativeMethods>();
  const inputRef = React.useRef<NativeMethods>();

  // Add listener
  React.useEffect(() => {
    animValue.addListener((v) => {
      const percentComplete = v.value / totalAmount;
      const strokeDashoffset = (1 - percentComplete) * CIRCUMFERENCE;
      circleRef?.current?.setNativeProps({ strokeDashoffset });
      inputRef?.current?.setNativeProps({ text: `${Math.round(v.value)}` });
    });

    return () => animValue.removeAllListeners();
  }, [totalAmount, CIRCUMFERENCE]);

  React.useEffect(() => {
    return Animated.timing(animValue, {
      toValue: currentAmount,
      duration: animDuration,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start();
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
          <Circle
            // @ts-ignore
            ref={circleRef}
            cx={0}
            cy={0}
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDashoffset={CIRCUMFERENCE}
            strokeDasharray={CIRCUMFERENCE}
          />
          {/* Background */}
          <Circle
            cx={0}
            cy={0}
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
            strokeOpacity="0.1"
          />
        </G>
      </Svg>
      <AnimatedInput
        // @ts-ignore
        ref={inputRef}
        undlinerColorAndroid="transparent"
        editable={false}
        defaultValue="0"
        style={[
          StyleSheet.absoluteFill,
          {
            fontSize: radius / 2,
            color,
            fontWidth: "900",
            textAlign: "center",
          },
        ]}
      />
    </View>
  );
};
