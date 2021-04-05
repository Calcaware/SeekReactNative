// @flow

import BadgeRealm from "./BadgeRealm";
import ChallengeRealm from "./ChallengeRealm";
import CommonNamesRealm from "./CommonNamesRealm";
import NotificationRealm from "./NotificationRealm";
import ObservationRealm from "./ObservationRealm";
import PhotoRealm from "./PhotoRealm";
import TaxonRealm from "./TaxonRealm";
import ReviewRealm from "./ReviewRealm";
import UploadObservationRealm from "./UploadObservationRealm";
import UploadPhotoRealm from "./UploadPhotoRealm";
import UserSettingsRealm from "./UserSettingsRealm";

export default {
  schema: [
    BadgeRealm,
    ChallengeRealm,
    CommonNamesRealm,
    NotificationRealm,
    ObservationRealm,
    PhotoRealm,
    ReviewRealm,
    TaxonRealm,
    UploadObservationRealm,
    UploadPhotoRealm,
    UserSettingsRealm
  ],
  schemaVersion: 32,
  path: "db.realm"
};
