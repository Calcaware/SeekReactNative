// @flow

import * as React from "react";
import { View, Text, Image } from "react-native";
import { useRoute } from "@react-navigation/native";

import { viewStyles, textStyles, imageStyles } from "../../styles/iNaturalist/iNatStats";
import logos from "../../assets/logos";
import i18n from "../../i18n";
import { UserContext } from "../UserContext";
import { useFetchObservationCount } from "./hooks/inatHooks";
import icons from "../../assets/icons";

const ProfileImageAndLogin = ( ): React.Node => {
  const { userProfile, login } = React.useContext( UserContext );
  const { name } = useRoute( );
  const count = useFetchObservationCount( login, name, userProfile.login );

  const username = "@" + userProfile.login;

  return (
    <View style={[viewStyles.row, viewStyles.center]}>
      <View>
        <Image
          source={userProfile.icon
            ? { uri: userProfile.icon }
            : icons.noProfilePhoto}
          style={imageStyles.profileIcon}
        />
        {userProfile.icon && <Image source={logos.iNatBadge} style={imageStyles.iNatBadge} />}
      </View>
      <View style={viewStyles.linearGradientTextContainer}>
        <Text style={[textStyles.lightText, name !== "Home" && textStyles.whiteText]}>
          {name === "Home"
            ? i18n.t( "about_inat.you_are_logged_in" )
            : i18n.t( "about_inat.logged_in_as" )
          }
        </Text>
        <Text style={[textStyles.loginNameText, name !== "Home" && textStyles.whiteText]}>
          {name === "Home"
            ? i18n.t( "about_inat.welcome_back", { username } )
            : username}
        </Text>
        {( name !== "Home" && count !== null ) && (
          <Text style={[textStyles.text, name !== "Home" && textStyles.whiteText]}>
            {i18n.t( "about_inat.x_observations_posted_to_inat", { count } )}
          </Text>
        )}
      </View>
    </View>
  );
};

export default ProfileImageAndLogin;
