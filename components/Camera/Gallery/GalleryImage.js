// @flow

import React, { useCallback } from "react";
import { Platform, Image, TouchableOpacity } from "react-native";
import { getPredictionsForImage } from "react-native-inat-camera";
import { useNavigation } from "@react-navigation/native";

import { checkForPhotoMetaData } from "../../../utility/photoHelpers";
import styles from "../../../styles/camera/gallery";
import { dirTaxonomy, dirModel } from "../../../utility/dirStorage";
import { fetchOfflineResults } from "../../../utility/resultsHelpers";

type Props = {
  item: Object,
  setLoading: ( ) => void
}

const GalleryImage = ( { item, setLoading }: Props ) => {
  const navigation = useNavigation();

  const navigateToResults = useCallback( ( uri, time, location, predictions ) => {
    const { navigate } = navigation;

    let latitude = null;
    let longitude = null;

    if ( checkForPhotoMetaData( location ) ) {
      latitude = location.latitude;
      longitude = location.longitude;
    }

    const image = {
      time,
      uri,
      latitude,
      longitude,
      predictions: []
    };

    if ( predictions && predictions.length > 0 ) {
      // $FlowFixMe
      image.predictions = predictions;

      fetchOfflineResults( image, navigation );
    } else {
      navigate( "OnlineServerResults", { image } );
    }
  }, [navigation] );

  const getPredictions = useCallback( ( uri, timestamp, location ) => {
    const path = uri.split( "file://" );
    const reactUri = path[1];

    getPredictionsForImage( {
      uri: reactUri,
      modelFilename: dirModel,
      taxonomyFilename: dirTaxonomy
    } ).then( ( { predictions } ) => {
      navigateToResults( uri, timestamp, location, predictions );
    } ).catch( ( err ) => {
      console.log( "Error", err );
    } );
  }, [navigateToResults] );

  const selectImage = useCallback( () => {
    setLoading( );
    const { timestamp, location, image } = item.node;

    if ( Platform.OS === "android" ) {
      getPredictions( image.uri, timestamp, location );
    } else {
      navigateToResults( image.uri, timestamp, location );
    }
  }, [getPredictions, navigateToResults, item, setLoading] );

  const imageSource = { uri: item.node.image.uri };

  return (
    <TouchableOpacity
      accessibilityLabel={item.node.image.filename}
      accessible
      onPress={selectImage}
      style={styles.button}
    >
      <Image
        source={imageSource}
        style={styles.image}
      />
    </TouchableOpacity>
  );
};

export default GalleryImage;
