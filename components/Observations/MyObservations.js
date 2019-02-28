// @flow

import React, { Component } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView
} from "react-native";
import { NavigationEvents } from "react-navigation";
import Realm from "realm";

import i18n from "../../i18n";
import realmConfig from "../../models";
import styles from "../../styles/menu/observations";
import ObservationList from "./ObservationList";
import Padding from "../Padding";
import Footer from "../Home/Footer";
import taxaIds from "../../utility/iconicTaxonDictById";
import LoadingWheel from "../LoadingWheel";

type Props = {
  navigation: any
}

class MyObservations extends Component<Props> {
  constructor() {
    super();

    this.state = {
      observations: [],
      loading: true
    };
  }

  fetchObservations() {
    Realm.open( realmConfig )
      .then( ( realm ) => {
        const observations = [];
        
        const species = realm.objects( "ObservationRealm" );
        const taxaIdList = Object.keys( taxaIds );

        taxaIdList.forEach( ( id ) => {
          const speciesSeen = realm.objects( "ObservationRealm" ).filtered( `taxon.iconicTaxonId == ${id}` );

          observations.push( {
            id,
            speciesSeen
          } );
        } );

        observations.sort( ( a, b ) => {
          if ( a.speciesSeen.length > b.speciesSeen.length ) {
            return -1;
          }
          return 1;
        } );

        this.setState( {
          observations: species.length > 0 ? observations : species,
          loading: false
        } );
      } )
      .catch( () => {
        // console.log( "Err: ", err )
      } );
  }

  render() {
    const { observations, loading } = this.state;
    const { navigation } = this.props;

    const iconicTaxonList = [];

    observations.forEach( ( iconicTaxon ) => {
      const list = <ObservationList observations={iconicTaxon.speciesSeen} id={iconicTaxon.id} navigation={navigation} />;

      iconicTaxonList.push( list );
    } );

    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeViewTop} />
        <SafeAreaView style={styles.safeView}>
          <NavigationEvents onDidFocus={() => this.fetchObservations()} />
          <View style={styles.header}>
            <Text style={styles.headerText}>
              {i18n.t( "observations.header" ).toLocaleUpperCase()}
            </Text>
          </View>
          {loading ? (
            <View style={styles.loadingWheel}>
              <LoadingWheel color="black" />
            </View>
          ) : (
            <ScrollView>
              {observations.length > 0 ? iconicTaxonList : (
                <View style={styles.textContainer}>
                  <Text style={styles.noSpeciesHeaderText}>{i18n.t( "observations.no_obs" ).toLocaleUpperCase()}</Text>
                  <Text style={styles.noSpeciesText}>{i18n.t( "observations.help" )}</Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate( "Camera" )}
                    style={styles.greenButton}
                  >
                    <Text style={styles.buttonText}>{i18n.t( "observations.open_camera" ).toLocaleUpperCase()}</Text>
                  </TouchableOpacity>
                </View>
              )}
              <Padding />
            </ScrollView>
          )}
          <Footer navigation={navigation} />
        </SafeAreaView>
      </View>
    );
  }
}

export default MyObservations;
