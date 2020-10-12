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
import { CircularProgressView } from "./views/CircularProgress/CircularProgress.view";
import { FlatlistCardDisappear } from "./views/FlatlistCardDisappear/FlatlistCardDisappear.view";
import { TiltCarousel } from "./views/TiltCarousel/TiltCarousel.view";
import { PokedexView } from "./views/Pokedex/Pokedex.view";

// Drawer nav
const Drawer = createDrawerNavigator();

// Drawer Routes
const DRAWER_ROUTES = [
  { name: ROUTES.HOME, component: HomeView },
  { name: ROUTES.POKEDEX.BASE, component: PokedexView },
  { name: ROUTES.TILT_CAROUSEL, component: TiltCarousel },
  { name: ROUTES.IMAGE_LOAD, component: ImageLoadView },
  { name: ROUTES.BUTTONS, component: ButtonsView },
  { name: ROUTES.POKEMON_SLIDER, component: PokemonSliderView },
  { name: ROUTES.FLATLIST_CARD_DISAPPEAR, component: FlatlistCardDisappear },
  { name: ROUTES.CIRCULAR_PROGRESS, component: CircularProgressView },
];

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName={ROUTES.POKEDEX.BASE}>
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
