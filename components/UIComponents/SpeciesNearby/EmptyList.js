import * as React from "react";
import { Text, View } from "react-native";
import { useRoute } from "@react-navigation/native";

import styles from "../../../styles/uiComponents/speciesNearby/emptyList";
import i18n from "../../../i18n";

const EmptyList = () => {
  const { name } = useRoute();

  let text = null;

  if ( name === "Species" ) {
    text = i18n.t( "species_detail.similar_no_species" );
  } else if ( name === "Home" ) {
    text = i18n.t( "species_nearby.no_species" );
  } else {
    text = i18n.t( "results.nothing_nearby" );
  }

  return (
    <View style={styles.noTaxon}>
      <Text style={styles.cellTitleText}>
        {text}
      </Text>
    </View>
  );
};

export default EmptyList;
