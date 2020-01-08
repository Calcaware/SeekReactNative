// @flow
import React from "react";
import {
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
  SafeAreaView
} from "react-native";
import { withNavigation } from "react-navigation";

import styles from "../../styles/uiComponents/footer";
import icons from "../../assets/icons";
import i18n from "../../i18n";
import backgrounds from "../../assets/backgrounds";

type Props = {
  +navigation: any,
  +openFlagModal: Function
}

const MatchFooter = ( { navigation, openFlagModal }: Props ) => (
  <SafeAreaView>
    <ImageBackground source={backgrounds.navBar} style={styles.container}>
      <View style={[styles.navbar, styles.row]}>
        <TouchableOpacity
          accessibilityLabel={i18n.t( "accessibility.menu" )}
          accessible
          onPress={() => navigation.openDrawer()}
          style={styles.leftIcon}
        >
          <Image source={icons.hamburger} />
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityLabel={i18n.t( "accessibility.camera" )}
          accessible
          onPress={() => navigation.navigate( "Camera" )}
          style={styles.camera}
        >
          <Image source={icons.cameraGreen} style={styles.cameraImage} />
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityLabel={i18n.t( "accessibility.flag" )}
          accessible
          onPress={() => openFlagModal()}
          style={styles.flagPadding}
        >
          <Image source={icons.flag} />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  </SafeAreaView>
);

export default withNavigation( MatchFooter );
