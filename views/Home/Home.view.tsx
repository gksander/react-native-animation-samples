import * as React from "react";
import { Text, View } from "react-native";
import { AppText } from "../../components/AppText";
import { SHADOW_STYLES } from "../../utils/styleUtils";

/**
 * Home view
 */
export const HomeView: React.FC = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View
        style={[
          SHADOW_STYLES.default,
          {
            padding: 10,
            backgroundColor: "white",
          },
        ]}
      >
        <AppText>Home Page</AppText>
      </View>
    </View>
  );
};
