// @flow
import AsyncStorage from "@react-native-async-storage/async-storage";
import inatjs from "inaturalistjs";
// import { Alert } from "react-native";

import { fetchJSONWebToken } from "./uploadHelpers";
import createUserAgent from "./userAgent";

const checkIsEmailValid = ( email: string ): boolean => {
  if ( email && email.length > 5 ) {
    if ( email.includes( "@" ) && email.includes( "." ) ) {
      return true;
    }
  }
  return false;
};

const checkIsUsernameValid = ( username: string ): boolean => {
  if ( username && ( username.length >= 3 && username.length <= 40 ) ) {
    if ( typeof ( username.charAt( 0 ) ) !== "number" ) {
      return true;
    }
  }
  return false;
};

const saveAccessToken = ( token: string ): any => AsyncStorage.setItem( "access_token", token );

const fetchAccessToken = async (): Promise<string> => {
  try {
    const token = await AsyncStorage.getItem( "access_token" );
    return token;
  } catch ( error ) {
    return "";
  }
};

const removeAccessToken = async (): Promise<any> => {
  try {
    const token = await AsyncStorage.removeItem( "access_token" );
    return token;
  } catch ( error ) {
    return false;
  }
};

const savePostingSuccess = ( success: boolean ) => {
  AsyncStorage.setItem( "posting_success", success.toString() );
};

const fetchPostingSuccess = async (): Promise<any> => {
  try {
    const success = await AsyncStorage.getItem( "posting_success" );
    return success;
  } catch ( error ) {
    return false;
  }
};

const formatError = ( error: string ): string => {
  let newError;

  if ( error.includes( "\n" ) ) {
    newError = error.replace( /\n/g, " " );
  }
  return newError || error;
};

// const showPromptToSwitchPhotoLicense = ( ) => {
  // call users.update
  // params = { id, user[make_photo_licenses_same] === true }
  // Alert.alert(
    // title,
    // message,
    // [
    //   {
    //     text: "Cancel",
    //     onPress: () => console.log("Cancel Pressed"),
    //     style: "cancel"
    //   },
    //   { text: "Update license", onPress: () => updateLicense( ) }
    // ],
    // { cancelable: false }
//   );
// };

// const fetchUserId = async ( login: string ) => {
//   try {
//     const apiToken = await fetchJSONWebToken( login );
//     console.log( apiToken, "token " );
//     const options = { api_token: apiToken };
//     const { results } = await inatjs.users.me( options );
//     if ( results.preferred_observation_license === null ) {
//       showPromptToSwitchPhotoLicense( );
//     }
//     console.log( results, "fetch user id" );
//   } catch ( e ) {
//     console.log( e.message, "error fetching user id" );
//   }
// };

const fetchUserProfile = async ( login: string ): Promise<Object> => {
  try {
    const apiToken = await fetchJSONWebToken( login );
    const options = { api_token: apiToken, user_agent: createUserAgent( ) };
    const { results } = await inatjs.users.me( options );
    return results[0];
  } catch ( e ) {
    return null;
  }
};

export {
  saveAccessToken,
  fetchAccessToken,
  removeAccessToken,
  checkIsEmailValid,
  checkIsUsernameValid,
  savePostingSuccess,
  fetchPostingSuccess,
  formatError,
  fetchUserProfile
  // fetchUserId
};
