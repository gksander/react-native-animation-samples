import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { ROUTES } from "./config/routes";
import { HomeView } from "./views/Home/Home.view";
import { ImageLoadView } from "./views/ImageLoad/ImageLoad.view";
import { ButtonsView } from "./views/Buttons/Buttons.view";
import { PokemonSliderView } from "./views/PokemonSlider/PokemonSlider.view";

// Drawer nav
const Drawer = createDrawerNavigator();

// Drawer Routes
const DRAWER_ROUTES = [
  { name: ROUTES.HOME, component: HomeView },
  { name: ROUTES.IMAGE_LOAD, component: ImageLoadView },
  { name: ROUTES.BUTTONS, component: ButtonsView },
  { name: ROUTES.POKEMON_SLIDER, component: PokemonSliderView },
];

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName={ROUTES.HOME}>
        {DRAWER_ROUTES.map((route) => (
          <Drawer.Screen
            key={route.name}
            name={route.name}
            component={route.component}
          />
        ))}
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({});
