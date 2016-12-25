eventService.$inject = ['ckrecordService'];

export default function eventService(ckrecordService){

  return {

    saveEvent(record, database, image){

      // Check if the event has an associated image
      if (record.fields.imageRef && record.fields.imageRef.value.recordName && image){

        // Delete the image record from the current database


        // Save the image record to the new database
      }

      return ckrecordService.save(
        database,           // databaseScope, PUBLIC or PRIVATE
        record.recordName,  // recordName,
        null,               // recordChangeTag
        'Program',          // recordType
        null,               // zoneName,  null is _defaultZone, PUBLIC databases have only the default zone
        null,               // forRecordName,
        null,               // forRecordChangeTag,
        null,               // publicPermission,
        null,               // ownerRecordName,
        null,               // participants,
        null,               // parentRecordName,
        record.fields       // fields
      );

    },

    removeEvent(record, database){

      return ckrecordService.delete(
        database,           // databaseScope
        record.recordName,  // recordName
        null,               // zoneName
        null                // ownerRecordName
      );

    },

    saveImage(){


    },

    removeImage(){


    }

  };
}
