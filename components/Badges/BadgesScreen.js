// @flow

import React, { Component } from "react";
import {
  View,
  Alert,
  Image,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { NavigationEvents } from "react-navigation";
import Realm from "realm";
import LinearGradient from "react-native-linear-gradient";

import i18n from "../../i18n";
import badgeImages from "../../assets/badges";
import realmConfig from "../../models";
import styles from "../../styles/badges/badges";
import Footer from "../Home/Footer";
import Padding from "../Padding";

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
      speciesCount: null
    };
  }

  // componentDidMount() {
  //   this.fetchBadges();
  // }

  fetchBadges() {
    Realm.open( realmConfig )
      .then( ( realm ) => {
        const badges = realm.objects( "BadgeRealm" ).sorted( "index" );
        const badgesEarned = badges.filtered( "earned == true" ).length;
        const speciesBadges = badges.filtered( "iconicTaxonName != null" );
        const levelsEarned = badges.filtered( "iconicTaxonName == null AND earned == true" );
        const lastLevelEarned = levelsEarned.sorted( "count", true );
        const nextLevel = badges.filtered( "iconicTaxonName == null AND earned == false" );
        const nextLevelCount = nextLevel.sorted( "count" );
        this.setState( {
          speciesBadges,
          level: lastLevelEarned[0],
          nextLevelCount: nextLevelCount[0].count,
          badgesEarned
        } );
      } ).catch( ( err ) => {
        // console.log( "[DEBUG] Failed to open realm, error: ", err );
      } );
  }

  fetchSpeciesCount() {
    Realm.open( realmConfig )
      .then( ( realm ) => {
        const speciesCount = realm.objects( "ObservationRealm" ).length;
        this.setState( { speciesCount } );
      } ).catch( ( err ) => {
        // console.log( "[DEBUG] Failed to open realm, error: ", err );
      } );
  }

  render() {
    const {
      speciesBadges,
      level,
      nextLevelCount,
      badgesEarned,
      speciesCount
    } = this.state;
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        <NavigationEvents
          onWillFocus={() => {
            this.fetchBadges();
            this.fetchSpeciesCount();
          }}
        />
        <ScrollView>
          <LinearGradient
            colors={["#22784d", "#38976d"]}
            style={styles.header}
          >
            {level ? (
              <View style={styles.row}>
                <Image source={badgeImages[level.earnedIconName]} />
                <View style={styles.textContainer}>
                  <Text style={styles.headerText}>{level.name}</Text>
                  <Text style={styles.text}>{i18n.t( "badges.observe", { number: nextLevelCount } )}</Text>
                </View>
              </View>
            ) : null}
          </LinearGradient>
          <View style={styles.secondTextContainer}>
            <Text style={styles.bannerText}>{i18n.t( "badges.species_badges" ).toLocaleUpperCase()}</Text>
          </View>
          <FlatList
            data={speciesBadges}
            style={styles.badgesContainer}
            keyExtractor={badge => badge.name}
            numColumns={3}
            renderItem={( { item } ) => {
              let badgeIcon;
              let msg = item.infoText;
              if ( item.earned ) {
                msg = `${msg} You earned this badge.`;
                badgeIcon = badgeImages[item.earnedIconName];
              } else {
                badgeIcon = badgeImages[item.unearnedIconName];
              }
              return (
                <TouchableOpacity
                  style={styles.gridCell}
                  onPress={() => Alert.alert(
                    item.name,
                    msg,
                    [
                      {
                        text: "Got it!"
                      }
                    ],
                    { cancelable: false }
                  )}
                >
                  <View style={styles.gridCellContents}>
                    <Image
                      source={badgeIcon}
                      style={styles.badgeIcon}
                    />
                  </View>
                </TouchableOpacity>
              );
            }
            }
          />
          <View style={styles.secondTextContainer}>
            <Text style={styles.bannerText}>{i18n.t( "badges.challenge_badges" ).toLocaleUpperCase()}</Text>
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
          </View>
          <Padding />
        </ScrollView>
        <Footer navigation={navigation} />
      </View>
    );
  }
}

export default BadgesScreen;
