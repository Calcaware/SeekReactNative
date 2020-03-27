// @flow

import React from "react";
import { View, Text, Image } from "react-native";
import { isAfter } from "date-fns";

import i18n from "../../../i18n";
import styles from "../../../styles/uiComponents/challenges";
import logos from "../../../assets/logos";
import badges from "../../../assets/badges";

type Props = {
  challenge: Object,
  large?: boolean
}

const ChallengeBadgeRow = ( { challenge, large }: Props ) => {
  const is2020Challenge = challenge && isAfter( challenge.availableDate, new Date( 2020, 2, 1 ) );

  const text = is2020Challenge ? i18n.t( "challenges_card.new_join" ) : i18n.t( "challenges_card.join" );
  const longText = text.length > 70;

  let badge;

  if ( challenge && challenge.percentComplete === 100 ) {
    badge = <Image source={badges[challenge.earnedIconName]} style={styles.badge} />;
  } else if ( large && !is2020Challenge ) {
    badge = <Image source={logos.op} style={styles.image} />;
  } else {
    badge = <Image source={badges["badge-empty-white"]} style={large ? styles.badge : styles.badgeSmall} />;
  }

  return (
    <View style={[styles.row, styles.center]}>
      {badge}
      <View style={styles.marginMiddle} />
      <Text style={[large ? styles.text : styles.textSmall, longText && styles.longText]}>
        {text}
      </Text>
    </View>
  );
};

ChallengeBadgeRow.defaultProps = {
  large: false
};

export default ChallengeBadgeRow;
