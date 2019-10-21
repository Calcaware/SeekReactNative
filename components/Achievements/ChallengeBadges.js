// @flow

import React, { Component } from "react";
import {
  View,
  Image,
  FlatList,
  TouchableOpacity
} from "react-native";
import Modal from "react-native-modal";

import i18n from "../../i18n";
import ChallengeModal from "../AchievementModals/ChallengeEarnedModal";
import ChallengeUnearnedModal from "../AchievementModals/ChallengeUnearnedModal";
import BannerHeader from "./BannerHeader";
import badgeImages from "../../assets/badges";
import styles from "../../styles/badges/badges";

type Props = {
  +challengeBadges: Array<Object>,
  +navigation: any
}

class ChallengeBadges extends Component<Props> {
  constructor() {
    super();

    this.state = {
      showChallengeModal: false,
      selectedChallenge: null
    };

    this.toggleChallengeModal = this.toggleChallengeModal.bind( this );
  }

  setChallenge( selectedChallenge ) {
    this.setState( { selectedChallenge } );
  }

  toggleChallengeModal() {
    const { showChallengeModal } = this.state;
    this.setState( { showChallengeModal: !showChallengeModal } );
  }

  renderChallengesRow( challengeBadges ) {
    return (
      <FlatList
        data={challengeBadges}
        horizontal
        keyExtractor={( challenge, index ) => `${challenge.name}${index}`}
        renderItem={( { item } ) => {
          let badgeIcon;
          if ( item.percentComplete === 100 ) {
            badgeIcon = badgeImages[item.earnedIconName];
          } else {
            badgeIcon = badgeImages[item.unearnedIconName];
          }
          return (
            <TouchableOpacity
              onPress={() => {
                this.toggleChallengeModal();
                this.setChallenge( item );
              }}
              style={styles.gridCell}
            >
              <Image
                source={badgeIcon}
                style={styles.badgeIcon}
              />
            </TouchableOpacity>
          );
        }}
      />
    );
  }

  render() {
    const { challengeBadges, navigation } = this.props;
    const { showChallengeModal, selectedChallenge } = this.state;

    return (
      <View style={styles.center}>
        <Modal
          isVisible={showChallengeModal}
          onBackdropPress={() => this.toggleChallengeModal()}
          onSwipeComplete={() => this.toggleChallengeModal()}
          swipeDirection="down"
        >
          {selectedChallenge && selectedChallenge.percentComplete === 100 ? (
            <ChallengeModal
              challenge={selectedChallenge}
              toggleChallengeModal={this.toggleChallengeModal}
            />
          ) : (
            <ChallengeUnearnedModal
              challenge={selectedChallenge}
              navigation={navigation}
              toggleChallengeModal={this.toggleChallengeModal}
            />
          )}
        </Modal>
        <BannerHeader text={i18n.t( "badges.challenge_badges" ).toLocaleUpperCase()} />
        {this.renderChallengesRow( challengeBadges.slice( 0, 3 ) )}
        {this.renderChallengesRow( challengeBadges.slice( 3, 5 ) )}
        {this.renderChallengesRow( challengeBadges.slice( 5, 8 ) )}
        <View style={{ marginTop: 42 }} />
      </View>
    );
  }
}

export default ChallengeBadges;