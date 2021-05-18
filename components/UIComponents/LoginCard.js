// @flow

import * as React from "react";
import {
  View,
  Text
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import { viewStyles, textStyles } from "../../styles/uiComponents/loginCard";
import i18n from "../../i18n";
import { removeAccessToken } from "../../utility/loginHelpers";
import GreenButton from "./Buttons/GreenButton";
import { UserContext } from "../UserContext";

const LoginCard = (): React.Node => {
  const navigation = useNavigation();
  const { name } = useRoute();

  const logUserOut = async ( user: Object ) => {
    const loggedOut = await removeAccessToken();
    if ( loggedOut === null ) {
      user.updateLogin( );
    }
  };

  return (
    <UserContext.Consumer>
      {user => (
        <View style={viewStyles.container}>
          {user && (
            <>
              {name === "Achievements" ? (
                <Text style={viewStyles.loginText}>
                  {user.login
                    ? i18n.t( "inat_stats.logged_in" )
                    : i18n.t( "badges.login" )}
                </Text>
              ) : (
                <Text style={textStyles.italicText}>
                  {user.login
                    ? i18n.t( "inat_stats.logged_in" )
                    : i18n.t( "inat_stats.thanks" )}
                </Text>
              )}
            </>
          )}
          {name !== "achievements" && <View style={viewStyles.margin} />}
          {user && (
            <GreenButton
              handlePress={() => {
                if ( user.login ) {
                  logUserOut( user );
                } else {
                  navigation.navigate( "LoginOrSignup" );
                }
              }}
              text={user.login
                ? "inat_stats.sign_out"
                : "inat_stats.join"}
            />
          )}
        </View>
      )}
    </UserContext.Consumer>
  );
};

export default LoginCard;
