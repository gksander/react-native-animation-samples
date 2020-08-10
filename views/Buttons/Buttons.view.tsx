import * as React from "react";
import { SafeAreaView } from "react-native";
import { AppText } from "../../components/AppText";

/**
 * Showcase some buttons
 */
export const ButtonsView: React.FC = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppText>Buttons...</AppText>
    </SafeAreaView>
  );
};
