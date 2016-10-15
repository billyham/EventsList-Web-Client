import template from './event-list.html';
import styles from './event-list.scss';

export default {
  template,
  bindings: {
    userIdentity: '<',
    ckqueryResult: '<',
    arrayOfImages: '<'
  },
  controller: ['ckqueryService', 'ckconfigureService', '$scope', 'ngDialog', controller]
};

function controller(ckqueryService, ckconfigureService, $scope, ngDialog){
  this.styles = styles;

  if (this.ckqueryResult.error) {
    if (this.ckqueryResult.error.message === 'Cannot query against an unauthenticated user ID'){
      //TODO: Show message that user needs to be logged in.
      console.log('Unauthenticated, user not logged in');
    }else{
      //TODO: Show generic server error message
    }
  }

  this.loadMore = function loadMore(){
    ckqueryService.query(
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

  this.showadd = function showadd(){
    const dialog = ngDialog.open({
      template:'<event-add close="close()" add="add(rec)">Enter</event-add>',
      className: 'ngdialog-theme-default',
      plain: true,
      data: this.ckqueryResult,
      controller: ['$scope', function($scope){

        // Close the dialog
        $scope.close = function close(){
          dialog.close();
        };

        // Update the list view with the new Event
        $scope.add = rec => {
          if (!rec) return;
          $scope.ngDialogData.records.push(rec);
          $scope.ngDialogData.records.sort( (a,b) => {
            if (a.fields.title.value.toUpperCase() > b.fields.title.value.toUpperCase()) return 1;
            if (a.fields.title.value.toUpperCase() < b.fields.title.value.toUpperCase()) return -1;
            return 0;
          });
          $scope.$apply();
        };
      }]
    });
  };

}
