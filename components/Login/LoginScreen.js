// @flow

import React, { Component } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity
} from "react-native";

import i18n from "../../i18n";
import styles from "../../styles/login/login";
import GreenHeader from "../UIComponents/GreenHeader";
import SafeAreaView from "../UIComponents/SafeAreaView";
import InputField from "../UIComponents/InputField";
import GreenText from "../UIComponents/GreenText";
import GreenButton from "../UIComponents/GreenButton";
import ErrorMessage from "../Signup/ErrorMessage";
import { saveAccessToken } from "../../utility/loginHelpers";
import config from "../../config";
import createUserAgent from "../../utility/userAgent";

type Props = {
  +navigation: any
}

type State = {
  username: string,
  password: string,
  error: boolean
}

class LoginScreen extends Component<Props, State> {
  constructor() {
    super();

    this.state = {
      username: "",
      password: "",
      error: false
    };
  }

  setError() {
    this.setState( { error: true } );
  }

  resetForm() {
    this.setState( {
      username: "",
      password: ""
    } );
  }

  retrieveOAuthToken( username: string, password: string ) {
    const params = {
      client_id: config.appId,
      client_secret: config.appSecret,
      grant_type: "password",
      username,
      password
    };

    const headers = {
      "Content-Type": "application/json",
      "User-Agent": createUserAgent()
    };

    const site = "https://www.inaturalist.org";

    fetch( `${site}/oauth/token`, {
      method: "POST",
      body: JSON.stringify( params ),
      headers
    } )
      .then( response => response.json() )
      .then( ( responseJson ) => {
        const accessToken = responseJson.access_token;
        saveAccessToken( accessToken );
        this.resetForm();
        this.submitSuccess();
      } ).catch( () => {
        this.setError();
      } );
  }

  async submitSuccess() {
    const { navigation } = this.props;
    navigation.navigate( "LoginSuccess" );
  }

  render() {
    const { username, password, error } = this.state;
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        <SafeAreaView />
        <GreenHeader
          header={i18n.t( "login.log_in" ).toLocaleUpperCase()}
          navigation={navigation}
        />
        <ScrollView>
          <View style={styles.leftTextMargins}>
            <GreenText smaller text="inat_login.username" />
          </View>
          <InputField
            handleTextChange={value => this.setState( { username: value } )}
            placeholder={i18n.t( "inat_login.username" )}
            text={username}
            type="username"
          />
          <View style={styles.leftTextMargins}>
            <GreenText smaller text="inat_login.password" />
          </View>
          <InputField
            handleTextChange={value => this.setState( { password: value } )}
            placeholder="*********"
            secureTextEntry
            text={password}
            type="password"
          />
          <TouchableOpacity
            onPress={() => navigation.navigate( "Forgot" )}
            style={styles.rightTextContainer}
          >
            <Text style={styles.forgotPasswordText}>
              {i18n.t( "inat_login.forgot_password" )}
            </Text>
          </TouchableOpacity>
          {error ? <ErrorMessage error="credentials" /> : <View style={styles.greenButtonMargin} />}
          <GreenButton
            handlePress={() => this.retrieveOAuthToken( username, password )}
            login
            text={i18n.t( "inat_login.log_in" )}
          />
        </ScrollView>
      </View>
    );
  }
}

export default LoginScreen;
