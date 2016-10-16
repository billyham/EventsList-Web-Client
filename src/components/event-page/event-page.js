import template from './event-page.html';
import styles from './event-page.scss';

export default {
  template,
  bindings: {
    publicEvents: '=',
    privateEvents: '=',
    userIdentity: '<'
  },
  controller: ['ngDialog', 'ckrecordService', '$scope', controller]
};

function controller(ngDialog, ckrecordService, $scope) {
  this.styles = styles;
  this.typepublic = 'PUBLIC';
  this.typeprivate = 'PRIVATE';

  // Methods
  this.showadd = showadd;

  // console.log('userIdentity', this.userIdentity);

  function showadd(){
    const dialog = ngDialog.open({
      template:'<event-add close="close()" add="add(rec)">Enter</event-add>',
      className: 'ngdialog-theme-default',
      plain: true,
      data: this.privateEvents,
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

  this.publish = function publish(rec){
    ckrecordService.save(
      'PUBLIC', //databaseScope, PUBLIC or PRIVATE
      rec.recordName, // recordName,
      null, // recordChangeTag
      'Program', //recordType
      null, //zoneName,  null will be default _defaultZone, PUBLIC databases are limited to the one default zone
      null, //forRecordName,
      null, //forRecordChangeTag,
      null, //publicPermission,
      null, //ownerRecordName,
      null, //participants,
      null, //parentRecordName,
      rec.fields //fields
    ).then( record => {

      ckrecordService.delete(
        'PRIVATE',  // databaseScope
        record.recordName,  // recordName
        null,  // zoneName
        null  //ownerRecordName
      ).then( rec => {

        var indexToDelete = -1;
        this.privateEvents.records.forEach(function(element, index){
          if (element.recordName === rec.recordName){

            // Add the published item to the publicEvents, and sort.
            this.publicEvents.records.push(element);
            this.publicEvents.records.sort( (a,b) => {
              if (a.fields.title.value.toUpperCase() > b.fields.title.value.toUpperCase()) return 1;
              if (a.fields.title.value.toUpperCase() < b.fields.title.value.toUpperCase()) return -1;
              return 0;
            });

            // If a continuationMarker exists, and the published object
            // is at the end of the array, don't add it.
            // Or an error occures when you load more.
            if (this.publicEvents.continuationMarker){
              if (this.publicEvents.records[this.publicEvents.records.length - 1] === element ){
                this.publicEvents.records.pop();
              }
            }

            // Identify the index to be deleted (don't mutate the array inside forEach)
            indexToDelete = index;
          }
        }, this);

        // Remove the published event from privateEvents
        if (indexToDelete > -1) this.privateEvents.records.splice(indexToDelete, 1);

        $scope.$apply();

      }).catch( err => {
        // TODO: Alert user that delete failed
        console.log('publish ERROR trying to delete from PRIVATE', err);
      });
    }).catch( err => {
      // Revert to previous value
      console.log('publish ERROR trying to save in PUBLIC', err);
    });
  };

}
