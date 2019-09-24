// @flow
import React, { Component } from "react";
import {
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Text
} from "react-native";
import MapView, { PROVIDER_DEFAULT, UrlTile, Marker } from "react-native-maps";
import Modal from "react-native-modal";
import { NavigationEvents } from "react-navigation";

import i18n from "../../i18n";
import styles from "../../styles/species/rangeMap";
import { fetchTruncatedUserLocation } from "../../utility/locationHelpers";
import icons from "../../assets/icons";
import GreenHeader from "../GreenHeader";
import Legend from "./Legend";

const latitudeDelta = 0.2;
const longitudeDelta = 0.2;

type Props = {
  navigation: any
}


class RangeMap extends Component<Props> {
  constructor( { navigation }: Props ) {
    super();

    const { region, id, seenDate } = navigation.state.params;

    this.state = {
      region,
      id,
      showModal: false,
      obsLocation: {
        latitude: region.latitude,
        longitude: region.longitude
      },
      userLocation: {},
      seenDate
    };

    this.toggleModal = this.toggleModal.bind( this );
  }

  getUserLocation() {
    fetchTruncatedUserLocation().then( ( coords ) => {
      if ( coords ) {
        const { latitude, longitude } = coords;

        this.setState( {
          userLocation: {
            latitude,
            longitude,
            latitudeDelta,
            longitudeDelta
          }
        } );
      }
    } );
  }

  returnToUserLocation() {
    const { userLocation } = this.state;

    this.setState( { region: userLocation } );
  }

  toggleModal() {
    const { showModal } = this.state;
    this.setState( { showModal: !showModal } );
  }

  render() {
    const {
      region,
      id,
      showModal,
      obsLocation,
      userLocation,
      seenDate
    } = this.state;
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeViewTop} />
        <SafeAreaView style={styles.safeView}>
          <NavigationEvents
            onWillFocus={() => this.getUserLocation()}
          />
          <Modal
            isVisible={showModal}
            onSwipeComplete={() => this.toggleModal()}
            onBackdropPress={() => this.toggleModal()}
            swipeDirection="down"
          >
            <Legend toggleModal={this.toggleModal} />
          </Modal>
          <GreenHeader
            header={i18n.t( "species_detail.range_map" )}
            navigation={navigation}
            route="Species"
          />
          {region.latitude ? (
            <MapView
              region={region}
              provider={PROVIDER_DEFAULT}
              style={styles.map}
              zoomEnabled
            >
              <UrlTile
                urlTemplate={`https://api.inaturalist.org/v1/colored_heatmap/{z}/{x}/{y}.png?taxon_id=${id}&color=%2377B300`}
                tileSize={512}
              />
              {seenDate && obsLocation.latitude ? (
                <Marker
                  coordinate={{ latitude: obsLocation.latitude, longitude: obsLocation.longitude }}
                >
                  <Image source={icons.cameraOnMap} />
                </Marker>
              ) : null}
              {userLocation.latitude ? (
                <Marker
                  coordinate={{
                    latitude: userLocation.latitude,
                    longitude: userLocation.longitude
                  }}
                >
                  <Image source={icons.locationPin} style={{ marginBottom: 23 }} />
                </Marker>
              ) : null}
            </MapView>
          ) : null}
          <View style={styles.legendPosition}>
            <TouchableOpacity
              onPress={() => this.toggleModal()}
              style={styles.legend}
            >
              <Text style={styles.whiteText}>
                {i18n.t( "species_detail.legend" ).toLocaleUpperCase()}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.userLocation}>
            <TouchableOpacity
              onPress={() => this.returnToUserLocation()}
              style={styles.locationIcon}
            >
              <Image source={icons.indicator} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

export default RangeMap;
