// @flow
import React from "react";
import { View, Image } from "react-native";
import MapView, { PROVIDER_DEFAULT, UrlTile, Marker } from "react-native-maps";

import i18n from "../../i18n";
import styles from "../../styles/species/rangeMap";
import icons from "../../assets/icons";
import GreenHeader from "../GreenHeader";

type Props = {
  navigation: any
}

const RangeMap = ( { navigation }: Props ) => {
  const { region, id } = navigation.state.params;

  return (
    <View style={styles.container}>
      <GreenHeader header={i18n.t( "species_detail.range_map" )} navigation={navigation} />
      {region.latitude ? (
        <MapView
          region={region}
          provider={PROVIDER_DEFAULT}
          style={styles.map}
          maxZoomLevel={7}
        >
          <UrlTile
            urlTemplate={`https://api.inaturalist.org/v1/colored_heatmap/{z}/{x}/{y}.png?taxon_id=${id}`}
          />
          <Marker
            coordinate={{ latitude: region.latitude, longitude: region.longitude }}
          >
            <Image source={icons.locationPin} />
          </Marker>

        </MapView>
      ) : null}
    </View>
  );
};

export default RangeMap;
