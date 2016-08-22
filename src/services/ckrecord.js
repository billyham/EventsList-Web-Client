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
            return renderRecord(record,zoneID,databaseScope);
          }
        });
    },
    delete(){

    },
    save(){

    }
  };
}
