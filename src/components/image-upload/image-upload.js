import template from './image-upload.html';
import styles from './image-upload.scss';

export default {
  template,
  bindings: {
    record: '<',
    edit: '&'
  },
  controller: ['ckassetService', controller]
};

function controller(ckassetService){
  this.styles = styles;
  this.sendRequest = function sendRequest(){

    let filePath = document.getElementById(this.record);
    let file = filePath.files[0];

    var fileReader = new FileReader();

    fileReader.onloadend = element => {

      ckassetService.request()
      .then( tokenResponseDictionary => {

        var data = new Uint8Array(element.target.result);

        ckassetService.upload(tokenResponseDictionary.data.tokens[0].url, data, assetDictionary => {
          const recordName = tokenResponseDictionary.data.tokens[0].recordName;
          const fileName = filePath.files[0].name;
          const { singleFile } = assetDictionary.data;
          const referenceObj = { type: 'REFERENCE', value: { recordName: this.record, action: 'DELETE_SELF' } };
          ckassetService.modify(fileName, referenceObj, recordName, singleFile, finalObj => {  //eslint-disable-line
            this.edit({ image: { field: 'imageRef', recordname: recordName } });
          });
        });
      });
    };

    fileReader.readAsArrayBuffer(file);
  };

}
