eventService.$inject = ['ckrecordService', '$http', 'imageService', 'guardService'];

export default function eventService(ckrecordService, $http, imageService, guard){

  return {

    /**
     * Service method for publishing or unpublishing an event (Program with all
     * related resources) to cloud store.
     *
     * @param  {Object}  record      Program model object
     * @param  {Object}  [image]     Image440 model object
     * @param  {boolean} isUnPublish true if the method is used to unpublish an
     *                               event.
     *
     * @return {promise}  Resolves with the Program object.
     */
    publish(record, image, isUnPublish){
      const fromDatabase = isUnPublish ? 'PUBLIC' : 'PRIVATE';
      const toDatabase = isUnPublish ? 'PRIVATE' : 'PUBLIC';
      // const arrayOfPromises = [];

      // Check if the event has an associated image and move it too.
      if (record.fields.imageRef && record.fields.imageRef.value.recordName && image){

        // 1. Move the Image
        // 2. On success, update the Program record with new imageRef ID &&
        //    move the Program
        // 3. On success, return Program object with lastest timestamp and
        //    change tag.
        return _moveImage(record, toDatabase, fromDatabase, image)
        .then( updatedRecord => {
          return _moveRecord(updatedRecord, toDatabase, fromDatabase);
        });

      } else {
        return _moveRecord(record, toDatabase, fromDatabase);
      }
    }
  };

  /**
   * Chains _removeRecord and _saveRecord to ensure that a record is only removed
   * after it is successfully saved. Returns a promise that resolves with the
   * newly created record object.
   *
   * @param  {Object}   record        A single full event record
   * @param  {string}   toDatabase    Database to save to: PUBLIC or PRIVATE
   * @param  {string}   fromDatabase  Database to remove from: PUBLIC or PRIVATE
   * @param  {string}   [recordType]  Used to first save an image assocated
   *                                    with the record.
   *
   * @return {Promise}  Promise that resolves with the new saved record.
   */
  function _moveRecord(record, toDatabase, fromDatabase, recordType){

    return _saveRecord(record, toDatabase, recordType)
    .then( newRecord => {
      if (!newRecord) return null;
      return _removeRecord(record, fromDatabase)
      .then( () => {
        return newRecord;
      })
      .catch( err => {
        // If _removeRecord on the fromDatabase fails, return to the original
        // state by removing the saved record from the toDatabase.
        _removeRecord(newRecord, toDatabase);
        throw err;
      });
    });
  }

  /**
   * Moves an Image object from PUBLIC to PRIVATE database or vice versa.
   *
   * @param  {object} record       Program model object
   * @param  {string} toDatabase   PUBLIC or PRIVATE
   * @param  {string} fromDatabase PUBLIC or PRIVATE
   * @param  {object} image        Imagem model object
   *
   * @return {Promise} Promise that resolves with an updated Program object
   */
  function _moveImage(record, toDatabase, fromDatabase, image){

    const fileName = image.fields.fileName.value;

    return imageService.download(image.fields.image.value.downloadURL)
    .then( imageDataAsArrayBuffer => {

      return imageService.upload(toDatabase, imageDataAsArrayBuffer, fileName, record.recordName)
      .then( imageObj => {

        if (guard.arrayWithMember(imageObj, 'data', 'records')) {
          throw new Error('Error saving Image record');
        }

        // Check for an error code. On a failed image upload, throw an error.
        if (imageObj.data.records[0]['serverErrorCode']) throw new Error('Error saving Image record');

        return _removeRecord(image, fromDatabase)
        .then( () => {
          // Copy the record object
          const newRecord = JSON.parse(JSON.stringify(record));
          // Update Program record with new imageRef ID
          newRecord.fields.imageRef.value.recordName = imageObj.data.records[0].recordName;
          return newRecord;
        })
        .catch( err => {
          // If _removeRecord on the fromDatabase fails, return to the original
          // state by removing the saved record from the toDatabase.
          return _removeRecord(imageObj.data.records[0], toDatabase)
          .then( () => {
            // console.log('successfully removed image: ');
            throw err;
          });
        });

      });
    });

  }

  /**
   * Save a Program or Image resource. Default is a Program record.
   *
   * @param  {object}   record        A single full event record
   * @param  {string}   database      PUBLIC or PRIVATE
   * @param  {string}   [recordType]  Used to first save an image assocated
   *                                    with the record.
   *
   * @return {Promise}          A promise the resolves with an object that is
   *                            the original record with an updated timestamp.
   */
  function _saveRecord(record, database, recordType){

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

  function _removeRecord(record, database){

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
