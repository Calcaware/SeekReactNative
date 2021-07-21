// @flow

import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import type { Node } from "react";

import i18n from "../../i18n";
import styles from "../../styles/match/speciesNearby";
import SpeciesNearbyList from "../UIComponents/SpeciesNearby/SpeciesNearbyList";
import LoadingWheel from "../UIComponents/LoadingWheel";
import { colors } from "../../styles/global";
import TapToLoad from "../UIComponents/SpeciesNearby/TapToLoad";
import { fetchSpeciesNearby } from "../../utility/apiCalls";

type Props = {
  +ancestorId:number,
  +image: Object
}

const SpeciesNearby = ( { ancestorId, image }: Props ): Node => {
  const [taxa, setTaxa] = useState( [] );
  const [loading, setLoading] = useState( false );
  const [loaded, setLoaded] = useState( false );

  useEffect( ( ) => {
    const params = {
      lat: image.latitude,
      lng: image.longitude,
      taxon_id: ancestorId
    };

    const fetchTaxa = async ( ) => {
      const results = await fetchSpeciesNearby( params );
      setTaxa( results );
      setLoaded( true );
    };

    if ( loading ) {
      fetchTaxa( );
    }
  }, [loading, image, ancestorId] );

  const startLoading = ( ) => setLoading( true );

  const renderSpecies = ( ) => {
    if ( loaded ) {
      return (
        <View style={[styles.speciesNearbyContainer, styles.center, styles.largerHeight]}>
          <SpeciesNearbyList taxa={taxa} />
        </View>
      );
    } else if ( loading ) {
      return (
        <View style={[styles.speciesNearbyContainer, styles.center, styles.largerHeight]}>
          <LoadingWheel color={colors.black} />
        </View>
      );
    }
    return <TapToLoad handlePress={startLoading} />;
  };

  return (
    <>
      <Text style={styles.headerText}>
        {i18n.t( "results.nearby" ).toLocaleUpperCase( )}
      </Text>
      {renderSpecies( )}
    </>
  );
};

export default SpeciesNearby;
