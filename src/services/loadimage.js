loadImage.$inject = ['$http'];

export default function loadImage($http){

  return {
    load(url){
      return $http.get(url)
      .then( imageData => {
        return imageData;
      });
    }
  };
}
