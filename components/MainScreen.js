// @flow

import React, { Component } from "react";
import inatjs from "inaturalistjs";

import {
  View,
  StatusBar
} from "react-native";

import ChallengeScreen from "./Challenges/ChallengeScreen";
import ErrorScreen from "./ErrorScreen";
import LoadingScreen from "./LoadingScreen";
import styles from "../styles/challenges";

type Props = {
  navigation: any
}

type State = {
  taxa: Array<Object>,
  loading: boolean,
  latitude: ?number,
  longitude: ?number,
  location: string,
  error: ?string,
  speciesCount: number,
  profileIcon: string
}

class MainScreen extends Component<Props, State> {
  constructor( { navigation }: Props ) {
    super();

    this.state = {
      taxa: [],
      loading: true,
      latitude: null,
      longitude: null,
      location: "San Francisco",
      error: null,
      speciesCount: 115
    };

    ( this: any ).capitalizeNames = this.capitalizeNames.bind( this );
  }

  componentDidMount() {
    this.getGeolocation();
  }

  setTaxa( challenges: Array<Object> ) {
    this.setState( {
      taxa: challenges,
      loading: false
    } );
  }

  getGeolocation( ) {
    const {
      error,
      latitude,
      longitude
    } = this.state;

    navigator.geolocation.getCurrentPosition( ( position ) => {
      this.setState( {
        latitude: this.truncateCoordinates( position.coords.latitude ),
        longitude: this.truncateCoordinates( position.coords.longitude ),
        error: null
      } );
    }, ( err ) => {
      this.setState( {
        error: err.message
      } );
    } );

    if ( !error ) {
      this.fetchChallenges( latitude, longitude );
    }
  }

  truncateCoordinates( coordinate: number ) {
    return Number( coordinate.toFixed( 2 ) );
  }

  capitalizeNames( name: string ) {
    const titleCaseName = name.split( " " )
      .map( string => string.charAt( 0 ).toUpperCase() + string.substring( 1 ) )
      .join( " " );
    return titleCaseName;
  }

  fetchChallenges( latitude: ?number, longitude: ?number ) {
    const params = {
      verifiable: true,
      photos: true,
      per_page: 9,
      lat: latitude, // 37.7749, San Francisco hardcoded for testing
      lng: longitude, // -122.4194, San Francisco hardcoded for testing
      radius: 50,
      threatened: false,
      oauth_application_id: "2,3",
      hrank: "species",
      include_only_vision_taxa: true,
      not_in_list_id: 945029
    };

    inatjs.observations.speciesCounts( params ).then( ( response ) => {
      const challenges = response.results.map( r => r.taxon );
      this.setTaxa( challenges );
    } ).catch( ( err ) => {
      this.setState( {
        error: err.message
      } );
    } );
  }

  results( taxa: Array<Object> ) {
    const {
      location,
      profileIcon,
      speciesCount
    } = this.state;

    const {
      navigation
    } = this.props;

    return (
      <ChallengeScreen
        taxa={taxa}
        location={location}
        capitalizeNames={this.capitalizeNames}
        profileIcon={profileIcon}
        navigation={navigation}
        speciesCount={speciesCount}
      />
    );
  }

  render() {
    const {
      error,
      loading,
      taxa
    } = this.state;

    let challenges;

    if ( error ) {
      challenges = <ErrorScreen error={error} />;
    } else if ( loading ) {
      challenges = <LoadingScreen />;
    } else {
      challenges = this.results( taxa );
    }

    return (
      <View style={ { flex: 1 } }>
        <View style={ styles.container }>
          <StatusBar
            barStyle="light-content"
            backgroundColor="#4F6D7A"
          />
          { challenges }
        </View>
      </View>
    );
  }
}

export default MainScreen;
