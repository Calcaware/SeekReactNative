// @flow

import React, { Component } from "react";
import { Platform } from "react-native";
import inatjs from "inaturalistjs";
import { NavigationEvents } from "@react-navigation/compat";

import ConfirmScreen from "./ConfirmScreen";
import ErrorScreen from "./Error";
import {
  capitalizeNames,
  flattenUploadParameters,
  getTaxonCommonName,
  createJwtToken
} from "../../utility/helpers";
import { addToCollection } from "../../utility/observationHelpers";
import { fetchTruncatedUserLocation } from "../../utility/locationHelpers";
import { checkLocationPermissions } from "../../utility/androidHelpers.android";
import createUserAgent from "../../utility/userAgent";
import { fetchSpeciesSeenDate, serverBackOnlineTime } from "../../utility/dateHelpers";

type Props = {
  +route: any,
  +navigation: any
}

type State = {
  image: Object,
  taxon: Object,
  observation: ?Object,
  seenDate: ?string,
  error: ?string,
  match: ?boolean,
  clicked: boolean,
  numberOfHours: ?string,
  errorCode: ?number
};

class OnlineServerResults extends Component<Props, State> {
  constructor( { route }: Props ) {
    super();

    const { image } = route.params;

    this.state = {
      taxon: {},
      image,
      observation: null,
      seenDate: null,
      error: null,
      match: null,
      clicked: false,
      numberOfHours: null,
      errorCode: null
    };

    ( this:any ).checkForMatches = this.checkForMatches.bind( this );
  }

  getUserLocation() {
    const { image } = this.state;
    fetchTruncatedUserLocation().then( ( coords ) => {
      if ( coords ) {
        const { latitude, longitude } = coords;

        image.latitude = latitude;
        image.longitude = longitude;

        this.setState( { image } );
      }
    } ).catch( ( errorCode ) => {
      this.setLocationErrorCode( errorCode );
    } );
  }

  setMatch( match: boolean ) {
    const { clicked } = this.state;
    this.setState( { match }, () => {
      if ( clicked ) {
        this.checkForMatches();
      }
    } );
  }

  setSeenDate( seenDate: ?string ) {
    this.setState( { seenDate } );
  }

  setNumberOfHours( numberOfHours: string ) {
    this.setState( { numberOfHours } );
  }

  setError( error: string ) {
    this.setState( { error } );
  }

  setLocationErrorCode( errorCode: number ) {
    this.setState( { errorCode } );
  }

  setTaxon( taxon: Object, match: boolean ) {
    this.setState( { taxon }, () => this.setMatch( match ) );
  }

  setOnlineVisionSpeciesResults( species: Object ) {
    const { taxon } = species;
    const photo = taxon.default_photo;

    this.setState( { observation: species } );

    getTaxonCommonName( taxon.id ).then( ( commonName ) => {
      const newTaxon = {
        taxaId: taxon.id,
        taxaName: capitalizeNames( commonName || taxon.name ),
        scientificName: taxon.name,
        speciesSeenImage: photo ? photo.medium_url : null
      };

      this.setTaxon( newTaxon, true );
    } );
  }

  setOnlineVisionAncestorResults( commonAncestor: Object ) {
    const { taxon } = commonAncestor;
    const photo = taxon.default_photo;

    getTaxonCommonName( taxon.id ).then( ( commonName ) => {
      const newTaxon = {
        commonAncestor: commonAncestor
          ? capitalizeNames( commonName || taxon.name )
          : null,
        taxaId: taxon.id,
        speciesSeenImage: photo ? photo.medium_url : null,
        scientificName: taxon.name,
        rank: taxon.rank_level
      };

      this.setTaxon( newTaxon, false );
    } );
  }

  async getParamsForOnlineVision() {
    const { image } = this.state;

    const params = await flattenUploadParameters( image );
    this.fetchScore( params );
  }

  async showMatch() {
    const { seenDate } = this.state;

    if ( !seenDate ) {
      await this.addObservation();
      this.navigateToMatch();
    } else {
      this.navigateToMatch();
    }
  }

  showNoMatch() {
    this.navigateToMatch();
  }

  fetchScore( params: Object ) {
    const token = createJwtToken();

    const options = { api_token: token, user_agent: createUserAgent() };

    inatjs.computervision.score_image( params, options )
      .then( ( response ) => {
        const species = response.results[0];
        const commonAncestor = response.common_ancestor;

        if ( species.combined_score > 85 && species.taxon.rank === "species" ) {
          this.checkSpeciesSeen( species.taxon.id );
          this.setOnlineVisionSpeciesResults( species );
        } else if ( commonAncestor ) {
          this.setOnlineVisionAncestorResults( commonAncestor );
        } else {
          this.setMatch( false );
        }
      } ).catch( ( { response } ) => {
        if ( response.status && response.status === 503 ) {
          const gmtTime = response.headers.map["retry-after"];
          console.log( gmtTime, "gmt time" );
          const hours = serverBackOnlineTime( gmtTime );

          if ( hours ) {
            this.setNumberOfHours( hours );
          }
          this.setError( "downtime" );
        } else {
          this.setError( "onlineVision" );
        }
      } );
  }

  addObservation() {
    const { image, observation } = this.state;

    addToCollection( observation, image );
  }

  checkSpeciesSeen( taxaId: number ) {
    fetchSpeciesSeenDate( taxaId ).then( ( date ) => {
      this.setSeenDate( date );
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

  requestAndroidPermissions() {
    // this should only apply to iOS photos with no metadata
    // once metadata is fixed, should be able to remove this check for user location
    const { image } = this.state;

    if ( !image.latitude || !image.longitude ) {
      // check to see if there are already photo coordinates
      if ( Platform.OS === "android" ) {
        checkLocationPermissions().then( ( granted ) => {
          if ( granted ) {
            this.getUserLocation();
            this.getParamsForOnlineVision();
          }
        } );
      } else {
        this.getUserLocation();
        this.getParamsForOnlineVision();
      }
    } else {
      this.getParamsForOnlineVision();
    }
  }

  navigateToMatch() {
    const { navigation } = this.props;
    const {
      image,
      taxon,
      seenDate,
      errorCode
    } = this.state;

    navigation.push( "Match", {
      image,
      taxon,
      seenDate,
      errorCode
    } );
  }

  render() {
    const {
      image,
      error,
      clicked,
      numberOfHours
    } = this.state;

    return (
      <>
        <NavigationEvents
          onWillFocus={() => this.requestAndroidPermissions()}
        />
        {error
          ? (
            <ErrorScreen
              error={error}
              number={numberOfHours}
            />
          ) : (
            <ConfirmScreen
              updateClicked={this.checkForMatches}
              clicked={clicked}
              image={image.uri}
            />
          )}
      </>
    );
  }
}

export default OnlineServerResults;
