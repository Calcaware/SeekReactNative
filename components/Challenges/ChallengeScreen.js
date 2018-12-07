// @flow

import React from "react";

import { ImageBackground, View } from "react-native";

import Banner from "../Banner";
import ChallengeGrid from "./ChallengeGrid";
import ChallengeHeader from "./ChallengeHeader";
import ChallengeFooter from "./ChallengeFooter";
import LoadingWheel from "../LoadingWheel";
import ErrorScreen from "../ErrorScreen";
import styles from "../../styles/challenges";

type Props = {
  badgeCount: number,
  taxaName: string,
  speciesCount: number,
  latitude: number,
  loading: boolean,
  longitude: number,
  location: string,
  navigation: Function,
  taxa: Array<Object>,
  taxaType: string,
  setTaxonId: Function,
  updateLocation: Function,
  reverseGeocodeLocation: Function,
  error: string
}

const ChallengeScreen = ( {
  badgeCount,
  taxaName,
  speciesCount,
  latitude,
  loading,
  longitude,
  location,
  navigation,
  setTaxonId,
  taxa,
  taxaType,
  updateLocation,
  error
}: Props ) => {
  let challenges;

  if ( error ) {
    challenges = <ErrorScreen error={error} />;
  } else if ( loading ) {
    challenges = <LoadingWheel />;
  } else if ( taxa.length === 0 ) {
    challenges = <ErrorScreen error={`We couldn't find any ${taxaType} in this location. Please try again.`} />;
  } else {
    challenges = (
      <ChallengeGrid
        navigation={navigation}
        taxa={taxa}
        latitude={latitude}
        longitude={longitude}
        location={location}
      />
    );
  }

  return (
    <ImageBackground
      style={styles.backgroundImage}
      source={require( "../../assets/backgrounds/background.png" )}
    >
      { taxaName ? (
        <Banner bannerText={`${taxaName} collected`} main />
      ) : null }
      <View style={styles.container}>
        <ChallengeHeader
          latitude={latitude}
          longitude={longitude}
          location={location}
          loading={loading}
          navigation={navigation}
          updateLocation={updateLocation}
          setTaxonId={setTaxonId}
          taxaType={taxaType}
          taxaName={taxaName}
        />
        {challenges}
        <ChallengeFooter
          latitude={latitude}
          longitude={longitude}
          navigation={navigation}
          badgeCount={badgeCount}
          speciesCount={speciesCount}
        />
      </View>
    </ImageBackground>
  );
};

export default ChallengeScreen;
