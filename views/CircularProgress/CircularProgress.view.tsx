import * as React from "react";
import { Dimensions, SafeAreaView } from "react-native";
import { CircularProgress } from "./CircularProgress";

const TOTAL = 75;
const { width } = Dimensions.get("window");

export const CircularProgressView: React.FC = () => {
  const [currAmount, setCurrAmount] = React.useState(5);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrAmount(Math.floor(Math.random() * TOTAL));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <CircularProgress
        totalAmount={TOTAL}
        currentAmount={currAmount}
        radius={width / 3}
        strokeWidth={15}
      />
    </SafeAreaView>
  );
};
