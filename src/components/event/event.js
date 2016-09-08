import template from './event.html';
import styles from './event.scss';

export default {
  template,
  bindings: {
    record: '<'
  },
  controller: ['ckrecord', '$scope', controller]
};

function controller(ckrecord, $scope){
  this.styles = styles;

  // State
  this.isSelected = false;
  this.imageVisible = false;

  // Methods
  this.showimage = showImage;
  this.delete = deleteEvent;
  this.editTitle = editTitle;

  // Set values for UI elements
  this.formtitle = this.record.fields.title.value;
  if (this.record.fields.video) this.formvideo = this.record.fields.video.value;
  this.showtext = 'Show Image';
  this.imagesrc = '';

  // Save initial values in case editing fails
  this.oldTitle = '';
  this.oldVideo = '';

  // Load images on launch
  if (this.record.fields.imageRef){
    showImage.call(this);
  }

  function showImage(clickEvent){
    // fetch image from the server only if necessary
    if (!this.imagesrc) {
      ckrecord.fetch('PUBLIC', this.record.fields.imageRef.value.recordName, '_defaultZone')
      .then( obj => {
        this.imagesrc = obj.fields.image.value.downloadURL;
        $scope.$apply();
      })
      .catch( error => {
        console.log(error);
      });
    }

    if (!this.imageVisible){
      this.showtext = 'Hide Image';
    }else{
      this.showtext = 'Show Image';
    }
    this.imageVisible = !this.imageVisible;

    if (clickEvent) clickEvent.cancelBubble = true;
  };

  this.makeSelected = function toggleSelected(){
    this.isSelected = true;
  };

  this.removeSelected = function removeSelected(clickEvent){
    // Prevent the action on the parent div
    clickEvent.cancelBubble = true;
    this.isSelected = false;
  };

  function editTitle(){
    this.oldTitle = this.record.fields.title.value;

    this.record.fields.title.value = this.formtitle;
    ckrecord.save(
      'PUBLIC', //databaseScope
      this.record.recordName, // recordName,
      this.record.recordChangeTag, // recordChangeTag
      this.record.recordType, //recordType
      null, //zoneName,
      null, //forRecordName,
      null, //forRecordChangeTag,
      null, //publicPermission,
      null, //ownerRecordName,
      null, //participants,
      null, //parentRecordName,
      this.record.fields
    ).then( obj => {
      // Save new value
      this.record = obj;
    }).catch( () => {
      // Revert to previous value
      this.formtitle = this.oldTitle;
      this.record.fields.title.value = this.oldTitle;
      // TODO: Alert user that saving failed
      $scope.$apply();
    });
  };

  function deleteEvent(){
    ckrecord.delete(
      'PUBLIC',  // databaseScope
      this.record.recordName,  // recordName
      null,  // zoneName
      null  //ownerRecordName
    ).then( () => {
      // Successfully deleted
      // TODO: update UI by removing event from list
    }).catch( () => {
      // TODO: Alert user that delete failed
    });
  }

}
