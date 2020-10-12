import * as React from "react";
import { SafeAreaView, Text } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { ROUTES } from "../../config/routes";
import { PokedexListView } from "./views/PokedexList.view";
import { PokedexDetailView } from "./views/PokedexDetail.view";
import { HeaderLeftBack } from "./components/HeaderLeftBack";
import { PokeListContainer } from "./components/PokeListContainer";

const StackNav = createStackNavigator();

export const PokedexView: React.FC = () => {
  return (
    <PokeListContainer>
      <StackNav.Navigator
        screenOptions={({}) => ({
          headerStyle: {
            borderBottomWidth: 0,
          },
          headerLeft: () => <HeaderLeftBack />,
          headerTitle: () => null,
        })}
      >
        <StackNav.Screen
          name={ROUTES.POKEDEX.BASE}
          component={PokedexListView}
          options={{ headerShown: false }}
        />
        <StackNav.Screen
          name={ROUTES.POKEDEX.DETAIL}
          component={PokedexDetailView}
          // options={{ headerLeft: () => <HeaderLeftBack /> }}
        />
      </StackNav.Navigator>
    </PokeListContainer>
  );
};
