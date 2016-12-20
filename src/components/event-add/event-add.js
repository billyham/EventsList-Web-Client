import template from './event-add.html';
import styles from './event-add.scss';

export default {
  template,
  bindings:{
    add: '&',
    close: '&'
  },
  controller: ['ckrecordService', '$scope', controller]
};

function controller(ckrecordService, $scope){
  // ============================== Properties ============================== //
  this.styles = styles;
  this.formtitle = '';
  this.formvideo = '';

  // ================================ Methods =============================== //
  this.submit = submit;

  // ========================= Function declarations ======================== //
  function submit(){
    if (!this.formtitle) return;

    var obj = {
      fields: {
        title: {
          value: this.formtitle,
          type: 'STRING'
        }
      }
    };

    if (this.formvideo){
      obj.fields.video = {value: this.formvideo, type: 'STRING'};
    }

    ckrecordService.save(
      'PRIVATE',      //cdatabaseScope, PUBLIC or PRIVATE
      null,           // recordName,
      null,           // recordChangeTag
      'Program',      //recordType
      null,           //zoneName,  null is _defaultZone, PUBLIC databases can only be default
      null,           //forRecordName,
      null,           //forRecordChangeTag,
      null,           //publicPermission,
      null,           //ownerRecordName,
      null,           //participants,
      null,           //parentRecordName,
      obj.fields //fields
    ).then( record => {
      // Save new value
      this.formtitle = '';
      this.formvideo = '';
      $scope.$apply();
      this.add( {rec: record} );
      this.close();
    }).catch((error) => {
      // Revert to previous value
      console.log('addition ERROR', error);
      //TODO: Show message when current user does not have permission.
      // error message will be: 'CREATE operation not permitted'
    });

  };

}
