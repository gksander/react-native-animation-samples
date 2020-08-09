import { Platform, StyleSheet } from "react-native";

export const SHADOW_STYLES = StyleSheet.create({
  default: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
