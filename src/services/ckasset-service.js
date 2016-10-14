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

    request: function request(){
      const reqUrl = 'https://api.apple-cloudkit.com/database/1/' + cloudID + '/development/public/assets/upload?' + apiToken + sessionToken;
      const reqBody = JSON.stringify({
        tokens:[{
          recordType:'Image440',
          fieldName:'image'
        }]
      });
      return $http.post(reqUrl, reqBody);
      // .then( obj => {
      //   callback(obj);
      // })
      // .catch( () => {
      // });
    },

    upload: function upload(url, file, callback){
      $http.post(url, file, { headers: { 'Content-Type': 'image/png' }, transformRequest: [] })
      .then( returnObj => {
        callback(returnObj);
      })
      .catch( error => {
        console.log('fail with error: ', error);
      });
    },

    modify: function modify(fileName, referenceObj, recordName, image, callback){
      const reqUrl = 'https://api.apple-cloudkit.com/database/1/' + cloudID + '/development/public/records/modify?' + apiToken + sessionToken;
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
                  // wrappingKey: image.wrappingKey,
                  fileChecksum: image.fileChecksum,
                  receipt: image.receipt,
                  // referenceChecksum: image.referenceChecksum,
                  size: image.size
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
        callback(obj);
      })
      .catch( err => {
        console.log('ckassetService modify error: ', err);
      });


    }
  };
};
