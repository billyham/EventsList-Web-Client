import template from './event-page.html';
import styles from './event-page.scss';

export default {
  template,
  bindings: {
    publicEvents: '=',
    privateEvents: '=',
    userIdentity: '<',
  },
  controller: ['ngDialog', 'eventService', '$scope', 'ckauthenticateService', 'ckqueryService', controller]
};

function controller(ngDialog, eventService, $scope, ckauthenticateService, ckqueryService) {
  // ============================== Properties ============================== //
  this.styles = styles;
  this.typepublic = 'PUBLIC';
  this.typeprivate = 'PRIVATE';

  // =============================== Methods ================================ //
  this.showadd = showadd;
  this.publish = publish;

  // ============================ Initialization ============================ //
  this.$onInit = () => {
    ckauthenticateService.fetchCurrentName()
    .then(name => this.userName = name);

    // Register to observe changes in authentication
    ckauthenticateService.subscribe( userName => {
      $scope.$apply( () => {
        // Update display name
        this.userName = userName || '';
        // Update list of private events
        ckqueryService.query('PRIVATE','_defaultZone',null,'Program',
          ['title', 'imageRef', 'video', 'fulldescription'],'title',null,null,null,
          [], null)
          .then(result => {
            this.privateEvents = {records: result.records, continuationMarker: result.continuationMarker, error: result.error};
            $scope.$apply();
          });
      });
    });
  };

  // ========================= Function declarations ======================== //
  /**
   * Presents a modal view for adding a new event. It will go to Draft events
   * list by default. Modal adds a new event to the cloud store and updates the
   * in memory array of draft events.
   */
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

  /**
   * Changes the status of an event to Published or Draft.
   *
   * @param  {object}   rec           An event record object
   * @param  {boolean}  isPublished   "true" if event is changed to the Published
   *                                  state. "false" if event is changed to Draft.
   */
  function publish(rec){

    // imageRecord will be null if no image on event
    const { eventRecord, imageRecord, isPublished } = rec;

    eventService.saveEvent(eventRecord, isPublished ? 'PUBLIC' : 'PRIVATE', imageRecord)
    .then( record => {
      // "record" differs from "eventRecord" only by an updated "modified.timestamp" property

      eventService.removeEvent(record, isPublished ? 'PRIVATE' : 'PUBLIC')
      .then( () => {
        // On success: an argument is available that is an object with two properties: { deleted: <boolean>, recordName: <string> }

        // Add the published item to the publicEvents array and sort.
        this.publicEvents.records.push(record);
        this.publicEvents.records.sort( (a,b) => {
          if (a.fields.title.value.toUpperCase() > b.fields.title.value.toUpperCase()) return 1;
          if (a.fields.title.value.toUpperCase() < b.fields.title.value.toUpperCase()) return -1;
          return 0;
        });

        // If a continuationMarker exists and the published object
        // is at the end of the array, don't add it.
        // Or an error occures when you load more.
        if (this.publicEvents.continuationMarker){
          if (this.publicEvents.records[this.publicEvents.records.length - 1] === record ){
            this.publicEvents.records.pop();
          }
        }

        // Remove the published event from the privateEvents array
        let indexToDelete = this.privateEvents.records.findIndex( element => {
          return element.recordName === eventRecord.recordName;
        });
        if (indexToDelete > -1) this.privateEvents.records.splice(indexToDelete, 1);
        $scope.$apply();

      }).catch( err => {
        // TODO: Revert to previous value and alert user that delete failed
        console.log('publish ERROR trying to delete from PRIVATE', err);
      });
    }).catch( err => {
      // TODO: Revert to previous value and alert the user that save failed
      console.log('publish ERROR trying to save in PUBLIC', err);
    });
  };

}
