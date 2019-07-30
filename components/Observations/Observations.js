// @flow

import React, { Component } from "react";
import {
  View,
  SafeAreaView,
  Platform,
  SectionList,
  Text,
  Image
} from "react-native";
import { NavigationEvents } from "react-navigation";
import Realm from "realm";

import i18n from "../../i18n";
import realmConfig from "../../models";
import styles from "../../styles/observations";
import badges from "../../assets/badges";
import Padding from "../Padding";
import taxaIds from "../../utility/iconicTaxonDictById";
import LoadingWheel from "../LoadingWheel";
import GreenHeader from "../GreenHeader";
import NoObservations from "./NoObservations";
import ObservationCard from "./ObsCard";
import { sortNewestToOldest } from "../../utility/helpers";

type Props = {
  navigation: any
}

class Observations extends Component<Props> {
  constructor() {
    super();

    this.state = {
      observations: [],
      loading: true
    };
  }

  resetObservations() {
    this.setState( {
      observations: [],
      loading: true
    } );
  }

  scrollToTop() {
    if ( this.scrollView ) {
      this.scrollView.scrollToLocation( {
        sectionIndex: 0,
        itemIndex: 0,
        viewOffset: 70,
        animated: Platform.OS === "android"
      } );
    }
  }

  createSectionList( realm ) {
    const observations = [];
    const species = realm.objects( "ObservationRealm" );
    const badges = realm.objects( "BadgeRealm" );

    const taxaIdList = Object.keys( taxaIds );

    taxaIdList.forEach( ( id ) => {
      const data = species
        .filtered( `taxon.iconicTaxonId == ${id}` )
        .sorted( "date", true );

      const badgeCount = badges
        .filtered( `iconicTaxonId == ${id} AND earned == true` ).length;

      console.log( badgeCount, "badge count" );

      observations.push( {
        id,
        data: data.length > 0 ? data : [],
        badgeCount
      } );
    } );

    sortNewestToOldest( observations );

    return species.length > 0 ? observations : [];
  }

  fetchObservations() {
    Realm.open( realmConfig )
      .then( ( realm ) => {
        const observations = this.createSectionList( realm );

        this.setState( {
          observations,
          loading: false
        } );
      } )
      .catch( () => {
        // console.log( "Err: ", err )
      } );
  }

  renderEmptySection( id, data ) {
    if ( data.length === 0 ) {
      return (
        <View style={styles.textContainer}>
          <Text style={styles.text}>
            {i18n.t( "observations.not_seen", { iconicTaxon: i18n.t( taxaIds[id] ) } )}
          </Text>
        </View>
      );
    }
  }

  render() {
    const { observations, loading } = this.state;
    const { navigation } = this.props;

    let content;

    if ( loading ) {
      content = (
        <View style={styles.loadingWheel}>
          <LoadingWheel color="black" />
        </View>
      );
    } else if ( observations.length > 0 ) {
      content = (
        <View>
          <SectionList
            ref={( ref ) => { this.scrollView = ref; }}
            style={styles.secondTextContainer}
            renderItem={( { item } ) => (
              <ObservationCard
                navigation={navigation}
                item={item}
              />
            )}
            renderSectionHeader={( { section: { id, data, badgeCount } } ) => {
              let badge;

              if ( badgeCount === 0 ) {
                badge = badges.badge_empty_small;
              } else if ( badgeCount === 1 ) {
                badge = badges.badge_bronze;
              } else if ( badgeCount === 2 ) {
                badge = badges.badge_silver;
              } else if ( badgeCount === 3 ) {
                badge = badges.badge_gold;
              }

              return (
                <View style={styles.headerRow}>
                  <Text style={styles.secondHeaderText}>
                    {i18n.t( taxaIds[id] ).toLocaleUpperCase()}
                  </Text>
                  <View style={styles.row}>
                    <Text style={styles.numberText}>
                      {data.length}
                    </Text>
                    <Image source={badge} style={styles.badgeImage} />
                  </View>
                </View>
              );
            }}
            sections={observations}
            initialNumToRender={5}
            stickySectionHeadersEnabled={false}
            keyExtractor={( item, index ) => item + index}
            renderSectionFooter={( { section: { id, data } } ) => this.renderEmptySection( id, data )}
          />
          <Padding />
        </View>
      );
    } else {
      content = <NoObservations navigation={navigation} />;
    }

    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeViewTop} />
        <SafeAreaView style={styles.safeView}>
          <NavigationEvents
            onDidFocus={() => {
              this.scrollToTop();
              this.fetchObservations();
            }}
            onWillBlur={() => this.resetObservations()}
          />
          <GreenHeader
            header={i18n.t( "observations.header" )}
            navigation={navigation}
          />
          {content}
        </SafeAreaView>
      </View>
    );
  }
}

export default Observations;
