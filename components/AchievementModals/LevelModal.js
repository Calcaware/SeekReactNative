// @flow

import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity
} from "react-native";
import LinearGradient from "react-native-linear-gradient";

import i18n from "../../i18n";
import styles from "../../styles/badges/level";
import badgeImages from "../../assets/badges";
import icons from "../../assets/icons";

type Props = {
  +level: Object,
  +speciesCount: number,
  +toggleLevelModal: Function,
  +screen: string
};

const LevelModal = ( {
  level,
  speciesCount,
  toggleLevelModal,
  screen
}: Props ) => (
  <React.Fragment>
    <View style={[styles.innerContainer, styles.modalTop]}>
      <Text style={styles.headerText}>
        {screen === "achievements"
          ? i18n.t( "badges.your_level" ).toLocaleUpperCase()
          : i18n.t( "banner.level_up" ).toLocaleUpperCase()}
      </Text>
    </View>
    <LinearGradient
      colors={["#38976d", "#22784d"]}
      style={styles.backgroundColor}
    >
      <Image
        source={badgeImages[level.earnedIconName]}
        style={styles.image}
      />
      <Text style={styles.nameText}>{i18n.t( level.intlName ).toLocaleUpperCase()}</Text>
    </LinearGradient>
    <View style={[styles.innerContainer, styles.modalBottom]}>
      <Text style={styles.text}>{i18n.t( "banner.number_seen", { number: speciesCount } )}</Text>
    </View>
    <TouchableOpacity onPress={() => toggleLevelModal()} style={styles.backButton}>
      <Image source={icons.closeModal} />
    </TouchableOpacity>
  </React.Fragment>
);

export default LevelModal;
