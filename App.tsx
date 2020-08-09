import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <View>
        <Text>Hey world</Text>
      </View>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({});
