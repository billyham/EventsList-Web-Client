eventService.$inject = ['ckrecordService', '$http', 'imageService'];

export default function eventService(ckrecordService, $http, imageService){

  return {

    /**
     * Service method for publishing or unpublishing an event (Program with all
     * related resources) to cloud store.
     *
     * @param  {object}  record      Program model object
     * @param  {object}  [image]     Image440 model object
     * @param  {Boolean} isUnPublish true if the method is used to unpublish an
     *                               event.
     *
     * @return {promise}  Resolves with the Program object.
     */
    publish(record, image, isUnPublish){
      const fromDatabase = isUnPublish ? 'PUBLIC' : 'PRIVATE';
      const toDatabase = isUnPublish ? 'PRIVATE' : 'PUBLIC';
      const arrayOfPromises = [];

      // Check if the event has an associated image and move it too.
      if (record.fields.imageRef && record.fields.imageRef.value.recordName && image){

        const fileName = image.fields.fileName.value;

        return imageService.download(image.fields.image.value.downloadURL)
        .then( imageDataAsArrayBuffer => {
          return imageService.upload(toDatabase, imageDataAsArrayBuffer, fileName, record.recordName)
          .then( imageObj => {

            arrayOfPromises.push(_removeEvent(record, fromDatabase));
            arrayOfPromises.push(_removeEvent(image, fromDatabase));

            // Update Program record with new imageRef ID
            record.fields.imageRef.value.recordName = imageObj.data.records[0].recordName;
            arrayOfPromises.push(_saveEvent(record, toDatabase));

            return Promise.all(arrayOfPromises)
            .then( arrayOfResponses => {
              // Return Program object with lastest timestamp and change tag.
              return arrayOfResponses[2];
            });

          })
          .catch( err => {
            console.log('inside catch with error: ', err);
          });
        });

      } else {

        arrayOfPromises.push(_saveEvent(record, toDatabase));
        arrayOfPromises.push(_removeEvent(record, fromDatabase));

        return Promise.all(arrayOfPromises)
        .then( arrayOfResponses => {
          if (arrayOfResponses.length > 0) return arrayOfResponses[0];
        });
      }
    }
  };

  /**
   * Save an event or image resource. Default is a Program record.
   *
   * @param  {object}   record        A single full event record
   * @param  {string}   database      PUBLIC or PRIVATE
   * @param  {string}   [recordType]  Used to first save an image assocated
   *                                    with the record.
   *
   * @return {promise}          A promise the resolves with an object that is
   *                            the original record with an updated timestamp.
   */
  function _saveEvent(record, database, recordType){

    recordType = recordType || 'Program';

    return ckrecordService.save(
      database,           // databaseScope, PUBLIC or PRIVATE
      record.recordName,  // recordName,
      null,               // recordChangeTag
      recordType,         // recordType
      null,               // zoneName,  null is _defaultZone, PUBLIC databases have only the default zone
      null,               // forRecordName,
      null,               // forRecordChangeTag,
      null,               // publicPermission,
      null,               // ownerRecordName,
      null,               // participants,
      null,               // parentRecordName,
      record.fields       // fields
    );

  };

  function _removeEvent(record, database){

    // On success an argument is returned with two properties:
    // { deleted: <boolean>, recordName: <string> }
    return ckrecordService.delete(
      database,           // databaseScope
      record.recordName,  // recordName
      null,               // zoneName
      null                // ownerRecordName
    );
  }


}
