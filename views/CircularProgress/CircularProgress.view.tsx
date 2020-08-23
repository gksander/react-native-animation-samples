import * as React from "react";
import { SafeAreaView } from "react-native";
import { AppText } from "../../components/AppText";
import { CircularProgress } from "./CircularProgress";

const TOTAL = 10;

export const CircularProgressView: React.FC = () => {
  const [currAmount, setCurrAmount] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrAmount((curr) => (curr + 1) % (TOTAL + 1));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CircularProgress totalAmount={TOTAL} currentAmount={currAmount} />
    </SafeAreaView>
  );
};
