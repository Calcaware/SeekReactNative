// @flow

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform
} from "react-native";
import Realm from "realm";
import { useNavigation } from "@react-navigation/native";

import taxonIds from "../../utility/dictionaries/taxonDict";
import realmConfig from "../../models";
import styles from "../../styles/badges/achievements";
import Padding from "../UIComponents/Padding";
import LevelHeader from "./LevelHeader";
import SpeciesBadges from "./SpeciesBadges";
import ChallengeBadges from "./ChallengeBadges";
import GreenHeader from "../UIComponents/GreenHeader";
import GreenText from "../UIComponents/GreenText";
import LoginCard from "../UIComponents/LoginCard";
import SafeAreaView from "../UIComponents/SafeAreaView";
import Spacer from "../UIComponents/iOSSpacer";
import { fetchNumberSpeciesSeen, localizeNumber } from "../../utility/helpers";
import { useScrollToTop } from "../../utility/customHooks";

const AchievementsScreen = () => {
  const navigation = useNavigation();
  const scrollView = useRef( null );
  const [speciesCount, setSpeciesCount] = useState( null );
  const [state, setState] = useState( {
    speciesBadges: [],
    level: null,
    nextLevelCount: null,
    badgesEarned: null
  } );

  useScrollToTop( scrollView, navigation );

  const fetchBadges = () => {
    Realm.open( realmConfig )
      .then( ( realm ) => {
        const badges = realm.objects( "BadgeRealm" );
        const badgesEarned = badges.filtered( "iconicTaxonName != null AND earned == true" ).length;

        const iconicTaxonIds = Object.keys( taxonIds ).map( id => taxonIds[id] );

        const speciesBadges = [];

        iconicTaxonIds.forEach( ( id ) => {
          const highestEarned = badges.filtered( `iconicTaxonName != null AND iconicTaxonId == ${id}` )
            .sorted( "earnedDate", true );
          speciesBadges.push( highestEarned[0] );
        } );

        const allLevels = badges.filtered( "iconicTaxonName == null" ).sorted( "index" );
        const levelsEarned = badges.filtered( "iconicTaxonName == null AND earned == true" ).sorted( "count", true );
        const nextLevel = badges.filtered( "iconicTaxonName == null AND earned == false" ).sorted( "index" );

        speciesBadges.sort( ( a, b ) => {
          if ( a.index < b.index && a.earned > b.earned ) {
            return -1;
          }
          return 1;
        } );

        setState( {
          speciesBadges,
          level: levelsEarned.length > 0 ? levelsEarned[0] : allLevels[0],
          nextLevelCount: nextLevel[0] ? nextLevel[0].count : 0,
          badgesEarned
        } );
      } ).catch( () => {
        // console.log( "[DEBUG] Failed to open realm, error: ", err );
      } );
  };

  const fetchSpeciesCount = () => {
    fetchNumberSpeciesSeen().then( ( species ) => {
      setSpeciesCount( species );
    } );
  };

  useEffect( () => {
    fetchBadges();
    fetchSpeciesCount();
  }, [] );

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <GreenHeader header="badges.achievements" />
      <ScrollView ref={scrollView}>
        {Platform.OS === "ios" && <Spacer backgroundColor="#22784d" />}
        {state.level && (
          <LevelHeader
            level={state.level}
            nextLevelCount={state.nextLevelCount}
            speciesCount={speciesCount}
          />
        )}
        <SpeciesBadges speciesBadges={state.speciesBadges} />
        <ChallengeBadges />
        <View style={[styles.row, styles.center]}>
          <TouchableOpacity
            onPress={() => navigation.navigate( "MyObservations" )}
            style={styles.secondHeaderText}
          >
            <GreenText center smaller text="badges.observed" />
            <Text style={styles.number}>{localizeNumber( speciesCount )}</Text>
          </TouchableOpacity>
          <View style={styles.secondHeaderText}>
            <GreenText center smaller text="badges.earned" />
            <Text style={styles.number}>{localizeNumber( state.badgesEarned )}</Text>
          </View>
        </View>
        <View style={styles.center}>
          <LoginCard screen="achievements" />
        </View>
        <Padding />
      </ScrollView>
    </View>
  );
};

export default AchievementsScreen;
