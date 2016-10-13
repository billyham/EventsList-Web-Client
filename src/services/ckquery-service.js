ckqueryService.$inject = [];

export default function ckqueryService(){

  return {
    query(
      databaseScope,
      zoneName,
      ownerRecordName,
      recordType,
      desiredKeys,
      sortByField,
      ascending,
      latitude,
      longitude,
      filters,
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
            console.log(records);
            return {records, continuationMarker};
          }
        });
    }
  };
}
