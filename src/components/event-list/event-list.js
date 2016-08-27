import template from './event-list.html';

export default {
  template,
  bindings: {
    ckqueryResult: '<',
    arrayOfImages: '<'
  },
  controller: ['ckquery', 'ckconfigure', '$scope', controller]
};

function controller(ckquery, ckconfigure, $scope){

  this.loadMore = function loadMore(){

    ckquery.query(
      'PUBLIC','_defaultZone',null,'Program',
      ['title', 'imageRef', 'video'],'title',null,null,null,
      [], this.ckqueryResult.continuationMarker
    ).then(result => {
      this.ckqueryResult.records = this.ckqueryResult.records.concat(result.records);
      this.ckqueryResult.continuationMarker = result.continuationMarker;
      $scope.$apply();  // Forces any Angular to evalute any $watchers
    }).catch(error => {
      console.log('loadMore error ' + error);
    });
  };

}
