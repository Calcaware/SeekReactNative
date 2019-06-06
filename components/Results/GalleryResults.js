// @flow

import React, { Component } from "react";
import {
  View,
  Platform,
  Alert
} from "react-native";
import inatjs from "inaturalistjs";
import jwt from "react-native-jwt-io";
import ImageResizer from "react-native-image-resizer";
import Realm from "realm";
import moment from "moment";
import { NavigationEvents } from "react-navigation";

import i18n from "../../i18n";
import realmConfig from "../../models";
import ConfirmScreen from "./ConfirmScreen";
import ErrorScreen from "./Error";
import config from "../../config";
import styles from "../../styles/results/confirm";
import {
  addToCollection,
  capitalizeNames,
  flattenUploadParameters
} from "../../utility/helpers";
import { fetchTruncatedUserLocation, createLocationPermissionsAlert } from "../../utility/locationHelpers";
import { checkNumberOfBadgesEarned } from "../../utility/badgeHelpers";
import { checkNumberOfChallengesCompleted } from "../../utility/challengeHelpers";

type Props = {
  navigation: any
}

class Results extends Component<Props> {
  constructor( { navigation }: Props ) {
    super();

    const {
      image,
      time,
      latitude,
      longitude
    } = navigation.state.params;

    this.state = {
      image,
      time,
      latitude,
      longitude,
      userImage: null,
      speciesSeenImage: null,
      observation: null,
      taxaId: null,
      taxaName: null,
      commonAncestor: null,
      seenDate: null,
      error: null,
      scientificName: null,
      imageForUploading: null,
      match: null,
      clicked: false
    };

    this.checkForMatches = this.checkForMatches.bind( this );
  }

  getLocation() {
    const { latitude, longitude } = this.state;

    if ( !latitude || !longitude ) {
      fetchTruncatedUserLocation().then( ( coords ) => {
        const lat = coords.latitude;
        const lng = coords.longitude;

        this.setState( {
          latitude: lat,
          longitude: lng
        } );
      } );
    }
  }

  setMatch( match ) {
    const { clicked } = this.state;
    this.setState( { match }, () => {
      if ( clicked ) {
        this.checkForMatches();
      }
    } );
  }

  setImageForUploading( imageForUploading ) {
    this.setState( { imageForUploading } );
  }

  setImageUri( uri ) {
    this.setState( { userImage: uri }, () => this.getParamsForOnlineVision() );
  }

  setSeenDate( seenDate ) {
    this.setState( { seenDate } );
  }

  setError( error ) {
    this.setState( { error } );
  }

  setOnlineVisionSpeciesResults( species ) {
    const { taxon } = species;
    const photo = taxon.default_photo;

    this.setState( {
      observation: species,
      taxaId: taxon.id,
      taxaName: capitalizeNames( taxon.preferred_common_name || taxon.name ),
      scientificName: taxon.name,
      speciesSeenImage: photo ? photo.medium_url : null
    }, () => this.setMatch( true ) );
  }

  setOnlineVisionAncestorResults( commonAncestor ) {
    const { taxon } = commonAncestor;
    const photo = taxon.default_photo;

    this.setState( {
      commonAncestor: commonAncestor
        ? capitalizeNames( taxon.preferred_common_name || taxon.name )
        : null,
      taxaId: taxon.id,
      speciesSeenImage: photo ? photo.medium_url : null,
      scientificName: taxon.name
    }, () => this.setMatch( false ) );
  }

  getParamsForOnlineVision() {
    const {
      userImage,
      time,
      latitude,
      longitude
    } = this.state;

    const params = flattenUploadParameters( userImage, time, latitude, longitude );
    params.locale = i18n.currentLocale();

    this.fetchScore( params );
  }

  async showMatch() {
    const { seenDate } = this.state;

    if ( !seenDate ) {
      await this.addObservation();
      this.navigateTo( "Match" );
    } else {
      this.navigateTo( "NoMatchScreen" );
    }
  }

  showNoMatch() {
    this.navigateTo( "NoMatchScreen" );
  }

  resizeImage() {
    const { image } = this.state;

    ImageResizer.createResizedImage( image.uri, 299, 299, "JPEG", 80 )
      .then( ( { uri } ) => {
        let userImage;
        if ( Platform.OS === "ios" ) {
          const uriParts = uri.split( "://" );
          userImage = uriParts[uriParts.length - 1];
          this.setImageUri( userImage );
        } else {
          userImage = uri;
          this.setImageUri( userImage );
        }
      } ).catch( () => {
        this.setError( "image" );
      } );
  }

  resizeImageForUploading() {
    const { image } = this.state;

    ImageResizer.createResizedImage( image.uri, 2048, 2048, "JPEG", 80 )
      .then( ( { uri } ) => {
        let userImage;
        if ( Platform.OS === "ios" ) {
          const uriParts = uri.split( "://" );
          userImage = uriParts[uriParts.length - 1];
          this.setImageForUploading( userImage );
        } else {
          userImage = uri;
          this.setImageForUploading( userImage );
        }
      } ).catch( () => {
        this.setError( "image" );
      } );
  }

  createJwtToken() {
    const claims = {
      application: "SeekRN",
      exp: new Date().getTime() / 1000 + 300
    };

    const token = jwt.encode( claims, config.jwtSecret, "HS512" );
    return token;
  }

  fetchScore( params ) {
    const token = this.createJwtToken();

    inatjs.computervision.score_image( params, { api_token: token } )
      .then( ( response ) => {
        const species = response.results[0];
        const commonAncestor = response.common_ancestor;

        // if ( species.combined_score > 85 ) { // changed to 85 for testing
        if ( species.combined_score > 97 ) {
          this.checkDateSpeciesSeen( species.taxon.id );
          this.setOnlineVisionSpeciesResults( species );
        } else if ( commonAncestor ) {
          this.setOnlineVisionAncestorResults( commonAncestor );
        } else {
          this.setMatch( false );
        }
      } ).catch( () => {
        this.setError( "onlineVision" );
      } );
  }

  addObservation() {
    const {
      latitude,
      longitude,
      observation,
      image,
      time
    } = this.state;

    if ( latitude && longitude ) {
      addToCollection( observation, latitude, longitude, image, time );
    } else {
      createLocationPermissionsAlert();
    }
  }

  checkDateSpeciesSeen( taxaId ) {
    Realm.open( realmConfig )
      .then( ( realm ) => {
        const seenTaxaIds = realm.objects( "TaxonRealm" ).map( t => t.id );
        if ( seenTaxaIds.includes( taxaId ) ) {
          const seenTaxa = realm.objects( "ObservationRealm" ).filtered( `taxon.id == ${taxaId}` );
          const seenDate = moment( seenTaxa[0].date ).format( "ll" );
          this.setSeenDate( seenDate );
        } else {
          this.setSeenDate( null );
        }
      } ).catch( () => {
        this.setSeenDate( null );
      } );
  }

  checkForMatches() {
    const { match } = this.state;

    this.setState( { clicked: true } );

    if ( match === true ) {
      this.showMatch();
    } else if ( match === false ) {
      this.showNoMatch();
    }
  }

  navigateTo( route ) {
    const { navigation } = this.props;
    const {
      userImage,
      taxaName,
      taxaId,
      speciesSeenImage,
      commonAncestor,
      seenDate,
      imageForUploading,
      scientificName,
      latitude,
      longitude,
      time,
      postingSuccess
    } = this.state;

    navigation.navigate( route, {
      userImage,
      image: imageForUploading,
      taxaName,
      taxaId,
      speciesSeenImage,
      seenDate,
      scientificName,
      latitude,
      longitude,
      time,
      commonAncestor,
      postingSuccess
    } );
  }

  render() {
    const {
      imageForUploading,
      error,
      match,
      clicked
    } = this.state;
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        <NavigationEvents
          onWillFocus={() => {
            this.getLocation();
            this.resizeImage();
            this.resizeImageForUploading();
            checkNumberOfBadgesEarned();
            checkNumberOfChallengesCompleted();
          }}
        />
        {error
          ? <ErrorScreen error={error} navigation={navigation} />
          : (
            <ConfirmScreen
              image={imageForUploading}
              checkForMatches={this.checkForMatches}
              match={match}
              navigation={navigation}
              clicked={clicked}
            />
          )}
      </View>
    );
  }
}

export default Results;
