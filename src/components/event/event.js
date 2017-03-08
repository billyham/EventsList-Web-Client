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
  controller: [
    'ckrecordService',
    'ckqueryService',
    '$scope',
    '$window',
    'ngDialog',
    '$timeout',
    'guardService',
    'Program',
    controller
  ]
};

function controller(ckrecordService, ckqueryService, $scope, $window, ngDialog, $timeout, guard, Program){
  // ============================== Properties ============================== //
  this.styles = styles;
  this.isSelected = false;
  this.imageObject = null;
  this.isLoading = false;
  this.hasPublishError = false;
  this.imagesrc = '';

  // ================================ Methods =============================== //
  this.renderImage = renderImage;
  this.delete = deleteEvent;
  this.edit = edit;
  this.play = play;
  this.makeSelected = makeSelected;
  this.removeSelected = removeSelected;
  this.showAddImage = showAddImage;
  this.startPublish = startPublish;

  // Methods passed to an ngDialog controller.
  this.deleteImg = deleteImg.bind(this);
  this.pic = pic.bind(this);

  // ============================ Initialization -=========================== //
  this.$onInit = () => {
    // Set values for UI elements
    this.formtitle = this.record.title;
    if (this.record.video) this.formvideo = this.record.video;
    if (this.record.fulldescription) this.formfulldescription = this.record.fulldescription;
    this.imagesrc = '';

    // Save initial values in case editing fails
    this.oldValue = '';
    this.oldVideo = '';
    this.oldRecord = {};

    // Load images on launch
    if (this.record.imageRef){
      renderImage.call(this);
    }
  };

  // Load image when event is published
  this.$onChanges = (changes) => {
    if (changes.dbType && !changes.dbType.isFirstChange()){
      if (this.record.imageRef){
        this.renderImage();
      }
    }
  };

  // ========================= Function declarations ======================== //
  /**
   * Button event handler for loading the URL of a video to the window location.
   *
   * @param  {Event} clickEvent   Button click event
   */
  function play(clickEvent){
    if (clickEvent) clickEvent.cancelBubble = true;
    $window.location.href=this.record.video;
  };

  /**
   * Renders an image to Event component. Called in onInit() if the event
   * Program record has a reference to an Image440 object. Uses ckrecordService
   * to get the image source URL from CloudKit, then assigns that URL to the
   * image HTML element.
   *
   */
  function renderImage(){
    // Fetch image from the server only if necessary
    if (this.imagesrc) return null;

    ckrecordService.fetch(this.dbType, this.record.imageRef, '_defaultZone')
    .then( result => {
      if (guard.check(result, 'fields', 'image', 'value', 'downloadURL')) return null;

      this.imageObject = result;
      this.imagesrc = result.fields.image.value.downloadURL;
      $scope.$apply();

      // TODO: Need to delete any prior images associated with the program.
    })
    .catch( error => {
      console.log('event > renderImage \nerror on: ', this.formtitle, error);
    });

  };

  /**
   * Changes appearance of Event to the expanded state.
   */
  function makeSelected(){
    this.isSelected = true;
  };

  /**
   * Changes appearance of Event to the collapsed state.
   *
   * @param  {Event} clickEvent   HTML button event
   */
  function removeSelected(clickEvent){
    clickEvent.cancelBubble = true;
    this.isSelected = false;
  };

  /**
   * Displays an ngDialog for adding a new image, or deleting an existing image.
   * The modal inherits the Event's $scope.
   */
  function showAddImage(){
    const dialog = ngDialog.open({
      template: '<image-picker record="ngDialogData.recordName" edit="pic(image)" delete-img="deleteImg()" db-type="\'' + this.dbType + '\'" close="close()"></image-picker>',
      className: 'ngdialog-theme-default ngdialog-wide-content',
      plain: true,
      data: this.record,
      scope: $scope,    // Note how the current scope is passed to the ngDialog
      controller: [ () => {
        $scope.close = function close(){
          dialog.close();
        };
        $scope.pic = this.pic;
        $scope.deleteImg = this.deleteImg;
      }]
    });
  }

  /**
   * Adds an image to Event. Updates the associated Program model object.
   * This method is given to an ngDialog modal view. Accesses Event's edit()
   * method to do the work of updating the datastore and UI.
   *
   * @param  {Object} image   Image440 object, as implemented in CloudKit
   */
  function pic(image){
    if (!image || !image.field || !image.recordname || !image.imageObj){
      return console.log('Error in event > $scope.pic()');
    }

    this.imagesrc = null;
    this.edit(image.field, image.recordname, image.imageObj);
    $scope.close();
  };

  /**
   * Attmepts to save new an edited Program model object to the cloud store.
   *
   * @param  {string} field         "text" or "imageRef"
   * @param  {string} [recordname]  Not used for text changes. For Image update,
   *                                will contain the recordName of the related
   *                                Program Object. Will be null if the update
   *                                is deletion of an image.
   * @param  {Object} [imageObj]    Not used for text changes. For image updates,
   *                                will be an Image440 record object.
   */
  function edit(field, recordname, imageObj){
    // Set form inputs back to pristine
    $scope.textform.$setPristine();

    // Clone the original record
    this.oldRecord = new Program(this.record.toObject());

    if (field === 'text'){
      // It is assured that the title field exists
      this.record.title = this.formtitle;

      // All other fields are optional
      if (this.formfulldescription){
        this.record.fulldescription = this.formfulldescription;
      }

      if (this.formvideo){
        this.record.video = this.formvideo;
      }

    }else if(field === 'imageRef'){
      if (recordname){
        this.record.imageRef = recordname;
        if (imageObj) this.imageObject = imageObj;
      }else{
        // Update the record property in event.
        // Update the imageObject property in event.
        // Update the imagesrc property in event.
        this.record.imageRef = '';
      }
    }

    const recordAsObject = this.record.toObject();
    if (!recordAsObject || !recordAsObject.fields) return null;


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
      recordAsObject.fields
    ).then( obj => {
      // Save new value
      this.record = new Program(obj);

      // Remove image if deleted
      if ((field === 'imageRef') && (!recordname)){
        this.imageObject = null;
        this.imagesrc = '';
        $scope.$apply();
      }else{
        // Load image if necessary
        if (field === 'imageRef') this.renderImage();
      }

      // TODO: Show confirmation that a change has been made
    }).catch( () => {
      // Update UI fields
      if (field === 'text') {
        this.formtitle = this.oldRecord.title;
        this.formvideo = this.oldRecord.video;
        this.formfulldescription = this.oldRecord.fulldescription;
      }

      // Revert record
      this.record = this.oldRecord;

      // TODO: Alert user that saving failed
      $scope.$apply();
    });
  };

  /**
   * Delete the associated Event (including all the related models, i.e., Program
   * and Image440) in the cloud store. Update the UI using the remove()
   * binding from EventList.
   */
  function deleteEvent(){
    ckrecordService.delete(
      this.dbType,                // databaseScope
      this.record.recordName,     // recordName
      null,                       // zoneName
      null                        // ownerRecordName
    ).then( () => {
      let record = this.record;
      this.remove({ rec: record });
    }).catch( err => {
      // TODO: Alert user that delete failed
      throw err;
    });
  }

  /**
   * Changes status of event from Draft to Published or vice-versa. Binding
   * handled in eventPage. With either success or failure, callback fires to
   * end transition animation.
   *
   * @param  {boolean} isPublish true when moving to Published state, false when
   *                             moving to Draft state.
   */
  function startPublish(isPublish){
    this.isLoading = true;
    this.hasPublishError = false;
    this.publish({
      rec:
      {
        eventRecord: this.record,
        imageRecord: this.imageObject,
        isPublished: isPublish,
        cb: () => {
          // On failure, $digest cycle may not get automatically created
          $timeout( () => {
            this.hasPublishError = true;
            this.isLoading = false;
          });
        }
      }
    });
  }

  /**
   * Removes the Image associated to the Program from cloud store.
   * This method is given to an ngDialog modal view. The $scope of the Event
   * controller is given to the ngDialog.
   */
  function deleteImg(){

    // Guard against a non-existent image
    if(!this.record.imageRef) return null;

    // Delete the record from Image440 Record Type cloud store
    ckrecordService.delete(
      this.dbType,                                    // database
      this.record.imageRef,                           // recordName
      null,                                           // zoneName
      null                                            // ownerRecordName
    ).then( () => {

      // delete the Program > imageRef field in cloud store
      this.edit('imageRef');

      $scope.close();

    }).catch( err => {
      // TODO: Alert user if delete fails;
      console.log('event.js > deleteImg error: ', err);
    });
  }

}
