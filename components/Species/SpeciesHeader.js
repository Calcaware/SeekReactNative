// @flow

import React, { useCallback } from "react";
import { Text, BackHandler } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import type { Node } from "react";

import i18n from "../../i18n";
import iconicTaxaNames from "../../utility/dictionaries/iconicTaxonDict";
import SpeciesPhotos from "./SpeciesPhotos";
import { viewStyles, textStyles } from "../../styles/species/species";
import { getRoute } from "../../utility/helpers";
import CustomBackArrow from "../UIComponents/Buttons/CustomBackArrow";
import { resetRouter } from "../../utility/navigationHelpers";
import SpeciesName from "./SpeciesName";

type Props = {
  photos: Array<Object>,
  taxon: Object,
  id: number,
  selectedText: boolean,
  highlightSelectedText: ( ) => void
}

const SpeciesHeader = ( { photos, taxon, id, selectedText, highlightSelectedText }: Props ): Node => {
  const navigation = useNavigation( );

  const { iconicTaxonId } = taxon;

  const backAction = useCallback( async ( ) => {
    const routeName = await getRoute( );
    // odd behavior at the moment -> if a user clicks through 4 species screens
    // and the last one was Great Egret, they will reload the Great Egret Species Details 4x before getting back
    // to the previous screen
    if ( routeName ) {
      // ChallengeDetails, Observations, Home, or Match
      navigation.goBack( );
    } else {
      resetRouter( navigation );
    }
  }, [navigation] );

  useFocusEffect(
    useCallback( ( ) => {
      const onBackPress = ( ) => {
        backAction( );
        return true; // following custom Android back behavior template in React Navigation
      };

      BackHandler.addEventListener( "hardwareBackPress", onBackPress );

      return ( ) => BackHandler.removeEventListener( "hardwareBackPress", onBackPress );
    }, [backAction] )
  );

  return (
    <>
      <CustomBackArrow handlePress={backAction} style={viewStyles.backButton} />
      <SpeciesPhotos photos={photos} id={id} />
      {iconicTaxonId && (
        <Text style={textStyles.iconicTaxaText}>
          {i18n.t( iconicTaxaNames[iconicTaxonId] ).toLocaleUpperCase()}
        </Text>
      )}
      <SpeciesName
        id={id}
        taxon={taxon}
        selectedText={selectedText}
        highlightSelectedText={highlightSelectedText}
      />
    </>
  );
};

export default SpeciesHeader;
