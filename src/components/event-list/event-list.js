import template from './event-list.html';

export default {
  template,
  bindings: {
    userIdentity: '<',
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
      $scope.$apply();  // Forces Angular to evalute any $watchers
    }).catch(error => {
      console.log('loadMore error ' + error);
    });
  };

  this.remove = function remove(rec){
    let index = this.ckqueryResult.records.findIndex( element => element.recordName === rec.recordName );
    if (index > -1) {
      this.ckqueryResult.records.splice(index, 1);
      $scope.$apply();
    }
  };

  this.add = function add(rec){
    if (!rec) return;
    this.ckqueryResult.records.push(rec);
    this.ckqueryResult.records.sort( (a,b) => {
      if (a.fields.title.value.toUpperCase() > b.fields.title.value.toUpperCase()) return 1;
      if (a.fields.title.value.toUpperCase() < b.fields.title.value.toUpperCase()) return -1;
      return 0;
    });
    $scope.$apply();
  };

}
