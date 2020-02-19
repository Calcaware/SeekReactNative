// @flow

import React, { useRef } from "react";
import {
  Image,
  ScrollView,
  Text,
  View,
  Platform,
  TouchableOpacity
} from "react-native";
import { DrawerContentComponentProps } from "react-navigation-drawer";
import { getVersion, getBuildNumber } from "react-native-device-info";

import styles from "../styles/about";
import logos from "../assets/logos";
import i18n from "../i18n";
import GreenHeader from "./UIComponents/GreenHeader";
import Padding from "./UIComponents/Padding";
import SafeAreaView from "./UIComponents/SafeAreaView";
import UserContext from "./UserContext";
import { useScrollToTop } from "../utility/customHooks";

const AboutScreen = ( { navigation }: DrawerContentComponentProps ) => {
  const scrollView = useRef( null );
  const appVersion = getVersion();
  const buildVersion = getBuildNumber();

  useScrollToTop( scrollView, navigation ); // custom, reusable hook

  return (
    <UserContext.Consumer>
      {user => (
        <View style={styles.background}>
          <SafeAreaView />
          <GreenHeader header="about.header" />
          <ScrollView
            ref={scrollView}
            contentContainerStyle={styles.textContainer}
          >
            <Image source={logos.wwfop} />
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
            <Text style={styles.text}>{i18n.t( "about.translations" )}</Text>
            <Text style={styles.text}>{i18n.t( "about.join_crowdin" )}</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate( "DebugAndroid" )}
              style={styles.debug}
              disabled={Platform.OS === "ios" || !user.login}
            >
              <Text style={styles.greenText}>
                {i18n.t( "about.version" ).toLocaleUpperCase()}
                {` ${appVersion} (${buildVersion})`}
              </Text>
            </TouchableOpacity>
            <Text style={styles.text}>
              {i18n.t( "about.help" )}
            </Text>
            <View style={styles.block} />
            <Padding />
          </ScrollView>
        </View>
      ) }
    </UserContext.Consumer>
  );
};

export default AboutScreen;
