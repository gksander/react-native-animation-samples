import * as React from "react";
import { View } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";

type CircularProgressProps = {
  totalAmount: number;
  currentAmount: number;
  innerText?: string;
};

const R = 25;

export const CircularProgress: React.FC<CircularProgressProps> = ({
  totalAmount,
  currentAmount,
  innerText,
}) => {
  // Derivations
  const alpha = -Math.PI / 2 + (currentAmount / totalAmount) * 2 * Math.PI;
  const endX = R * Math.cos(alpha) || 0;
  const endY = R * Math.sin(alpha) || 0;
  const largeArc = endX < 0 ? 1 : 0;

  return (
    <View style={{ aspectRatio: 1, backgroundColor: "blue" }}>
      <Svg width="100%" height="100%" viewBox={`${-R} ${-R} ${2 * R} ${2 * R}`}>
        <Path
          d={`M0,${-R} A${R},${R} 0 ${largeArc} 1 ${endX} ${endY}`}
          stroke="red"
        />
        {/*<Rect x={-50} y={-50} width={25} height={25} fill="green" />*/}
        <Circle cx={endX} cy={endY} r={3} fill="green" />
      </Svg>
    </View>
  );
};
