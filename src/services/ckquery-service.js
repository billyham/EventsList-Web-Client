ckqueryService.$inject = [];

export default function ckqueryService(){

  return {
    query(
      databaseScope,
      zoneName,
      ownerRecordName,
      recordType,
      desiredKeys,  //The default is null, which fetches all record fields.
      sortByField,
      ascending,
      latitude,
      longitude,
      filters,  //https://developer.apple.com/library/content/documentation/DataManagement/Conceptual/CloutKitWebServicesReference/Types/Types.html#//apple_ref/doc/uid/TP40015240-CH3-SW16
      continuationMarker
    ) {
      var container = CloudKit.getDefaultContainer();
      var database = container.getDatabaseWithDatabaseScope(
        CloudKit.DatabaseScope[databaseScope]
      );

      // Set the query parameters.
      var query = {
        recordType: recordType
      };

      if(sortByField) {
        var sortDescriptor = {
          fieldName: sortByField,
          ascending: ascending
        };

        // if(!isNaN(latitude) && !isNaN(longitude)) {
        //   sortDescriptor.relativeLocation = {
        //     latitude: latitude,
        //     longitude: longitude
        //   };
        // }

        query.sortBy = [sortDescriptor];
      }

      // Convert the filters to the appropriate format.
      query.filterBy = filters.map(function(filter) {
        filter.fieldValue = { value: filter.fieldValue };
        return filter;
      });

      // Set the options.
      var options = {
        desiredKeys: desiredKeys,
        resultsLimit: 10
      };

      if(zoneName) {
        options.zoneID = { zoneName: zoneName };
        if(ownerRecordName) {
          options.zoneID.ownerRecordName = ownerRecordName;
        }
      }

      // If we have a continuation marker, use it to fetch the next results.
      if(continuationMarker) {
        options.continuationMarker = continuationMarker;
      }

      // Execute the query.
      return database.performQuery(query,options)
        .then(function (response) {
          if(response.hasErrors) {

            // Handle them in your app.
            throw response.errors[0];

          } else {
            var records = response.records;

            // Save the continuation marker so we can fetch more results.
            var {continuationMarker} = response;
            // return renderRecords(records);
            return {records, continuationMarker};
          }
        })
        .catch(function (err){
          return { error: err, records: [] };
        });
    }
  };
}
