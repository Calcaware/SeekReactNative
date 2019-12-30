import React from "react";
import {
  View,
  Text,
  Image,
  StatusBar
} from "react-native";

import i18n from "../../i18n";
import styles from "../../styles/posting/postStatus";
import LoadingWheel from "../UIComponents/LoadingWheel";
import { colors } from "../../styles/global";
import posting from "../../assets/posting";
import GreenButton from "../UIComponents/GreenButton";
import SafeAreaView from "../UIComponents/SafeAreaView";
import GreenText from "../UIComponents/GreenText";

type Props = {
  +loading: boolean,
  +postingSuccess: boolean,
  +togglePostModal: Function,
  +navigation: any,
  +status: string,
  +errorText: string
};

const PostStatus = ( {
  loading,
  postingSuccess,
  togglePostModal,
  navigation,
  status,
  errorText
}: Props ) => {
  let headerText;
  let image;
  let extraText;

  if ( loading ) {
    headerText = "posting.posting";
    image = <LoadingWheel color={colors.seekiNatGreen} />;
    extraText = i18n.t( "posting.wait" );
  } else if ( !loading && postingSuccess ) {
    headerText = "posting.posting_success";
    image = <Image source={posting.bird} />;
  } else if ( status === "duringPhotoUpload" ) {
    headerText = "posting.posting_failure";
    image = <Image source={posting.uploadfail} />;
    extraText = `${i18n.t( "posting.error_photo_upload" )} ${errorText}`;
  } else if ( status === "beforePhotoAdded" ) {
    headerText = "posting.posting_failure";
    image = <Image source={posting.uploadfail} />;
    extraText = `${i18n.t( "posting.error_observation" )} ${errorText}`;
  } else if ( status === "beforeObservation" ) {
    headerText = "posting.posting_failure";
    image = <Image source={posting.uploadfail} />;
    extraText = `${i18n.t( "posting.error_token" )} ${errorText}`;
  }

  return (
    <>
      <SafeAreaView color={colors.white} />
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <GreenText
          center
          color={!loading && !postingSuccess ? colors.seekTeal : colors.seekiNatGreen}
          text={headerText}
        />
        <View style={styles.margin} />
        <View style={styles.center}>
          {image}
          <Text style={[styles.text, loading && styles.margin]}>
            {extraText}
          </Text>
        </View>
      </View>
      {!loading ? (
        <View style={styles.bottom}>
          <GreenButton
            color={!loading && !postingSuccess ? colors.seekTeal : null}
            handlePress={() => {
              if ( postingSuccess ) {
                navigation.goBack();
              } else {
                togglePostModal();
              }
            }}
            text="posting.ok"
          />
        </View>
      ) : null}
    </>
  );
};

export default PostStatus;
