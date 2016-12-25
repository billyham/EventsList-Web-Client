eventService.$inject = ['ckrecordService'];

export default function eventService(ckrecordService){

  return {

    publish(record, image, isUnPublish){
      const fromDatabase = isUnPublish ? 'PUBLIC' : 'PRIVATE';
      const toDatabase = isUnPublish ? 'PRIVATE' : 'PUBLIC';

      const arrayOfPromises = [];

      arrayOfPromises.push(_saveEvent(record, toDatabase));
      arrayOfPromises.push(_removeEvent(record, fromDatabase));

      // Check if the event has an associated image and move it too.
      if (record.fields.imageRef && record.fields.imageRef.value.recordName && image){
        arrayOfPromises.push(_saveEvent(image, toDatabase, 'Image440'));
        arrayOfPromises.push(_removeEvent(image, fromDatabase));
      }

      return Promise.all(arrayOfPromises)
      .then( () => {
        console.log('return the original record: ', record);
        return record;
      });
    }
  };

  /**
   * Save an event or image resource. Default is an event record.
   *
   * @param  {object}   record        A single full event record
   * @param  {string}   database      PUBLIC or PRIVATE
   * @param  {string}   [_recordType] Used to first save an image assocated
   *                                    with the record.
   *
   * @return {promise}          A promise the resolves with an object that is
   *                            the original record with an updated timestamp.
   */
  function _saveEvent(record, database, _recordType){
    console.log('_saveEvent with recordType and record:', _recordType, record);
    _recordType = _recordType || 'Program';

    return ckrecordService.save(
      database,           // databaseScope, PUBLIC or PRIVATE
      record.recordName,  // recordName,
      null,               // recordChangeTag
      _recordType,        // recordType
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
    console.log('_removeEvent called with record and database: ', record, database);
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
