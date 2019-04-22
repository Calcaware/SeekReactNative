// @flow

import React, { Component } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView
} from "react-native";
import Checkbox from "react-native-check-box";

import i18n from "../../i18n";
import styles from "../../styles/signup/signup";
import GreenHeader from "../GreenHeader";

type Props = {
  navigation: any
}

class LicensePhotosScreen extends Component<Props> {
  constructor() {
    super();

    this.state = {
      email: "",
      licensePhotos: false
    };
  }

  toggleLicensePhotos() {
    const { licensePhotos } = this.state;

    this.setState( {
      licensePhotos: !licensePhotos
    } );
  }

  submit() {
    const { navigation } = this.props;
    const { email, licensePhotos } = this.state;
    navigation.navigate( "Signup", { email, licensePhotos } );
  }

  render() {
    const { email, licensePhotos } = this.state;
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeViewTop} />
        <SafeAreaView style={styles.safeView}>
          <GreenHeader navigation={navigation} header={i18n.t( "login.sign_up" )} />
          <View style={styles.innerContainer}>
            <View style={{ marginTop: 49 }} />
            <View style={styles.leftTextContainer}>
              <Text style={styles.leftText}>
                {i18n.t( "inat_signup.email" ).toLocaleUpperCase()}
              </Text>
            </View>
            <TextInput
              style={styles.inputField}
              onChangeText={ value => this.setState( { email: value } )}
              value={email}
              placeholder="email"
              textContentType="emailAddress"
              autoFocus
            />
            <View style={{ marginHorizontal: 38 }}>
              <View style={styles.row}>
                <Checkbox
                  style={styles.checkBox}
                  onClick={() => this.toggleLicensePhotos()}
                  isChecked={licensePhotos}
                  checkBoxColor="#979797"
                />
                <View>
                  <Text style={styles.licenseText}>
                    {i18n.t( "inat_signup.release_photos" )}
                  </Text>
                  {/* <Text
                    style={styles.privacy}
                    onPress={() => navigation.navigate( "Privacy" )}
                  >
                    {i18n.t( "inat_signup.privacy" )}
                  </Text> */}
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={styles.greenButton}
              onPress={() => this.submit()}
            >
              <Text style={styles.buttonText}>
                {i18n.t( "inat_signup.next" ).toLocaleUpperCase()}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

export default LicensePhotosScreen;
