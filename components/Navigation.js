import React from "react";
import { createStackNavigator } from "react-navigation";

import { setupBadges } from "../utility/helpers";
import SplashScreen from "./SplashScreen";
import WarningsScreen from "./WarningsScreen";
import MainScreen from "./MainScreen";
import Camera from "./Camera/Camera";
import LocationPickerScreen from "./Challenges/LocationPickerScreen";
import TaxonPickerScreen from "./Challenges/TaxonPickerScreen";
import ChallengeResults from "./Results/ChallengeResults";
import SpeciesDetail from "./Species/SpeciesDetail";
import YourCollection from "./YourCollection";
import BadgesScreen from "./BadgesScreen";

const RootStack = createStackNavigator( {
  Home: { screen: SplashScreen },
  Warnings: { screen: WarningsScreen },
  Main: { screen: MainScreen },
  Camera: { screen: Camera },
  Location: { screen: LocationPickerScreen },
  Taxon: { screen: TaxonPickerScreen },
  Results: { screen: ChallengeResults },
  Species: { screen: SpeciesDetail },
  YourCollection: { screen: YourCollection },
  Badges: { screen: BadgesScreen }
}, {
  navigationOptions: { header: null }
} );

export default App = () => {
  setupBadges();
  return (
    <RootStack />
  );
};
