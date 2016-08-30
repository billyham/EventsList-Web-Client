import template from './event.html';
import styles from './event.scss';

export default {
  template,
  bindings: {
    imageRef: '<',
    video: '<',
    title: '=',
    record: '<'
  },
  controller: ['ckrecord', '$scope', controller]
};

function controller(ckrecord, $scope){
  this.formtitle = this.title.value;
  this.oldTitle = '';
  this.styles = styles;
  this.isSelected = false;

  this.makeSelected = function toggleSelected(){
    this.isSelected = true;
  };

  this.removeSelected = function removeSelected(clickEvent){
    // Prevent the action on the parent div
    clickEvent.cancelBubble = true;
    this.isSelected = false;
  };

  this.editTitle = function editTitle(){
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
    ).then((obj) => {
      // Save new value
      this.title.value = obj.fields.title.value;
      this.record.fields.title.value = obj.fields.title.value;
    }).catch(() => {
      // Revert to previous value
      this.formtitle = this.oldTitle;
      this.record.fields.title.value = this.oldTitle;
      $scope.$apply();
    });

  };

}
