// =============================================================================
// A wrapper for the CloudKit JS Library object --ckasset--
// Use this for saving, deleting or modifying images or other
// blob assets.
// =============================================================================

ckassetService.$inject = ['$http', '$cookies'];

export default function ckassetService($http, $cookies){

  const cloudID = process.env.CLOUD_ID;
  const apiToken = 'ckAPIToken=' + process.env.API_TOKEN;
  const sessionToken = '&ckWebAuthToken=' + encodeURIComponent($cookies.get(cloudID));

  return {

    request: function request(database){
      if (database !== 'PUBLIC' && database !== 'PRIVATE') return null;
      const reqUrl = 'https://api.apple-cloudkit.com/database/1/' + cloudID + '/development/' + database.toLowerCase() + '/assets/upload?' + apiToken + sessionToken;
      const reqBody = JSON.stringify({
        tokens:[{
          recordType:'Image440',
          fieldName:'image'
        }]
      });
      return $http.post(reqUrl, reqBody);
    },

    upload: function upload(url, file, contentType, callback){
      $http.post(url, file, { headers: { 'Content-Type': contentType }, transformRequest: [] })
      .then( returnObj => {
        callback(returnObj);
      })
      .catch( error => {
        console.log('fail with error: ', error);
      });
    },

    modify: function modify(fileName, referenceObj, recordName, image, database, callback){
      const reqUrl = 'https://api.apple-cloudkit.com/database/1/' + cloudID + '/development/' + database.toLowerCase() + '/records/modify?' + apiToken + sessionToken;
      const reqBody = JSON.stringify({
        operations: [{
          operationType: 'create',
          record: {
            recordType: 'Image440',
            fields: {
              fileName: {
                value: fileName
              },
              programRef: referenceObj,
              image: {
                value: {
                  fileChecksum: image.fileChecksum,
                  receipt: image.receipt,
                  size: image.size,
                  wrappingKey: image.wrappingKey,             // value will be null for PUBLIC db requests
                  referenceChecksum: image.referenceChecksum  // value will be null for PUBLIC db requests
                }
              }
            },
            recordName: recordName,
            desiredKeys: []
          }
        }]
      });
      $http.post(reqUrl, reqBody)
      .then( obj => {
        // TODO: A bad request error will come back with status 200
        // Check for serverErrorCode and throw as an error 
        // obj will look like this: {"records":[{"recordName":"a4cd61f4-1852-4e6b-b471-17e344ab6e43","reason":"bad upload receipt (did_not_validate)","serverErrorCode":"BAD_REQUEST"}]}
        callback(obj);
      })
      .catch( err => {
        console.log('ckassetService modify error: ', err);
      });


    }
  };
};
