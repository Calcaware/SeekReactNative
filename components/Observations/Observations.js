// @flow

import React, {
  useState,
  useEffect,
  useCallback
} from "react";
import { View, BackHandler } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Realm from "realm";
import Modal from "react-native-modal";
import { useSafeArea } from "react-native-safe-area-context";

import { getRoute, getTaxonCommonName } from "../../utility/helpers";
import realmConfig from "../../models";
import styles from "../../styles/observations/observations";
import { createSectionList, removeFromCollection } from "../../utility/observationHelpers";
import DeleteModal from "../Modals/DeleteModal";
import LoadingWheel from "../UIComponents/LoadingWheel";
import { colors } from "../../styles/global";
import GreenHeader from "../UIComponents/GreenHeader";
import ObsList from "./ObsList";

const Observations = () => {
  const insets = useSafeArea();
  const navigation = useNavigation();
  const [observations, setObservations] = useState( [] );
  const [showModal, setModal] = useState( false );
  const [itemToDelete, setItemToDelete] = useState( null );
  const [loading, setLoading] = useState( true );
  const [searchText, setSearchText] = useState( "" );

  useFocusEffect(
    useCallback( () => {
      const onBackPress = () => {
        navigation.navigate( "Home" );
        return true; // following custom Android back behavior template in React Navigation
      };

      BackHandler.addEventListener( "hardwareBackPress", onBackPress );

      return () => BackHandler.removeEventListener( "hardwareBackPress", onBackPress );
    }, [navigation] )
  );

  const openModal = useCallback( ( photo, taxon ) => {
    const { id, preferredCommonName, name, iconicTaxonId } = taxon;
    setItemToDelete( {
      id,
      photo,
      preferredCommonName,
      name,
      iconicTaxonId
    } );
    setModal( true );
  }, [] );

  const closeModal = () => setModal( false );

  const setupObsList = ( realm, species ) => {
    const obs = createSectionList( realm, species );
    setObservations( obs );
    setLoading( false );
  };

  const fetchCommonNames = ( realm, species ) => {
    const commonNames = [];

    species.forEach( ( { taxon } ) => {
      if ( !taxon ) {
        return;
      }
      const { id } = taxon;
      commonNames.push(
        getTaxonCommonName( id ).then( ( taxonName ) => {
          realm.write( () => {
            taxon.preferredCommonName = taxonName;
          } );
        } )
      );
    } );

    // wait until all commonNames are fetched before setting up obsList
    Promise.all( commonNames ).then( ( result ) => {
      setupObsList( realm, species );
    } );
  };

  const fetchObservations = () => {
    Realm.open( realmConfig ).then( ( realm ) => {
      const species = realm.objects( "ObservationRealm" );

      if ( species.length === 0 ) {
        setLoading( false );
      } else {
        fetchCommonNames( realm, species );
      }
    } ).catch( () => {
      // console.log( "Err: ", err )
    } );
  };

  const fetchFilteredObservations = useCallback( ( text ) => {
    setSearchText( text );

    if ( text.length > 2 ) {
      Realm.open( realmConfig ).then( ( realm ) => {
        const species = realm.objects( "ObservationRealm" ).filtered( `taxon.name CONTAINS[c] '${text}' OR taxon.preferredCommonName CONTAINS[c] '${text}'` );
        setupObsList( realm, species );
      } ).catch( () => {
        // console.log( "Err: ", err )
      } );
    } else {
      Realm.open( realmConfig ).then( ( realm ) => {
        const species = realm.objects( "ObservationRealm" );
        setupObsList( realm, species );
      } ).catch( () => {
          // console.log( "Err: ", err )
      } );
    }
  }, [] );

  const fetchRoute = async () => {
    const routeName = await getRoute();
    // don't fetch if user is toggling back and forth from SpeciesDetail screens
    if ( routeName !== "Observations" ) {
      setSearchText( "" );
      setLoading( true );
      fetchObservations();
    }
  };

  useEffect( () => {
    const unsub = navigation.addListener( "focus", () => {
      fetchRoute();
    } );

    return unsub;
  } );

  const deleteObservation = async ( id ) => {
    await removeFromCollection( id );
    setObservations( [] );
    fetchObservations();
  };

  const updateObs = useCallback( ( obs ) => setObservations( obs ), [] );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <GreenHeader header="observations.header" route="Home" />
      <Modal isVisible={showModal}>
        <DeleteModal
          deleteObservation={deleteObservation}
          itemToDelete={itemToDelete}
          closeModal={closeModal}
        />
      </Modal>
      <View style={styles.whiteContainer}>
        {loading ? (
          <View style={[styles.center, styles.flexGrow]}>
            <LoadingWheel color={colors.darkGray} />
          </View>
        ) : (
          <ObsList
            fetchFilteredObservations={fetchFilteredObservations}
            observations={observations}
            searchText={searchText}
            openModal={openModal}
            updateObs={updateObs}
          />
        )}
      </View>
    </View>
  );
};

export default Observations;
