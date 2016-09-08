ckrecord.$inject = [];

export default function ckrecord(){

  return {
    fetch(
      databaseScope,  //PUBLIC
      recordName,
      zoneName, //_defaultZone
      ownerRecordName
    ) {
      var container = CloudKit.getDefaultContainer();
      var database = container.getDatabaseWithDatabaseScope(
        CloudKit.DatabaseScope[databaseScope]
      );

      var zoneID,options;

      if(zoneName) {
        zoneID = { zoneName: zoneName };
        if(ownerRecordName) {
          zoneID.ownerRecordName = ownerRecordName;
        }
        options = { zoneID: zoneID };
      }

      return database.fetchRecords(recordName,options)
        .then(function(response) {
          if(response.hasErrors) {

            // Handle the errors in your app.
            throw response.errors[0];

          } else {
            var record = response.records[0];

            // Render the fetched record.
            // return renderRecord(record,zoneID,databaseScope);
            return record;
          }
        });
    },
    delete(
      databaseScope, // PUBLIC
      recordName,
      zoneName,  // _defaultZone
      ownerRecordName
    ){
      var container = CloudKit.getDefaultContainer();
      var database = container.getDatabaseWithDatabaseScope(
        CloudKit.DatabaseScope[databaseScope]
      );

      var zoneID,options;

      if(zoneName) {
        zoneID = { zoneName: zoneName };
        if(ownerRecordName) {
          zoneID.ownerRecordName = ownerRecordName;
        }
        options = { zoneID: zoneID };
      }

      return database.deleteRecords(recordName,options)
      .then(function(response) {
        if(response.hasErrors) {

          // Handle the errors in your app.
          throw response.errors[0];

        } else {
          var deletedRecord = response.records[0];

          // Render the deleted record.
          // return renderDeletedRecord(deletedRecord);
          return deletedRecord;
        }
      });
    },
    save(
      databaseScope,  // PUBLIC
      recordName,
      recordChangeTag,  // leave black for new record, provide one when changing a record
      recordType,  // Program
      zoneName, //_defaultZone
      forRecordName,
      forRecordChangeTag,
      publicPermission,
      ownerRecordName,
      participants,
      parentRecordName,
      fields,
      createShortGUID
    ){
      var container = CloudKit.getDefaultContainer();
      var database = container.getDatabaseWithDatabaseScope(
        CloudKit.DatabaseScope[databaseScope]
      );

      var options = {
        // By passing and fetching number fields as strings we can use large
        // numbers (up to the server's limits).
        numbersAsStrings: true

      };

      // If no zoneName is provided the record will be saved to the default zone.
      if(zoneName) {
        options.zoneID = { zoneName: zoneName };
        if(ownerRecordName) {
          options.zoneID.ownerRecordName = ownerRecordName;
        }
      }

      // var record = Object.create(null);
      // record.recordType = recordType;
      var record = {
        recordType: recordType
      };

      // If no recordName is supplied the server will generate one.
      if(recordName) {
        record.recordName = recordName;
      }

      // record.recordType = recordType;

      // To modify an existing record, supply a recordChangeTag.
      if(recordChangeTag) {
        record.recordChangeTag = recordChangeTag;
      }

      // Convert the fields to the appropriate format.
      record.fields = Object.keys(fields).reduce(function(obj,key) {
        obj[key] = fields[key];
        return obj;
      },{});

      // If we are going to want to share the record we need to
      // request a stable short GUID.
      if(createShortGUID) {
        record.createShortGUID = true;
      }

      // If we want to share the record via a parent reference we need to set
      // the record's parent property.
      if(parentRecordName) {
        record.parent = { recordName: parentRecordName };
      }

      if(publicPermission) {
        record.publicPermission = CloudKit.ShareParticipantPermission[publicPermission];
      }

      // If we are creating a share record, we must specify the
      // record which we are sharing.
      if(forRecordName && forRecordChangeTag) {
        record.forRecord = {
          recordName: forRecordName,
          recordChangeTag: forRecordChangeTag
        };
      }

      if(participants) {
        record.participants = participants.map(function(participant) {
          return {
            userIdentity: {
              lookupInfo: { emailAddress: participant.emailAddress }
            },
            permission: CloudKit.ShareParticipantPermission[participant.permission],
            type: participant.type,
            acceptanceStatus: participant.acceptanceStatus
          };
        });
      }

      return database.saveRecords(record,options)
        .then(function(response) {
          if(response.hasErrors) {

            // Handle the errors in your app.
            throw response.errors[0];

          } else {

            // return renderRecord(response.records[0],options.zoneID, databaseScope);
            return response.records[0];

          }
        });
        // .catch(function(error){
        //   console.log('inside error' + error);
        // });
    }
  };
}
