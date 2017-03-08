import template from './event-page.html';
import styles from './event-page.scss';

export default {
  template,
  bindings: {
    publicEvents: '=',
    privateEvents: '=',
    userIdentity: '<',
  },
  controller: ['ngDialog', 'eventPublishService', '$scope', 'ckauthenticateService', 'ckqueryService', '$timeout', controller]
};

function controller(ngDialog, eventPublishService, $scope, ckauthenticateService, ckqueryService, $timeout) {
  // ============================== Properties ============================== //
  this.styles = styles;
  this.typepublic = 'PUBLIC';
  this.typeprivate = 'PRIVATE';

  // =============================== Methods ================================ //
  this.showadd = showadd;
  this.publish = publish;

  // ============================ Initialization ============================ //
  this.$onInit = () => {

    if (this.userIdentity) {
      ckauthenticateService.fetchCurrentName()
      .then(name => this.userName = name)
      .catch(err => console.log('eventPage > onInit failed to fetch current name: ', err));
    }

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
            if (a.title.toUpperCase() > b.title.toUpperCase()) return 1;
            if (a.title.toUpperCase() < b.title.toUpperCase()) return -1;
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
   * @param  {Object}   rec  An event record object with three properties:
   *                         eventRecord   {Program} Program model object
   *                         imageRecord   {Object}  Image model object, value may be NULL
   *                         isPublished   {boolean} "true" if event is changed to the Published
   *                                                  state. "false" if event is changed to Draft.
   */
  function publish(rec){

    const { eventRecord, imageRecord, isPublished } = rec;

    const toEventsArray = isPublished ? this.publicEvents : this.privateEvents;
    const fromEventsArray = isPublished ? this.privateEvents : this.publicEvents;

    eventPublishService.publish(eventRecord, imageRecord, !isPublished)
    .then( record => {

      // TODO: Alert the user when publish fails
      if (!record) {
        if (rec.cb) return rec.cb(new Error('eventPage > publish did not execute with a valid Record'));
      }

      // Add the published item to the publicEvents array and sort.
      toEventsArray.records.push(record);
      toEventsArray.records.sort( (a,b) => {
        if (a.title.toUpperCase() > b.title.toUpperCase()) return 1;
        if (a.title.toUpperCase() < b.title.toUpperCase()) return -1;
        return 0;
      });

      // If a continuationMarker exists and the object
      // is at the end of the array, don't add it.
      // Or an error occurs when you load more.
      if (toEventsArray.continuationMarker){
        if (toEventsArray.records[toEventsArray.records.length - 1] === record ){
          toEventsArray.records.pop();
        }
      }

      // Remove the published event from the original array.
      // Can't use $apply as it throws an error when an event with an image is
      // (un)published. $timeout tells Angular to safely start a new digest cycle.
      $timeout( () => {
        let indexToDelete = fromEventsArray.records.findIndex( element => {
          return element.recordName === eventRecord.recordName;
        });
        if (indexToDelete > -1) fromEventsArray.records.splice(indexToDelete, 1);
      });
      if (rec.cb) rec.cb();

    }).catch( err => {
      // TODO: Alert the user that (un)publish failed
      if (rec.cb) rec.cb(err);
    });
  };

}
