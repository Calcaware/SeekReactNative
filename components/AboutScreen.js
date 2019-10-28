// @flow

import React, { Component } from "react";
import {
  Image,
  ScrollView,
  Text,
  View,
  Platform
} from "react-native";
import { NavigationEvents } from "react-navigation";

import styles from "../styles/about";
import logos from "../assets/logos";
import i18n from "../i18n";
import GreenHeader from "./UIComponents/GreenHeader";
import Padding from "./UIComponents/Padding";
import SafeAreaView from "./UIComponents/SafeAreaView";

type Props = {
  +navigation: any
};

class AboutScreen extends Component<Props> {
  scrollToTop() {
    this.scrollView.scrollTo( {
      x: 0, y: 0, animated: Platform.OS === "android"
    } );
  }

  render() {
    const { navigation } = this.props;
    const version = "2.3.6";
    const buildNumber = 67;

    return (
      <React.Fragment>
        <SafeAreaView />
        <NavigationEvents
          onWillFocus={() => {
            this.scrollToTop();
          }}
        />
        <GreenHeader header={i18n.t( "about.header" )} navigation={navigation} />
        <ScrollView
          ref={( ref ) => { this.scrollView = ref; }}
          contentContainerStyle={styles.textContainer}
        >
          <View style={styles.row}>
            <Image source={logos.opBlack} />
            <Image source={logos.wwf} style={{ marginLeft: 20 }} />
          </View>
          <View style={styles.margin} />
          <Text style={styles.boldText}>{i18n.t( "about.sponsored" )}</Text>
          <Text style={styles.text}>{i18n.t( "about.our_planet" )}</Text>
          <View style={styles.block} />
          <Image source={logos.iNat} />
          <View style={styles.margin} />
          <Text style={styles.boldText}>{i18n.t( "about.seek" )}</Text>
          <Text style={styles.text}>{i18n.t( "about.joint_initiative" )}</Text>
          <View style={styles.block} />
          <Image source={logos.casNatGeo} style={styles.image} />
          <View style={styles.margin} />
          <Text style={styles.text}>{i18n.t( "about.original" )}</Text>
          <View style={styles.margin} />
          <Image source={logos.hhmi} />
          <View style={styles.block} />
          <Text style={styles.boldText}>{i18n.t( "about.designed_by" )}</Text>
          <Text style={styles.text}>{i18n.t( "about.inat_team" )}</Text>
          <View style={styles.block} />
          <Text style={styles.greenText}>
            {i18n.t( "about.version" ).toLocaleUpperCase()}
            {` ${version} (${buildNumber})`}
          </Text>
          <View style={styles.block} />
          <Text style={styles.text}>
            {i18n.t( "about.help" )}
          </Text>
          <View style={styles.block} />
          <Padding />
        </ScrollView>
      </React.Fragment>
    );
  }
}

export default AboutScreen;
