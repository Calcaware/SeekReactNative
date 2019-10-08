// @flow
import React from "react";
import {
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
  SafeAreaView
} from "react-native";

import styles from "../../styles/home/footer";
import icons from "../../assets/icons";
import backgrounds from "../../assets/backgrounds";

type Props = {
  +navigation: any,
  +toggleFlagModal: Function
}

const MatchFooter = ( { navigation, toggleFlagModal }: Props ) => (
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
          onPress={() => toggleFlagModal()}
          style={styles.button}
        >
          <Image source={icons.flag} />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  </SafeAreaView>
);

export default MatchFooter;
