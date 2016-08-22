ckquery.$inject = [];

export default function ckquery(){

  return {
    demoPerformQuery(
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
      // console.log('peformQuery fires with continuationMarker ' + continuationMarker);
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

        if(!isNaN(latitude) && !isNaN(longitude)) {
          sortDescriptor.relativeLocation = {
            latitude: latitude,
            longitude: longitude
          };
        }

        query.sortBy = [sortDescriptor];
      }

      // Convert the filters to the appropriate format.
      query.filterBy = filters.map(function(filter) {
        filter.fieldValue = { value: filter.fieldValue };
        return filter;
      });

      // Set the options.
      var options = {
        // Restrict our returned fields to this array of keys.
        desiredKeys: desiredKeys,
        // Fetch 15 results at a time.
        resultsLimit: 5
      };

      if(zoneName) {
        options.zoneID = { zoneName: zoneName };
        if(ownerRecordName) {
          options.zoneID.ownerRecordName = ownerRecordName;
        }
      }

      // If we have a continuation marker, use it to fetch the next 5 results.
      // var continuationMarker = getContinuationMarker();
      if(continuationMarker) {
        options.continuationMarker = continuationMarker;
        // console.log('continuationMarker: ' + continuationMarker);
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
            // saveContinuationMarker(response.continuationMarker);
            var {continuationMarker} = response;
            // console.log('this is the continuation marker: ' + continuationMarker);

            // return renderRecords(records);
            return {records, continuationMarker};
          }
        });
    }
  };
}

// var continuationMarker;
//
// var saveContinuationMarker = function(value) {
//   // console.log('inside save continuation with value' + value);
//   if (value) {
//     continuationMarker = value;
//     // continuationMarkerView.classList.remove('hide');
//     // continuationMarkerValueView.textContent = value;
//   } else {
//     removeContinuationMarker();
//   }
// };

// var removeContinuationMarker = function() {
//   continuationMarker = null;
//   // continuationMarkerView.classList.add('hide');
// };

// var getContinuationMarker = function() {
//   return continuationMarker;
// };
