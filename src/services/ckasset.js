ckasset.$inject = ['$http', '$cookies'];

export default function ckasset($http, $cookies){

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
      //   console.log('ckasset request error');
      // });
    },

    upload: function upload(url, file, callback){
      // console.log(url + ', ' + file);
      $http.post(url, file, { headers: { 'Content-Type': 'image/png' }, transformRequest: [] })
      .then( returnObj => {
        // console.log('success');
        // console.log(returnObj);
        callback(returnObj);
      })
      .catch( error => {
        console.log('fail');
        console.log(error);
      });
    },

    modify: function modify(fileName, recordName, image, callback){
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
      .catch( () => {
        console.log('ckasset modify error');
      });


    }
  };
};
