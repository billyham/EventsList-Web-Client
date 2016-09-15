import template from './event-add.html';

export default {
  template,
  bindings:{
    add: '&'
  },
  controller: ['ckrecord', '$scope', controller]
};

function controller(ckrecord, $scope){
  this.formtitle = '';
  this.formvideo = '';

  this.submit = function submit(){
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

    ckrecord.save(
      'PUBLIC', //databaseScope
      null, // recordName,
      null, // recordChangeTag
      'Program', //recordType
      null, //zoneName,
      null, //forRecordName,
      null, //forRecordChangeTag,
      null, //publicPermission,
      null, //ownerRecordName,
      null, //participants,
      null, //parentRecordName,
      obj.fields //fields
    ).then( record => {
      // Save new value
      this.formtitle = '';
      this.formvideo = '';
      $scope.$apply();
      this.add( {rec: record} );
    }).catch((error) => {
      // Revert to previous value
      console.log('addition ERROR');
      console.log(error);
    });

  };

}
