// @flow

import React from "react";
import {
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
  SafeAreaView
} from "react-native";

import styles from "../../styles/uiComponents/footer";
import icons from "../../assets/icons";
import backgrounds from "../../assets/backgrounds";

type Props = {
  +navigation: any
}

const Footer = ( { navigation }: Props ) => (
  <SafeAreaView>
    <ImageBackground source={backgrounds.navBar} style={styles.container}>
      <View style={[styles.navbar, styles.row]}>
        <TouchableOpacity
          hitSlop={styles.touchable}
          onPress={() => navigation.openDrawer()}
          style={styles.button}
        >
          <Image source={icons.hamburger} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate( "Camera" )}>
          <Image source={icons.cameraGreen} style={styles.cameraImage} />
        </TouchableOpacity>
        <TouchableOpacity
          hitSlop={styles.touchable}
          onPress={() => {
            if ( navigation.state ) {
              if ( navigation.state.routeName !== "iNatStats" ) {
                navigation.navigate( "iNatStats" );
              }
            }
          }}
          style={styles.button}
        >
          <Image source={icons.birdTeal} style={{ width: 36, height: 29, resizeMode: "contain" }} />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  </SafeAreaView>
);

export default Footer;
