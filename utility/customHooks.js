import { useState, useEffect, useCallback } from "react";
import { Platform } from "react-native";
import RNFS from "react-native-fs";

import i18n from "../i18n";
import { fetchLocationName, fetchTruncatedUserLocation } from "./locationHelpers";
import { dirPictures } from "./dirStorage";
import { writeToDebugLog } from "./photoHelpers";
import { checkLocationPermissions } from "./androidHelpers.android";

const useScrollToTop = ( scrollView, navigation ) => {
  const scrollToTop = () => {
    if ( scrollView && scrollView.current !== null ) {
      scrollView.current.scrollTo( {
        x: 0, y: 0, animated: Platform.OS === "android"
      } );
    }
  };

  useEffect( () => {
    navigation.addListener( "focus", () => {
      scrollToTop();
    } );
  } );
};

const useLocationName = ( latitude, longitude ) => {
  const [location, setLocation] = useState( null );

  useEffect( () => {
    let isCurrent = true;

    // reverseGeocodeLocation
    fetchLocationName( latitude, longitude ).then( ( locationName ) => {
      if ( isCurrent ) {
        if ( locationName === null ) {
          setLocation( i18n.t( "location_picker.undefined" ) ); // for oceans
        } else {
          setLocation( locationName );
        }
      }
    } ).catch( () => {
      if ( isCurrent ) {
        setLocation( null );
      }
    } );

    return () => {
      isCurrent = false;
    };
  }, [latitude, longitude] );

  return location;
};

const useUserPhoto = ( item ) => {
  const [photo, setPhoto] = useState( null );

  const checkForSeekV2Photos = useCallback( () => {
    const { taxon } = item;
    const { defaultPhoto } = taxon;
    if ( !defaultPhoto ) {
      return;
    }

    const { backupUri, mediumUrl } = defaultPhoto;
    if ( backupUri ) {
      if ( Platform.OS === "ios" ) {
        const uri = backupUri.split( "Pictures/" );
        const backupFilepath = `${dirPictures}/${uri[1]}`;
        setPhoto( { uri: backupFilepath } );
      } else {
        writeToDebugLog( backupUri );
        RNFS.readFile( backupUri, { encoding: "base64" } ).then( ( encodedData ) => {
          setPhoto( { uri: `data:image/jpeg;base64,${encodedData}` } );
        } ).catch( ( e ) => console.log( e ) );
      }
    } else if ( mediumUrl ) {
      setPhoto( { uri: mediumUrl } );
    }
  }, [item] );

  const checkV1 = useCallback( async ( dir ) => {
    // attempt to limit the number of orphaned tasks
    // by checking whether /large directory exists instead of err on Seek v1
    try {
      const status = await RNFS.exists( dir );
      if ( status ) {
        RNFS.readFile( dir, { encoding: "base64" } ).then( ( encodedData ) => {
          setPhoto( { uri: `data:image/jpeg;base64,${encodedData}` } );
        } ).catch( () => checkForSeekV2Photos() );
      } else {
        checkForSeekV2Photos();
      }
      return status;
    } catch ( err ) {
      return err;
    }
  }, [checkForSeekV2Photos] );

  useEffect( () => {
    const seekv1Photos = `${RNFS.DocumentDirectoryPath}/large`;

    if ( item !== null ) {
      if ( Platform.OS === "ios" ) {
        checkV1( `${seekv1Photos}/${item.uuidString}` );
      } else {
        checkForSeekV2Photos();
      }
    } else {
      setPhoto( null );
    }
  }, [checkForSeekV2Photos, checkV1, item] );

  return photo;
};

const useLocationPermission = () => {
  const [granted, setGranted] = useState( true );

  const fetchPermissionStatus = async () => {
    try {
      const status = await checkLocationPermissions();
      setGranted( status );
    } catch ( e ) {
      setGranted( false );
    }
  };

  if ( Platform.OS === "android" ) {
    fetchPermissionStatus();
  }
  return granted;
};

// const useUserCoords = () => {
//   const [coords, setCoords] = useState( null );

//   const fetchCoords = async () => {
//     try {
//       const userCoords = await fetchTruncatedUserLocation();
//       setCoords( userCoords );
//     } catch ( e ) {
//       setCoords( {} );
//     }
//   };

//   fetchCoords();

//   return coords;
// };

export {
  useScrollToTop,
  useLocationName,
  useUserPhoto,
  useLocationPermission
  // useUserCoords
};
