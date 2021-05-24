// @flow

import * as React from "react";
import {
  View,
  Text,
  Image,
  ImageBackground
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import i18n from "../../i18n";
import styles from "../../styles/modals/challengeUnearnedModal";
import BannerHeader from "../UIComponents/BannerHeader";
import badgeImages from "../../assets/badges";
import { checkIfChallengeAvailable, formatMonthYear, formatMonth } from "../../utility/dateHelpers";
import { setChallengeIndex } from "../../utility/challengeHelpers";
import GreenButton from "../UIComponents/Buttons/GreenButton";
import GreenText from "../UIComponents/GreenText";
import PercentCircle from "../UIComponents/PercentCircle";
import WhiteModal from "../UIComponents/Modals/WhiteModal";

type Props = {
  +closeModal: ( ) => void,
  +challenge: {
    index: number,
    percentComplete: number,
    startedDate: Date,
    availableDate: Date
  }
};

const ChallengeUnearnedModal = ( { closeModal, challenge }: Props ): React.Node => {
  const navigation = useNavigation();

  const navToChallengeDetails = ( ) => {
    setChallengeIndex( challenge.index );
    navigation.navigate( "ChallengeDetails" );
    closeModal();
  };

  return (
    <WhiteModal closeModal={closeModal}>
      <View style={styles.center}>
        <BannerHeader
          modal
          text={i18n.t( "seek_challenges.badge" ).toLocaleUpperCase()}
        />
        {challenge.startedDate && challenge.percentComplete !== 100 ? (
          <ImageBackground
            imageStyle={styles.imageStyle}
            source={badgeImages.badge_empty}
            style={[styles.image, styles.center]}
          >
            <PercentCircle challenge={challenge} large />
          </ImageBackground>
        ) : (
          <Image
            source={badgeImages.badge_empty}
            style={[styles.image, styles.imageStyle]}
          />
        )}
      </View>
      <View style={styles.margins}>
        <GreenText
          center
          text="badges.to_earn"
          allowFontScaling={false}
        />
      </View>
      <Text allowFontScaling={false} style={styles.nameText}>
        {i18n.t( "challenges.how_to", { month: formatMonth( challenge.availableDate ) } )}
      </Text>
      {checkIfChallengeAvailable( challenge.availableDate ) ? (
        <View style={styles.container}>
          <GreenButton
            handlePress={navToChallengeDetails}
            text="notifications.view_challenges"
            allowFontScaling={false}
          />
        </View>
      ) : (
        <Text allowFontScaling={false} style={[styles.italicText, styles.centerSelf]}>
          {i18n.t( "challenges.released", { date: formatMonthYear( challenge.availableDate ) } )}
        </Text>
      )}
    </WhiteModal>
  );
};

export default ChallengeUnearnedModal;
