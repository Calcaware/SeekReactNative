// @flow

import React from "react";

import {
  ImageBackground,
  View
} from "react-native";

import ChallengeGrid from "./ChallengeGrid";
import ChallengeHeader from "./ChallengeHeader";
import ChallengeFooter from "./ChallengeFooter";
import styles from "../styles/challenges";

type Props = {
  capitalizeNames: Function,
  speciesCount: number,
  location: string,
  navigation: Function,
  taxa: Array<Object>
}

const ChallengeScreen = ( {
  capitalizeNames, speciesCount, location, navigation, taxa
}: Props ) => (
  <View>
    <ImageBackground
      style={styles.backgroundImage}
      source={require( "../assets/backgrounds/background.png" )}
    >
      <ChallengeHeader
        location={location}
        navigation={navigation}
      />
      <ChallengeGrid
        capitalizeNames={capitalizeNames}
        navigation={navigation}
        taxa={taxa}
      />
      <ChallengeFooter navigation={navigation} speciesCount={speciesCount} />
    </ImageBackground>
  </View>
);

export default ChallengeScreen;