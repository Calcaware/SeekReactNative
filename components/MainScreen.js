// @flow

import React, { Component } from "react";
import inatjs from "inaturalistjs";
import Geocoder from "react-native-geocoder";
import Realm from "realm";
import {
  PermissionsAndroid,
  Platform,
  View,
  SafeAreaView,
  ImageBackground
} from "react-native";
import { NavigationEvents } from "react-navigation";

import realmConfig from "../models/index";

import Banner from "./Banner";
import ChallengeGrid from "./Challenges/ChallengeGrid";
import ChallengeHeader from "./Challenges/ChallengeHeader";
import ChallengeFooter from "./Challenges/ChallengeFooter";
import LoadingWheel from "./LoadingWheel";
import ErrorScreen from "./ErrorScreen";
import styles from "../styles/challenges";
import taxonIds from "../utility/taxonDict";
import {
  recalculateBadges,
  truncateCoordinates,
  getPreviousAndNextMonth
} from "../utility/helpers";

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

    const {
      taxaName,
      id,
      taxaType,
      latitude,
      longitude
    } = navigation.state.params;

    this.state = {
      taxa: [],
      loading: true,
      latitude,
      longitude,
      location: null,
      error: null,
      taxaType,
      badgeCount: 0,
      speciesCount: 0,
      taxaName,
      id
    };
  }

  setTaxa( challenges: Array<Object> ) {
    this.setState( {
      taxa: challenges,
      loading: false
    } );
  }

  getGeolocation() {
    navigator.geolocation.getCurrentPosition( ( position ) => {
      const latitude = truncateCoordinates( position.coords.latitude );
      const longitude = truncateCoordinates( position.coords.longitude );

      this.setState( {
        latitude,
        longitude,
        location: this.reverseGeocodeLocation( latitude, longitude ),
        error: null
      }, () => this.fetchChallenges( latitude, longitude ) );
    }, ( err ) => {
      this.setState( {
        error: `Couldn't fetch your current location: ${err.message}.`
      } );
    } );
  }

  requestAndroidPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if ( granted === PermissionsAndroid.RESULTS.GRANTED ) {
        this.getGeolocation();
      } else {
        this.showError( JSON.stringify( granted ) );
      }
    } catch ( err ) {
      this.showError( err );
    }
  }

  fetchUserLocation() {
    const { latitude, longitude } = this.state;

    if ( !latitude && !longitude ) {
      if ( Platform.OS === "android" ) {
        this.requestAndroidPermissions();
      } else {
        this.getGeolocation();
      }
    } else {
      this.reverseGeocodeLocation( latitude, longitude );
      this.fetchChallenges( latitude, longitude );
    }
  }

  showError( err ) {
    this.setState( {
      error: err || "Permission to access location denied",
      loading: false
    } );
  }

  fetchChallenges( latitude: ?number, longitude: ?number ) {
    this.setState( {
      loading: true
    } );

    const { taxaType } = this.state;

    const params = {
      verifiable: true,
      photos: true,
      per_page: 9,
      lat: latitude,
      lng: longitude,
      radius: 50,
      threatened: false,
      oauth_application_id: "2,3",
      hrank: "species",
      include_only_vision_taxa: true,
      not_in_list_id: 945029,
      month: getPreviousAndNextMonth()
    };

    if ( taxonIds[taxaType] ) {
      params.taxon_id = taxonIds[taxaType];
    }

    Realm.open( realmConfig )
      .then( ( realm ) => {
        const existingTaxonIds = realm.objects( "TaxonRealm" ).map( t => t.id );
        params.without_taxon_id = existingTaxonIds.join( "," );
        this.fetchTaxonForChallenges( params );
      } ).catch( ( err ) => {
        // console.log( "[DEBUG] Failed to open realm, error: ", err );
        this.fetchTaxonForChallenges( params );
      } );
  }

  fetchSpeciesAndBadgeCount() {
    recalculateBadges();

    Realm.open( realmConfig )
      .then( ( realm ) => {
        const badgeCount = realm.objects( "BadgeRealm" ).filtered( "earned == true" ).length;
        const speciesCount = realm.objects( "ObservationRealm" ).length;

        this.setState( {
          speciesCount,
          badgeCount
        } );
      } ).catch( ( err ) => {
        // console.log( "[DEBUG] Failed to open realm, error: ", err );
      } );
  }

  fetchTaxonForChallenges( params ) {
    inatjs.observations.speciesCounts( params ).then( ( response ) => {
      const challenges = response.results.map( r => r.taxon );
      this.setTaxa( challenges );
    } ).catch( ( err ) => {
      this.setState( {
        error: `Unable to load challenges: ${err.message}`
      } );
    } );
  }

  reverseGeocodeLocation( latitude, longitude ) {
    Geocoder.geocodePosition( { lat: latitude, lng: longitude } ).then( ( result ) => {
      const { locality, subAdminArea } = result[0];
      this.setState( {
        location: locality || subAdminArea
      } ); // might need an error state here
    } ).catch( ( err ) => {
      this.setState( {
        error: `${err}: We weren't able to determine your location. Please try again.`
      } );
    } );
  }

  render() {
    const {
      taxaName,
      error,
      loading,
      latitude,
      longitude,
      location,
      badgeCount,
      speciesCount,
      taxaType,
      taxa,
      id
    } = this.state;

    const {
      navigation
    } = this.props;

    let challenges;

    if ( error ) {
      challenges = <ErrorScreen error={error} />;
    } else if ( loading ) {
      challenges = <LoadingWheel />;
    } else if ( taxa.length === 0 ) {
      challenges = <ErrorScreen error={`We couldn't find any ${taxaType} in this location. Please try again.`} />;
    } else {
      challenges = (
        <ChallengeGrid
          navigation={navigation}
          taxa={taxa}
          latitude={latitude}
          longitude={longitude}
          location={location}
        />
      );
    }

    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.mainContainer}>
          <NavigationEvents
            onWillFocus={() => {
              this.fetchSpeciesAndBadgeCount();
              this.fetchUserLocation();
            }}
          />
          <ImageBackground
            style={styles.backgroundImage}
            source={require( "../assets/backgrounds/background.png" )}
          >
            <View style={styles.container}>
              { taxaName ? (
                <Banner
                  bannerText={`${taxaName} collected!`}
                  main
                  id={id}
                />
              ) : null }
              <ChallengeHeader
                latitude={latitude}
                longitude={longitude}
                location={location}
                loading={loading}
                navigation={navigation}
                taxaType={taxaType}
                taxaName={taxaName}
              />
              {challenges}
              <ChallengeFooter
                latitude={latitude}
                longitude={longitude}
                navigation={navigation}
                badgeCount={badgeCount}
                speciesCount={speciesCount}
              />
            </View>
          </ImageBackground>
        </View>
      </SafeAreaView>
    );
  }
}

export default MainScreen;
