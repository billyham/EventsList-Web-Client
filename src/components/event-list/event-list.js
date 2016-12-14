import template from './event-list.html';
import styles from './event-list.scss';

export default {
  template,
  bindings: {
    // userIdentity: '<',
    ckqueryResult: '=',
    dbType: '<',
    publish: '&',
    userName: '<'
  },
  controller: ['ckqueryService', 'ckconfigureService', '$scope', controller]
};

function controller(ckqueryService, ckconfigureService, $scope){
  // ------------------------------ Properties ------------------------------ //
  this.styles = styles;

  // ------------------------------- Methods -------------------------------- //
  this.loadMore = loadMore;
  this.remove = remove;

  // ---------------------------- Initialization ---------------------------- //
  if (this.ckqueryResult.error) {
    if (this.ckqueryResult.error.message === 'Cannot query against an unauthenticated user ID'){
      //TODO: Show message that user needs to be logged in.
      console.log('Unauthenticated, user not logged in');
    }else{
      //TODO: Show generic server error message
    }
  }

  // ------------------------ Function declarations ------------------------- //
  function loadMore(){
    ckqueryService.query(
      'PUBLIC','_defaultZone',null,'Program',
      ['title', 'imageRef', 'video'],'title',null,null,null,
      [], this.ckqueryResult.continuationMarker
    ).then(result => {
      this.ckqueryResult.records = this.ckqueryResult.records.concat(result.records);
      this.ckqueryResult.continuationMarker = result.continuationMarker;
      $scope.$apply();
    }).catch(error => {
      console.log('loadMore error ' + error);
    });
  };

  function remove(rec){
    let index = this.ckqueryResult.records.findIndex( element => element.recordName === rec.recordName );
    if (index > -1) {
      this.ckqueryResult.records.splice(index, 1);
      $scope.$apply();
    }
  };

}
