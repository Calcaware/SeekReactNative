// @flow

import React, { Component } from "react";
import {
  View,
  Image,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform
} from "react-native";
import { NavigationEvents } from "react-navigation";
import Realm from "realm";
import LinearGradient from "react-native-linear-gradient";
import Modal from "react-native-modal";

import i18n from "../../i18n";
import badgeImages from "../../assets/badges";
import taxonIds from "../../utility/taxonDict";
import realmConfig from "../../models";
import styles from "../../styles/badges/badges";
import Footer from "../Home/Footer";
import Padding from "../Padding";
import BannerHeader from "./BannerHeader";
import LevelModal from "./LevelModal";
import BadgeModal from "./BadgeModal";
import ChallengeModal from "./ChallengeModal";
import ChallengeUnearnedModal from "./ChallengeUnearnedModal";
import GreenHeader from "../GreenHeader";

type Props = {
  navigation: any
}

class BadgesScreen extends Component<Props> {
  constructor() {
    super();

    this.state = {
      speciesBadges: [],
      challengeBadges: [],
      level: null,
      nextLevelCount: null,
      badgesEarned: null,
      speciesCount: null,
      showLevelModal: false,
      showBadgeModal: false,
      showChallengeModal: false,
      iconicTaxonBadges: [],
      iconicSpeciesCount: null,
      selectedChallenge: null
    };

    this.toggleLevelModal = this.toggleLevelModal.bind( this );
    this.toggleBadgeModal = this.toggleBadgeModal.bind( this );
    this.toggleChallengeModal = this.toggleChallengeModal.bind( this );
  }

  setChallenge( challenge ) {
    this.setState( { selectedChallenge: challenge } );
  }

  fetchBadges() {
    Realm.open( realmConfig )
      .then( ( realm ) => {
        const badges = realm.objects( "BadgeRealm" );
        const badgesEarned = badges.filtered( "iconicTaxonName != null AND earned == true" ).length;

        const taxaIds = Object.keys( taxonIds ).map( id => taxonIds[id] );

        const speciesBadges = [];

        taxaIds.forEach( ( id ) => {
          const tempBadges = badges.filtered( `iconicTaxonName != null AND iconicTaxonId == ${id}` );
          const sorted = tempBadges.sorted( "earnedDate", true );
          speciesBadges.push( sorted[0] );
        } );

        const allLevels = badges.filtered( "iconicTaxonName == null" );
        const levelsEarned = badges.filtered( "iconicTaxonName == null AND earned == true" ).sorted( "count", true );
        const nextLevel = badges.filtered( "iconicTaxonName == null AND earned == false" );
        console.log( nextLevel, "next" );

        speciesBadges.sort( ( a, b ) => {
          if ( a.index < b.index ) {
            return -1;
          }
          return 1;
        } );

        speciesBadges.sort( ( a, b ) => {
          if ( a.earned > b.earned ) {
            return -1;
          }
          return 1;
        } );

        this.setState( {
          speciesBadges,
          level: levelsEarned.length > 0 ? levelsEarned[0] : allLevels[0],
          nextLevelCount: nextLevel[0] ? nextLevel[0].count : 0,
          badgesEarned
        } );
      } ).catch( () => {
        // Alert.alert( "[DEBUG] Failed to open realm, error: ", err );
      } );
  }

  fetchBadgesByIconicId( taxaId ) {
    Realm.open( realmConfig )
      .then( ( realm ) => {
        const badges = realm.objects( "BadgeRealm" ).filtered( `iconicTaxonId == ${taxaId}` );
        const collectedTaxa = realm.objects( "TaxonRealm" );
        const collection = collectedTaxa.filtered( `iconicTaxonId == ${taxaId}` ).length;

        this.setState( {
          iconicTaxonBadges: badges,
          iconicSpeciesCount: collection
        }, () => this.toggleBadgeModal() );
      } ).catch( () => {
        // console.log( "[DEBUG] Failed to open realm, error: ", err );
      } );
  }

  fetchSpeciesCount() {
    Realm.open( realmConfig )
      .then( ( realm ) => {
        const speciesCount = realm.objects( "ObservationRealm" ).length;
        this.setState( { speciesCount } );
      } ).catch( () => {
        // console.log( "[DEBUG] Failed to open realm, error: ", err );
      } );
  }

  fetchChallenges() {
    Realm.open( realmConfig )
      .then( ( realm ) => {
        const challenges = realm.objects( "ChallengeRealm" );
        this.setState( { challengeBadges: challenges } );
      } ).catch( () => {
        // console.log( "[DEBUG] Failed to open realm, error: ", err );
      } );
  }

  toggleLevelModal() {
    const { showLevelModal } = this.state;
    this.setState( { showLevelModal: !showLevelModal } );
  }

  toggleBadgeModal() {
    const { showBadgeModal } = this.state;
    this.setState( { showBadgeModal: !showBadgeModal } );
  }

  toggleChallengeModal() {
    const { showChallengeModal } = this.state;
    this.setState( { showChallengeModal: !showChallengeModal } );
  }

  renderBadgesRow( data ) {
    return (
      <FlatList
        data={data}
        contentContainerStyle={styles.badgesContainer}
        keyExtractor={badge => badge.name}
        numColumns={3}
        renderItem={( { item } ) => {
          let badgeIcon;
          if ( item.earned ) {
            badgeIcon = badgeImages[item.earnedIconName];
          } else {
            badgeIcon = badgeImages[item.unearnedIconName];
          }
          return (
            <TouchableOpacity
              style={styles.gridCell}
              onPress={() => this.fetchBadgesByIconicId( item.iconicTaxonId )}
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
    const {
      speciesBadges,
      challengeBadges,
      level,
      nextLevelCount,
      badgesEarned,
      speciesCount,
      showLevelModal,
      showBadgeModal,
      showChallengeModal,
      iconicTaxonBadges,
      iconicSpeciesCount,
      selectedChallenge
    } = this.state;
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeViewTop} />
        <SafeAreaView style={styles.safeView}>
          <NavigationEvents
            onWillFocus={() => {
              this.fetchBadges();
              this.fetchChallenges();
              this.fetchSpeciesCount();
            }}
          />
          <Modal
            isVisible={showLevelModal}
            onSwipe={() => this.toggleLevelModal()}
            onBackdropPress={() => this.toggleLevelModal()}
            swipeDirection="down"
          >
            <LevelModal
              level={level}
              toggleLevelModal={this.toggleLevelModal}
            />
          </Modal>
          <Modal
            style={{
              justifyContent: "center",
              alignItems: "center",
              paddingTop: 20,
              paddingBottom: 70
            }}
            isVisible={showBadgeModal}
            // onSwipe={() => this.toggleBadgeModal()}
            onBackdropPress={() => this.toggleBadgeModal()}
            // swipeDirection="down"
          >
            <BadgeModal
              badges={iconicTaxonBadges}
              iconicSpeciesCount={iconicSpeciesCount}
              toggleBadgeModal={this.toggleBadgeModal}
            />
          </Modal>
          <Modal
            isVisible={showChallengeModal}
            onSwipe={() => this.toggleChallengeModal()}
            onBackdropPress={() => this.toggleChallengeModal()}
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
                toggleChallengeModal={this.toggleChallengeModal}
              />
            )
            }
          </Modal>
          <GreenHeader header={i18n.t( "badges.achievements" )} navigation={navigation} />
          <ScrollView>
            {Platform.OS === "ios" && <View style={styles.iosSpacer} />}
            <LinearGradient
              colors={["#22784d", "#38976d"]}
              style={styles.header}
            >
              {level ? (
                <View style={styles.row}>
                  <TouchableOpacity
                    onPress={() => this.toggleLevelModal()}
                  >
                    <Image source={badgeImages[level.earnedIconName]} style={styles.levelImage} />
                  </TouchableOpacity>
                  <View style={styles.textContainer}>
                    <Text style={styles.lightText}>{i18n.t( "badges.your_level" ).toLocaleUpperCase()}</Text>
                    <Text style={styles.headerText}>{i18n.t( level.name ).toLocaleUpperCase()}</Text>
                    <Text style={styles.text}>{i18n.t( "badges.observe", { number: nextLevelCount } )}</Text>
                  </View>
                </View>
              ) : null}
            </LinearGradient>
            <View style={styles.secondTextContainer}>
              <BannerHeader text={i18n.t( "badges.species_badges" ).toLocaleUpperCase()} />
            </View>
            {this.renderBadgesRow( speciesBadges.slice( 0, 3 ) )}
            {this.renderBadgesRow( speciesBadges.slice( 3, 5 ) )}
            {this.renderBadgesRow( speciesBadges.slice( 5, 8 ) )}
            {this.renderBadgesRow( speciesBadges.slice( 8, 10 ) )}
            <View style={{ marginTop: 12 }} />
            <View style={styles.secondTextContainer}>
              <BannerHeader text={i18n.t( "badges.challenge_badges" ).toLocaleUpperCase()} />
              <FlatList
                data={challengeBadges}
                contentContainerStyle={styles.badgesContainer}
                keyExtractor={challenge => challenge.name}
                numColumns={3}
                renderItem={( { item } ) => {
                  let badgeIcon;
                  if ( item.percentComplete === 100 ) {
                    badgeIcon = badgeImages[item.earnedIconName];
                  } else {
                    badgeIcon = badgeImages[item.unearnedIconName];
                  }
                  return (
                    <TouchableOpacity
                      style={styles.gridCell}
                      onPress={() => {
                        // if ( item.percentComplete === 100 ) {
                        this.toggleChallengeModal();
                        this.setChallenge( item );
                        // }
                      }}
                    >
                      <Image
                        source={badgeIcon}
                        style={styles.badgeIcon}
                      />
                    </TouchableOpacity>
                  );
                }}
              />
              <View style={{ marginTop: 42 }} />
              <View style={styles.stats}>
                <View>
                  <Text style={styles.secondHeaderText}>{i18n.t( "badges.observed" ).toLocaleUpperCase()}</Text>
                  <Text style={styles.number}>{speciesCount}</Text>
                </View>
                <View>
                  <Text style={styles.secondHeaderText}>{i18n.t( "badges.earned" ).toLocaleUpperCase()}</Text>
                  <Text style={styles.number}>{badgesEarned}</Text>
                </View>
              </View>
              <View>
                <Text style={styles.darkText}>{i18n.t( "badges.explanation" )}</Text>
              </View>
            </View>
            <Padding />
          </ScrollView>
          <Footer navigation={navigation} />
        </SafeAreaView>
      </View>
    );
  }
}

export default BadgesScreen;
