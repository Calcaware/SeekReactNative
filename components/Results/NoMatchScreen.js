// @flow

import React from "react";
import {
  View,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  SafeAreaView
} from "react-native";
import LinearGradient from "react-native-linear-gradient";

import styles from "../../styles/results/results";
import Footer from "../Home/Footer";
import Padding from "../Padding";
import i18n from "../../i18n";
import BackArrow from "../BackArrow";
import PostToiNat from "./PostToiNat";

type Props = {
  userImage: string,
  navigation: any,
  isLoggedIn: boolean
}

const MatchScreen = ( {
  userImage,
  navigation,
  isLoggedIn
}: Props ) => (
  <View style={styles.container}>
    <SafeAreaView style={{ flex: 0, backgroundColor: "#404040" }} />
    <SafeAreaView style={styles.safeView}>
      <ScrollView>
        <LinearGradient
          colors={["#404040", "#5e5e5e"]}
          style={styles.header}
        >
          <BackArrow navigation={navigation} />
          <View style={[styles.imageContainer, styles.buttonContainer]}>
            <Image
              style={styles.imageCell}
              source={{ uri: userImage }}
            />
          </View>
        </LinearGradient>
        <View style={styles.textContainer}>
          <Text style={styles.headerText}>{i18n.t( "results.no_identification" ).toLocaleUpperCase()}</Text>
          <Text style={styles.text}>{i18n.t( "results.sorry" )}</Text>
          <TouchableOpacity
            style={[styles.button, styles.buttonGray]}
            onPress={() => navigation.navigate( "Camera" )}
          >
            <Text style={styles.buttonText}>
              {i18n.t( "results.take_photo" ).toLocaleUpperCase()}
            </Text>
          </TouchableOpacity>
          {isLoggedIn
            ? <PostToiNat navigation={navigation} color="#5e5e5e" />
            : null
          }
        </View>
        <Padding />
      </ScrollView>
      <Footer navigation={navigation} />
    </SafeAreaView>
  </View>
);

export default MatchScreen;
