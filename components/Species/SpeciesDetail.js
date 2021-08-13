// @flow

import React, {
  useReducer,
  useEffect,
  useRef,
  useCallback,
  useContext
} from "react";
import { ScrollView, Platform, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { Node } from "react";

import { viewStyles } from "../../styles/species/species";
import { checkForInternet } from "../../utility/helpers";
import OnlineSpeciesContainer from "./OnlineSpeciesContainer";
import SpeciesHeader from "./SpeciesHeader";
import OfflineSpeciesContainer from "./OfflineSpeciesContainer";
import SpeciesPhotosLandscape from "./SpeciesPhotosLandscape";
import GreenHeader from "../UIComponents/GreenHeader";
import SpeciesName from "./SpeciesName";
import IconicTaxaName from "./IconicTaxaName";
import { useCommonName, useInternetStatus } from "../../utility/customHooks";
import { AppOrientationContext, SpeciesDetailContext } from "../UserContext";
import { useSpeciesSeen, useTaxonDetails } from "./hooks/speciesDetailHooks";

const SpeciesDetail = ( ): Node => {
  const internet = useInternetStatus( );
  const { id } = useContext( SpeciesDetailContext );
  const { isLandscape } = useContext( AppOrientationContext );
  const scrollView = useRef( null );
  const navigation = useNavigation( );
  const { params } = useRoute( );
  // const seenTaxa = useSpeciesSeen( id );
  const commonName = useCommonName( id );
  const taxonDetails = useTaxonDetails( id );

  const photos = taxonDetails && taxonDetails.photos;
  const taxon = taxonDetails && taxonDetails.taxon;
  const details = taxonDetails && taxonDetails.details;

  // eslint-disable-next-line no-shadow
  const [state, dispatch] = useReducer( ( state, action ) => {
    switch ( action.type ) {
      case "ERROR":
        return { ...state, error: "internet" };
      case "NO_ERROR":
        return { ...state, error: null };
      case "CLEAR_SELECTION":
        return {
          ...state,
          selectedText: false
        };
      case "HIGHLIGHT_SELECTION":
        return {
          ...state,
          selectedText: true
        };
      default:
        throw new Error( );
    }
  }, {
    error: internet === false ? "internet" : null,
    selectedText: false
  } );

  const {
    error,
    selectedText
  } = state;

  const clearSelectedText = ( ) => dispatch( { type:"CLEAR_SELECTION" } );
  const highlightSelectedText = useCallback( ( ) => dispatch( { type: "HIGHLIGHT_SELECTION" } ), [] );

  const checkInternetConnection = useCallback( ( ) => {
    checkForInternet( ).then( ( network ) => {
      if ( network === "none" || network === "unknown" ) {
        dispatch( { type: "ERROR" } );
      } else {
        dispatch( { type: "NO_ERROR" } );
      }
    } );
  }, [] );

  const resetScreen = useCallback( ( ) => {
    const scrollToTop = ( ) => {
      if ( scrollView.current ) {
        scrollView.current.scrollTo( {
          x: 0, y: 0, animated: Platform.OS === "android"
        } );
      }
    };

    if ( Platform.OS === "android" ) {
      setTimeout( ( ) => scrollToTop( ), 1 );
      // hacky but this fixes scroll not getting to top of screen
    } else {
      scrollToTop( );
    }
  }, [] );

  useEffect( ( ) => {
    // would be nice to stop refetch when a user goes to range map and back
    // and also wikipedia and back or iNat obs and back
    navigation.addListener( "focus", ( ) => {
      resetScreen( );
    } );
  }, [navigation, resetScreen] );

  if ( !id || isLandscape === null ) {
    return null;
  }

  const predictions = params ? params.image : null;

  const renderOnlineOrOfflineContent = ( ) => {
    if ( error ) {
      return (
        <OfflineSpeciesContainer
          checkForInternet={checkInternetConnection}
          details={details}
          id={id}
          predictions={predictions}
        />
      );
    }
    if ( taxon && Object.keys( taxon ).length > 0 && !error ) {
      return (
        <OnlineSpeciesContainer
          details={details}
          scientificName={taxon.scientificName}
          id={id}
          predictions={predictions}
        />
      );
    }
    return null;
  };

  const renderPortraitMode = ( ) => (
    <ScrollView
      ref={scrollView}
      contentContainerStyle={viewStyles.background}
      onScrollBeginDrag={clearSelectedText}
    >
      {taxon && (
        <SpeciesHeader
          id={id}
          taxon={taxon}
          photos={photos}
          selectedText={selectedText}
          highlightSelectedText={highlightSelectedText}
        />
      )}
      {renderOnlineOrOfflineContent( )}
    </ScrollView>
  );

  const renderLandscapeMode = ( ) => (
    <>
      <GreenHeader plainText={commonName || taxon.scientificName} />
      <View style={viewStyles.twoColumnContainer}>
        <SpeciesPhotosLandscape photos={photos} id={id} />
        <ScrollView
          ref={scrollView}
          contentContainerStyle={viewStyles.landscapeBackground}
          onScrollBeginDrag={clearSelectedText}
          bounces={false}
        >
          {taxon.scientificName && (
            <>
              <IconicTaxaName iconicTaxonId={taxon.iconicTaxonId} />
              <SpeciesName
                id={id}
                taxon={taxon}
                selectedText={selectedText}
                highlightSelectedText={highlightSelectedText}
              />
            </>
          )}
          {renderOnlineOrOfflineContent( )}
        </ScrollView>
      </View>
    </>
  );

  return (
    <SafeAreaView style={viewStyles.greenBanner} edges={["top"]}>
      {isLandscape ? renderLandscapeMode( ) : renderPortraitMode( )}
    </SafeAreaView>
  );
};

export default SpeciesDetail;
