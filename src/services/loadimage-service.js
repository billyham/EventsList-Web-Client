loadImageService.$inject = ['$http'];

export default function loadImageService($http){

  return {
    load(url){
      return $http.get(url)
      .then( imageData => {
        return imageData;
      });
    }
  };
}
