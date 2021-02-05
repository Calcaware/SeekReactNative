// @flow
import React from "react";
import { Image } from "react-native";
import MapView, {
  PROVIDER_DEFAULT,
  UrlTile,
  Marker
} from "react-native-maps";
import { useNavigation } from "@react-navigation/native";

import icons from "../../../assets/icons";
import styles from "../../../styles/species/speciesMap";
import GreenButton from "../../UIComponents/Buttons/GreenButton";
import SpeciesDetailCard from "../../UIComponents/SpeciesDetailCard";


type Props = {
  +region: Object,
  +id: number,
  +seenDate: ?string
}

const SpeciesMap = ( {
  region,
  id,
  seenDate
}: Props ) => {
  const navigation = useNavigation();

  const navToRangeMap = () => navigation.navigate( "RangeMap", { region, id, seenDate } );

  const displayMap = ( ) => (
    <MapView
      maxZoomLevel={7}
      onPress={navToRangeMap}
      provider={PROVIDER_DEFAULT}
      region={region}
      rotateEnabled={false}
      scrollEnabled={false}
      style={styles.map}
      zoomEnabled={false}
    >
      <UrlTile
        tileSize={512}
        urlTemplate={`https://api.inaturalist.org/v1/grid/{z}/{x}/{y}.png?taxon_id=${id}&color=%2377B300&verifiable=true`}
      />
      <Marker
        coordinate={{ latitude: region.latitude, longitude: region.longitude }}
      >
        <Image source={seenDate ? icons.cameraOnMap : icons.locationPin} />
      </Marker>
    </MapView>
  );

  return (
    <SpeciesDetailCard text="species_detail.range_map" hide={!region.latitude || !region.longitude}>
      {( ( region.latitude && region.longitude ) && id ) && displayMap( )}
      <GreenButton
        handlePress={navToRangeMap}
        text="species_detail.view_map"
      />
    </SpeciesDetailCard>
  );
};

export default SpeciesMap;
