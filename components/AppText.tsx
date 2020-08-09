import * as React from "react";
import { StyleSheet, Text, TextProps } from "react-native";

export const AppText: React.FC<TextProps> = ({ style, ...rest }) => {
  return <Text style={[styles.text, style]} {...rest} />;
};

const styles = StyleSheet.create({
  text: {},
});
