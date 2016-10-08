import template from './event.html';
import styles from './event.scss';

export default {
  template,
  bindings: {
    record: '<',
    remove: '&'
  },
  controller: ['ckrecord', '$scope', '$window', controller]
};

function controller(ckrecord, $scope, $window){
  this.styles = styles;

  // State properties
  this.isSelected = false;
  this.imageVisible = true;

  // Methods
  this.showimage = showImage;
  this.delete = deleteEvent;
  this.edit = edit;
  this.play = play;
  this.makeSelected = makeSelected;
  this.removeSelected = removeSelected;
  this.pic = pic;

  // Set values for UI elements
  this.formtitle = this.record.fields.title.value;
  if (this.record.fields.video) this.formvideo = this.record.fields.video.value;
  this.showtext = 'Show Image';
  this.imagesrc = '';

  // Save initial values in case editing fails
  this.oldValue = '';
  this.oldVideo = '';

  // Load images on launch
  if (this.record.fields.imageRef){
    showImage.call(this);
  }

  // Load new URL for video
  function play(clickEvent){
    if (clickEvent) clickEvent.cancelBubble = true;
    $window.location.href=this.record.fields.video.value;
  };

  // Fetch image from the server only if necessary
  function showImage(){
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

  function pic(image){
    this.edit(image.field, image.recordname);
  };

  // Edit event
  function edit(field, recordname){

    if (!this.record.fields[field]) this.record.fields[field] = { value: { recordName: recordname, action: 'NONE' }, type: 'REFERENCE' };

    this.oldValue = this.record.fields[field].value;

    if (field === 'title'){
      this.record.fields[field].value = recordname;
    }else if(field === 'imageRef'){
      this.record.fields[field].value = { recordName: recordname, action: 'NONE' };
      this.imagesrc = null;
    }

    // Save event
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
      // Load image in view if necessary
      if (field === 'imageRef') this.showimage();
    }).catch( () => {
      // Revert to previous value
      if (field === 'title') this.formtitle = this.oldValue;
      this.record.fields[field].value = this.oldValue;
      // TODO: Alert user that saving failed
      $scope.$apply();
    });
  };

  // Delete event
  function deleteEvent(){
    ckrecord.delete(
      'PUBLIC',  // databaseScope
      this.record.recordName,  // recordName
      null,  // zoneName
      null  //ownerRecordName
    ).then( () => {
      let record = this.record;
      this.remove({ rec: record });
    }).catch( () => {
      // TODO: Alert user that delete failed
    });
  }

}
