/* =============================================================================
   A wrapper for the CloudKit JS Library object --ckasset--
   Use this for saving, deleting or modifying images or other
   blob assets.
   ========================================================================== */

ckassetService.$inject = ['$http', '$cookies'];

export default function ckassetService($http, $cookies){

  function _credentials(){
    const cloudID = process.env.CLOUD_ID;
    return {
      cloudID,
      apiToken: 'ckAPIToken=' + process.env.API_TOKEN,
      sessionToken: '&ckWebAuthToken=' + encodeURIComponent($cookies.get(cloudID))
    };
  }

  return {
    request: function request(database){
      const { cloudID, apiToken, sessionToken } = _credentials();
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

    upload: function upload(url, file, contentType){
      return $http.post(url, file, { headers: { 'Content-Type': contentType }, transformRequest: [] });
    },

    modify: function modify(fileName, referenceObj, recordName, image, database){
      const { cloudID, apiToken, sessionToken } = _credentials();
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
      return $http.post(reqUrl, reqBody)
      .then( obj => {
        // A bad request error will come back with status 200. Check for a serverErrorCode property.
        if (obj && obj.data && obj.data.records && obj.data.records.length > 0 && obj.data.records[0]['serverErrorCode']) {
          throw new Error('Did not validate');
        } else{
          return obj;
        }
      });
    },

  };
};
