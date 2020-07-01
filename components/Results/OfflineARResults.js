// @flow

import React, { useState, useEffect, useCallback } from "react";
import { Platform } from "react-native";
import inatjs from "inaturalistjs";
import { useNavigation, useRoute } from "@react-navigation/native";

import { getTaxonCommonName, checkForIconicTaxonId } from "../../utility/helpers";
import { addToCollection } from "../../utility/observationHelpers";
import FullPhotoLoading from "./FullPhotoLoading";
import { fetchTruncatedUserLocation } from "../../utility/locationHelpers";
import createUserAgent from "../../utility/userAgent";
import { fetchSpeciesSeenDate } from "../../utility/dateHelpers";
import { useLocationPermission } from "../../utility/customHooks";

const threshold = 0.7;

const OfflineARResults = () => {
  const granted = useLocationPermission();
  const navigation = useNavigation();
  const { params } = useRoute();

  const [taxon, setTaxon] = useState( {} );
  const [image, setImage] = useState( params.image );
  const [observation, setObservation] = useState( null );
  const [seenDate, setSeenDate] = useState( null );
  const [match, setMatch] = useState( null );
  const [errorCode, setErrorCode] = useState( null );

  const setSpeciesInfo = ( species, taxa ) => {
    console.log( species, taxa, "setting species info" );
    const taxaId = Number( species.taxon_id );
    const iconicTaxonId = checkForIconicTaxonId( species.ancestor_ids );

    getTaxonCommonName( species.taxon_id ).then( ( commonName ) => {
      setObservation( {
        taxon: {
          default_photo: taxa && taxa.default_photo ? taxa.default_photo : null,
          id: taxaId,
          name: species.name,
          preferred_common_name: commonName,
          iconic_taxon_id: iconicTaxonId,
          ancestor_ids: species.ancestor_ids
        }
      } );

      const newTaxon = {
        taxaId,
        taxaName: commonName || species.name,
        scientificName: species.name,
        speciesSeenImage:
          taxa && taxa.taxon_photos[0]
            ? taxa.taxon_photos[0].photo.medium_url
            : null
      };

      setTaxon( newTaxon );
      setMatch( true );
    } );
  };

  const fetchSpeciesInfo = useCallback( ( species ) => {
    const options = { user_agent: createUserAgent() };

    inatjs.taxa.fetch( species.taxon_id, options ).then( ( response ) => {
      const taxa = response.results[0];
      setSpeciesInfo( species, taxa );
    } ).catch( () => {
      setSpeciesInfo( species, null );
    } );
  }, [] );

  const setAncestor = ( ancestor, speciesSeenImage ) => {
    console.log( ancestor, speciesSeenImage, "setting ancestor" );
    getTaxonCommonName( ancestor.taxon_id ).then( ( commonName ) => {
      const newTaxon = {
        commonAncestor: commonName || ancestor.name,
        taxaId: ancestor.taxon_id,
        speciesSeenImage,
        scientificName: ancestor.name,
        rank: ancestor.rank
      };

      setTaxon( newTaxon );
      setMatch( false );
    } );
  };

  const fetchAncestorInfo = useCallback( ( ancestor ) => {
    const options = { user_agent: createUserAgent() };

    inatjs.taxa.fetch( ancestor.taxon_id, options ).then( ( response ) => {
      const taxa = response.results[0];
      const speciesSeenImage = taxa.taxon_photos[0] ? taxa.taxon_photos[0].photo.medium_url : null;
      setAncestor( ancestor, speciesSeenImage );
    } ).catch( () => {
      // make sure speciesSeenImage is not undefined when no internet
      setAncestor( ancestor, null );
    } );
  }, [] );

  const checkForAncestor = useCallback( () => {
    const reversePredictions = image.predictions.reverse();
    const ancestor = reversePredictions.find( leaf => leaf.score > threshold );

    if ( ancestor && ancestor.rank !== 100 ) {
      fetchAncestorInfo( ancestor );
    } else {
      setMatch( false );
    }
  }, [fetchAncestorInfo, image.predictions] );

  const checkSpeciesSeen = ( taxaId ) => {
    fetchSpeciesSeenDate( taxaId ).then( ( date ) => {
      setSeenDate( date );
    } );
  };

  const setAncestorIdsiOS = useCallback( () => {
    // adding ancestor ids to take iOS camera experience offline
    const ancestorIds = image.predictions.map( ( p ) => Number( p.taxon_id ) );
    return ancestorIds.sort();
  }, [image.predictions] );

  const setVisionResults = useCallback( () => {
    const species = image.predictions.find( leaf => (
      leaf.rank === 10 && leaf.score > threshold
    ) );

    if ( species ) {
      if ( Platform.OS === "ios" ) {
        species.ancestor_ids = setAncestorIdsiOS();
      }
      checkSpeciesSeen( Number( species.taxon_id ) );
      fetchSpeciesInfo( species );
    } else {
      checkForAncestor();
    }
  }, [checkForAncestor, fetchSpeciesInfo, image.predictions, setAncestorIdsiOS] );

  const getUserLocation = useCallback( () => {
    fetchTruncatedUserLocation().then( ( coords ) => {
      if ( coords ) {
        const { latitude, longitude } = coords;

        image.latitude = latitude;
        image.longitude = longitude;

        setImage( image );
        setVisionResults();
      } else {
        setVisionResults();
      }
    } ).catch( ( code ) => {
      setErrorCode( code );
      setVisionResults();
    } );
  }, [image, setVisionResults] );

  const requestAndroidPermissions = useCallback( () => {
    if ( !image.latitude ) {
      // Android photo gallery images should already have lat/lng
      if ( Platform.OS === "android" && !granted ) {
        setErrorCode( 1 );
        setVisionResults();
      } else {
        getUserLocation();
      }
    } else {
      setVisionResults();
    }
  }, [image.latitude, granted, getUserLocation, setVisionResults] );

  const addObservation = useCallback( async () => {
    await addToCollection( observation, image );
  }, [observation, image] );

  const navToResults = useCallback( () => {
    navigation.push( "Drawer", {
      screen: "Main",
      params: {
        screen: "Match",
        params: {
          taxon,
          image,
          seenDate,
          errorCode
        }
      }
    } );
  }, [taxon, image, seenDate, errorCode, navigation] );

  const showMatch = useCallback( async () => {
    console.log( "showing match" );
    if ( !seenDate && match ) {
      await addObservation();
      navToResults();
    } else {
      navToResults();
    }
  }, [navToResults, seenDate, match, addObservation] );

  useEffect( () => {
    if ( match !== null ) {
      showMatch();
    }
  }, [match, showMatch] );

  useEffect( () => {
    navigation.addListener( "focus", () => {
      requestAndroidPermissions();
    } );
  }, [navigation, requestAndroidPermissions] );

  return <FullPhotoLoading uri={params.image.uri} />;
};

export default OfflineARResults;
