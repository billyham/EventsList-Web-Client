import template from './event.html';
import styles from './event.scss';

export default {
  template,
  bindings: {
    record: '<',
    remove: '&',
    dbType: '<',
    publish: '&'
  },
  controller: ['ckrecordService', 'ckqueryService', '$scope', '$window', 'ngDialog', controller]
};

function controller(ckrecordService, ckqueryService, $scope, $window, ngDialog){
  // ------------------------------ Properties ------------------------------ //
  this.styles = styles;
  this.isSelected = false;
  this.imageVisible = true;

  // -------------------------------- Methods ------------------------------- //
  this.renderImage = renderImage;
  this.delete = deleteEvent;
  this.edit = edit;
  this.play = play;
  this.makeSelected = makeSelected;
  this.removeSelected = removeSelected;
  this.showAddImage = showAddImage;

  // ---------------------------- Initialization ---------------------------- //
  // Set values for UI elements
  this.formtitle = this.record.fields.title.value;
  if (this.record.fields.video) this.formvideo = this.record.fields.video.value;
  if (this.record.fields.fulldescription) this.formfulldescription = this.record.fields.fulldescription.value;
  this.imagesrc = '';

  // Save initial values in case editing fails
  this.oldValue = '';
  this.oldVideo = '';
  this.oldRecord = {};

  // Load images on launch
  if (this.record.fields.imageRef){
    renderImage.call(this);
  }

  // Load image when event is published
  $scope.$watch('$ctrl.dbType', () => {
    if (this.record.fields.imageRef){
      renderImage.call(this);
    }
  });

  // ------------------------- Function declarations ------------------------ //
  // Load new URL for video
  function play(clickEvent){
    if (clickEvent) clickEvent.cancelBubble = true;
    $window.location.href=this.record.fields.video.value;
  };

  // Fetch image from the server only if necessary
  function renderImage(){
    if (!this.imagesrc) {

      ckrecordService.fetch('PUBLIC', this.record.fields.imageRef.value.recordName, '_defaultZone')
      .then( result => {
        // if (result.records.length > 0){
          // this.imagesrc = result.records[result.records.length - 1].fields.image.value.downloadURL;
        this.imagesrc = result.fields.image.value.downloadURL;
        $scope.$apply();

          // TODO: Need to delete any prior images associated with the program.
        // };
      })
      .catch( error => {
        console.log(error);
      });
    }
  };

  // Toggle selection
  function makeSelected(){
    this.isSelected = true;
  };

  // Prevent the action on the parent div
  function removeSelected(clickEvent){
    clickEvent.cancelBubble = true;
    this.isSelected = false;
  };

  // Displays ngDialog for adding a new image
  function showAddImage(){
    const dialog = ngDialog.open({
      template: '<image-upload record="ngDialogData.recordName" edit="pic(image)" close="close()"></image-upload>',
      className: 'ngdialog-theme-default ngdialog-wide-content',
      plain: true,
      data: this.record,
      scope: $scope,    // Note how $scope is passed to the ngDialog
      controller: [ () => {

        $scope.close = function close(){
          dialog.close();
        };
      }]
    });
  }

  // A method used by ndDialog, but needs access to 'This'. Note the fat arrow function.
  $scope.pic = image => {
    this.imagesrc = null;
    this.edit(image.field, image.recordname);

    // New CloudKit objects are not available to the query function for at least a
    // second. CloudKit needs time to index the new records. Image rendering is delayed
    // to allow for that indexing time. Calling renderImage needs explicit context because
    // $timeout overrides implicit context.
    // var renderImageWithContext = this.renderImage.bind(this);
    // $timeout(renderImageWithContext, 1000);
    $scope.close();
  };

  // Edit event
  function edit(field, recordname){

    // Set form inputs back to pristine
    $scope.textform.$setPristine();

    // Clone the original record
    this.oldRecord = JSON.parse(JSON.stringify(this.record));

    if (field === 'text'){
      // It assured that the title field exists
      this.record.fields['title'].value = this.formtitle;

      // All other fields are optional
      if (this.formfulldescription){
        if (!this.record.fields['fulldescription']) this.record.fields['fulldescription'] = {type: 'STRING'};
        this.record.fields['fulldescription'].value = this.formfulldescription;
      }

      if (this.formvideo){
        if (!this.record.fields['video']) this.record.fields['video'] = {type: 'STRING'};
        this.record.fields['video'].value = this.formvideo;
      }
    }else if(field === 'imageRef'){

      if (!this.record.fields[field]) this.record.fields[field] = { type: 'REFERENCE' };
      this.record.fields[field].value = { recordName: recordname, action: 'NONE' };
    }

    // Save event
    ckrecordService.save(
      this.dbType,                    // databaseScope
      this.record.recordName,         // recordName,
      this.record.recordChangeTag,    // recordChangeTag
      this.record.recordType,         // recordType
      null,                           // zoneName,
      null,                           // forRecordName,
      null,                           // forRecordChangeTag,
      null,                           // publicPermission,
      null,                           // ownerRecordName,
      null,                           // participants,
      null,                           // parentRecordName,
      this.record.fields
    ).then( obj => {
      // Save new value
      this.record = obj;

      // Load image if necessary
      if (field === 'imageRef') this.renderImage();

      // TODO: Show confirmation that a change has been made
    }).catch( () => {

      // Update UI fields
      if (field === 'text') {
        this.formtitle = this.oldRecord.fields['title'].value;
        this.formvideo = this.oldRecord.fields['video'] ? this.oldRecord.fields['video'].value : '';
        this.formfulldescription = this.oldRecord.fields['fulldescription'] ? this.oldRecord.fields['fulldescription'].value : '';
      }

      // Revert record
      this.record = this.oldRecord;

      // TODO: Alert user that saving failed
      $scope.$apply();
    });
  };

  // Delete event
  function deleteEvent(){
    ckrecordService.delete(
      this.dbType,                // databaseScope
      this.record.recordName,     // recordName
      null,                       // zoneName
      null                        // ownerRecordName
    ).then( () => {
      let record = this.record;
      this.remove({ rec: record });
    }).catch( () => {
      // TODO: Alert user that delete failed
    });
  }

}
