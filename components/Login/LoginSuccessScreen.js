// @flow

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView
} from "react-native";

import i18n from "../../i18n";
import styles from "../../styles/login/login";
import SafeAreaView from "../UIComponents/SafeAreaView";
import GreenText from "../UIComponents/GreenText";
import GreenButton from "../UIComponents/Buttons/GreenButton";

type Props = {
  +navigation: any
}

const LoginSuccessScreen = ( { navigation }: Props ) => (
  <View style={styles.container}>
    <SafeAreaView />
    <View style={styles.greenHeader}>
      <Text style={styles.loginSuccessHeaderText}>
        {i18n.t( "inat_signup.welcome" ).toLocaleUpperCase()}
      </Text>
    </View>
    <ScrollView>
      <View style={styles.center}>
        <Text style={styles.linkedAccountHeader}>{i18n.t( "inat_signup.linked_account" )}</Text>
      </View>
      <View style={styles.textContainer}>
        <GreenText smaller text="inat_signup.posting" />
        <View style={styles.marginSmall} />
        <Text style={styles.descriptionText}>{i18n.t( "inat_signup.posting_details" )}</Text>
        <View style={styles.marginMedium} />
        <GreenText smaller text="inat_signup.observations" />
        <View style={styles.marginSmall} />
        <Text style={styles.descriptionText}>
          {i18n.t( "inat_signup.observations_1" )}
          {" "}
          <Text style={styles.underline}>
            {i18n.t( "inat_signup.observations_2" )}
          </Text>
          {" "}
          {i18n.t( "inat_signup.observations_3" )}
        </Text>
      </View>
      <View style={styles.marginLarge} />
      <GreenButton
        handlePress={() => navigation.navigate( "Home" )}
        login
        text="inat_signup.continue"
      />
      <View style={[styles.center, styles.row]}>
        <TouchableOpacity
          onPress={() => navigation.navigate( "Privacy" )}
        >
          <Text style={styles.textLink}>
            {i18n.t( "inat_signup.privacy" )}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate( "TermsOfService" )}
        >
          <Text style={[styles.textLink, styles.marginLeft]}>
            {i18n.t( "inat_signup.terms" )}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  </View>
);

export default LoginSuccessScreen;
