// @flow

import React, { useState, useRef, useMemo } from "react";
import { View, SectionList, Text, Keyboard } from "react-native";
import i18n from "../../i18n";
import styles from "../../styles/observations/observations";
import taxaIds from "../../utility/dictionaries/iconicTaxonDictById";
import EmptyState from "../UIComponents/EmptyState";
import ObservationCard from "./ObsCard";
import SectionHeader from "./SectionHeader";
import SearchBar from "./SearchBar";
import SearchEmpty from "./SearchEmpty";

type Props = {
  fetchFilteredObservations: Function,
  observations: Array<Object>,
  searchText: string,
  openModal: Function,
  updateObs: Function,
  clearText: Function
}

const ObsList = ( {
  fetchFilteredObservations,
  observations,
  searchText,
  openModal,
  updateObs,
  clearText
}: Props ) => {
  const sectionList = useRef( null );
  const [hiddenSections, setHiddenSections] = useState( [] ); // eslint-disable-line no-unused-vars
  const [itemScrolledId, setItemScrolledId] = useState( null );

  const updateItemScrolledId = ( id ) => setItemScrolledId( id );

  const toggleSection = ( id ) => {
    const updatedObs = observations.slice(); // this is needed to force a refresh of SectionList
    const idToHide = hiddenSections.indexOf( id );

    if ( idToHide !== -1 ) {
      hiddenSections.splice( idToHide, 1 );
    } else {
      hiddenSections.push( id );
    }

    updateObs( updatedObs );
  };

  const sectionIsHidden = ( id ) => hiddenSections.includes( id );

  const renderItem = ( { item, section, index } ) => {
    if ( sectionIsHidden( section.id ) ) {
      return null;
    }
    return (
      <>
        <ObservationCard
          item={item}
          itemScrolledId={itemScrolledId}
          openModal={openModal}
          updateItemScrolledId={updateItemScrolledId}
        />
       {index === section.data.length - 1 && <View style={styles.bottomOfSectionPadding} />}
      </>
    );
  };

  const renderSectionFooter = ( { section } ) => {
    const { id, data } = section;
    if ( sectionIsHidden( id ) && data.length === 0 ) {
      return <View style={styles.hiddenSectionSeparator} />;
    }

    if ( data.length === 0 ) {
      return (
        <Text style={[styles.text, styles.emptyText]}>
          {i18n.t( "observations.not_seen", { iconicTaxon: i18n.t( taxaIds[id] ) } )}
        </Text>
      );
    }

    return null;
  };

  const renderSectionSeparator = () => <View style={styles.sectionWithDataSeparator} />;

  const renderItemSeparator = ( { section } ) => {
    if ( !sectionIsHidden( section.id ) ) {
      return <View style={styles.itemSeparator} />;
    }
    return null;
  };

  const renderSectionHeader = ( { section } ) => (
    <SectionHeader
      section={section}
      open={!sectionIsHidden( section.id )}
      toggleSection={toggleSection}
    />
  );

  const renderListFooter = () => <View style={styles.padding} />;

  const renderListEmpty = () => {
    if ( searchText.length > 0 ) {
      return <SearchEmpty clearText={clearText} />;
    } else {
      return <EmptyState />;
    }
  };

  const renderHeader = useMemo( () => (
    <SearchBar
      fetchFilteredObservations={fetchFilteredObservations}
      searchText={searchText}
      clearText={clearText}
    />
  ), [fetchFilteredObservations, searchText, clearText] );

  const dismissKeyboard = ( ) => Keyboard.dismiss( );

  const extractKey = ( item, index ) => item + index;

  return (
    <SectionList
      ref={sectionList}
      keyboardDismissMode="on-drag"
      onScroll={dismissKeyboard}
      scrollEventThrottle={1}
      contentContainerStyle={styles.flexGrow}
      sections={observations}
      initialNumToRender={5}
      stickySectionHeadersEnabled={false}
      keyExtractor={extractKey}
      ListHeaderComponent={renderHeader}
      renderSectionHeader={renderSectionHeader}
      renderItem={renderItem}
      ItemSeparatorComponent={renderItemSeparator}
      renderSectionFooter={renderSectionFooter}
      SectionSeparatorComponent={renderSectionSeparator}
      ListFooterComponent={renderListFooter}
      ListEmptyComponent={renderListEmpty}
    />
  );
};

export default ObsList;
