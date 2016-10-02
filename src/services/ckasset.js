ckasset.$inject = ['$http', '$cookies'];

export default function ckasset($http, $cookies){
  return {

    request: function request(){
      let cloudID = process.env.CLOUD_ID;
      let apiToken = 'ckAPIToken=' + process.env.API_TOKEN;
      let sessionToken = '&ckWebAuthToken=' + encodeURIComponent($cookies.get(cloudID));
      let reqUrl = 'https://api.apple-cloudkit.com/database/1/' + cloudID + '/development/public/assets/upload?' + apiToken + sessionToken;
      let reqBody = JSON.stringify({
        tokens:[{
          recordType:'Image440',
          fieldName:'image'
        }]
      });
      $http.post(reqUrl, reqBody)
      .then( obj => {
        console.log(obj);
      })
      .catch( () => {
        console.log('ckasset request error');
      });
    },
    
    upload: function upload(){

    }
  };
};
