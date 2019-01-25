// @flow

import React, { Component } from "react";
import {
  View,
  ScrollView,
  Platform,
  PermissionsAndroid,
  Modal,
  NetInfo,
  SafeAreaView,
  StatusBar
} from "react-native";
import Geocoder from "react-native-geocoder";
import Realm from "realm";
import inatjs from "inaturalistjs";
import { NavigationEvents } from "react-navigation";
import Permissions from "react-native-permissions";

import i18n from "../../i18n";
import styles from "../../styles/home/home";
import LocationPicker from "./LocationPicker";
import SpeciesNearby from "./SpeciesNearby";
import GetStarted from "./GetStarted";
import Challenges from "./Challenges";
import Footer from "./Footer";
import Padding from "../Padding";
import { checkIfCardShown, fetchObservationData } from "../../utility/helpers";
import { truncateCoordinates, setLatAndLng } from "../../utility/locationHelpers";
import { getPreviousAndNextMonth } from "../../utility/dateHelpers";
import taxonIds from "../../utility/taxonDict";
import realmConfig from "../../models/index";

type Props = {
  navigation: any
}

class HomeScreen extends Component<Props> {
  constructor() {
    super();

    this.state = {
      latitude: null,
      longitude: null,
      location: null,
      taxa: [],
      taxaType: "all",
      loading: false,
      modalVisible: false,
      notifications: false,
      error: null,
      isFirstLaunch: false
    };

    this.updateTaxaType = this.updateTaxaType.bind( this );
    this.updateLocation = this.updateLocation.bind( this );
    this.toggleLocationPicker = this.toggleLocationPicker.bind( this );
    this.checkRealmForSpecies = this.checkRealmForSpecies.bind( this );
  }

  // componentWillMount() {

  // }

  setLoading( loading ) {
    this.setState( { loading } );
  }

  setTaxa( taxa ) {
    this.setState( { taxa } );
    this.setLoading( false );
  }

  setError( error ) {
    this.setState( {
      error
    } );

    if ( error === "location" ) {
      this.setState( {
        location: i18n.t( "species_nearby.no_location" )
      } );
    }
  }

  getGeolocation() {
    navigator.geolocation.getCurrentPosition( ( position ) => {
      const latitude = truncateCoordinates( position.coords.latitude );
      const longitude = truncateCoordinates( position.coords.longitude );
      this.reverseGeocodeLocation( latitude, longitude );

      setLatAndLng( latitude.toString(), longitude.toString() );

      this.setState( {
        latitude,
        longitude
      }, () => this.checkRealmForSpecies( latitude, longitude ) );
    }, () => {
      this.checkInternetConnection();
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
        this.setError( "location" );
      }
    } catch ( err ) {
      this.checkInternetConnection();
    }
  }

  async checkForFirstLaunch() {
    const isFirstLaunch = await checkIfCardShown();
    this.setState( {
      isFirstLaunch
    } );
  }

  updateTaxaType( taxaType ) {
    const { latitude, longitude } = this.state;
    this.setLoading( true );
    this.setState( {
      taxaType
    }, () => this.checkRealmForSpecies( latitude, longitude ) );
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
      this.checkRealmForSpecies( latitude, longitude );
    }
  }

  reverseGeocodeLocation( lat, lng ) {
    Geocoder.geocodePosition( { lat, lng } ).then( ( result ) => {
      const { locality, subAdminArea } = result[0];
      this.setState( {
        location: locality || subAdminArea
      } );
    } ).catch( () => {
      this.checkInternetConnection();
    } );
  }

  checkInternetConnection() {
    NetInfo.getConnectionInfo()
      .then( ( connectionInfo ) => {
        if ( connectionInfo.type === "none" || connectionInfo.type === "unknown" ) {
          this.setError( "internet" );
          this.setLoading( false );
        } else {
          this.checkiOSPermissions();
        }
      } );
  }

  checkiOSPermissions() {
    Permissions.check( "location" ).then( ( response ) => {
      if ( response !== "authorized" ) {
        this.setError( "location" );
      } else {
        this.setError( null );
      }
    } ).catch( () => this.setError( null ) );
  }

  checkRealmForSpecies( lat, lng ) {
    const { taxaType } = this.state;
    this.setLoading( true );
    this.checkInternetConnection();
    if ( !lat || !lng ) {
      this.fetchUserLocation();
    }

    const params = {
      verifiable: true,
      photos: true,
      per_page: 9,
      lat,
      lng,
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
        this.fetchSpeciesNearby( params );
      } ).catch( () => {
        this.fetchSpeciesNearby( params );
      } );
  }

  fetchSpeciesNearby( params ) {
    inatjs.observations.speciesCounts( params ).then( ( response ) => {
      const taxa = response.results.map( r => r.taxon );
      this.setTaxa( taxa );
    } ).catch( () => {
      this.checkInternetConnection();
    } );
  }

  toggleLocationPicker() {
    const { modalVisible, error } = this.state;

    if ( !error ) {
      this.setState( {
        modalVisible: !modalVisible
      } );
    }
  }

  updateLocation( latitude, longitude, location ) {
    this.setLoading( true );
    this.setState( {
      latitude,
      longitude,
      location
    }, () => {
      this.toggleLocationPicker();
      this.checkRealmForSpecies( latitude, longitude );
    } );
  }

  render() {
    const {
      location,
      latitude,
      longitude,
      loading,
      taxa,
      modalVisible,
      notifications,
      error,
      isFirstLaunch
    } = this.state;
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <SafeAreaView style={styles.safeViewTop} />
        <SafeAreaView style={styles.safeView}>
          <View style={styles.container}>
            <NavigationEvents
              onWillFocus={() => {
                this.checkForFirstLaunch();
                this.checkInternetConnection();
                this.fetchUserLocation();
                fetchObservationData();
              }}
            />
            <ScrollView>
              <Modal
                visible={modalVisible}
                onRequestClose={() => this.toggleLocationPicker()}
              >
                <LocationPicker
                  latitude={latitude}
                  longitude={longitude}
                  location={location}
                  updateLocation={this.updateLocation}
                />
              </Modal>
              <SpeciesNearby
                taxa={taxa}
                loading={loading}
                navigation={navigation}
                location={location}
                latitude={latitude}
                longitude={longitude}
                updateTaxaType={this.updateTaxaType}
                toggleLocationPicker={this.toggleLocationPicker}
                error={error}
                checkRealmForSpecies={this.checkRealmForSpecies}
              />
              { isFirstLaunch ? <GetStarted navigation={navigation} /> : null }
              <Challenges navigation={navigation} />
              <Padding />
            </ScrollView>
          </View>
          <Footer
            navigation={navigation}
            notifications={notifications}
          />
        </SafeAreaView>
      </View>
    );
  }
}

export default HomeScreen;
