import template from './image-upload.html';
import styles from './image-upload.scss';

export default {
  template,
  bindings: {
    record: '<',
    edit: '&'
  },
  controller: ['ckassetService', '$scope', controller]
};

function controller(ckassetService, $scope){
  // ------------------------------ Properties ------------------------------ //
  this.styles = styles;
  this.boxtext = 'Drag and drop an image file';
  this.imagetype = '';
  this.imagedata = null;

  // ------------------------------- Methods -------------------------------- //
  this.dodrop = ondrop;
  this.sendRequest = sendRequest;

  // -------------------------- Function declarions ------------------------- //
  function ondrop(evnt) {

    evnt.stopPropagation();
    evnt.preventDefault();

    // Set files on input-file HTML element
    let filePath = document.getElementById(this.record);
    // dataTranfser is a property on all drag events
    filePath.files = evnt.dataTransfer.files;

    if (evnt.dataTransfer.files.length > 0){
      this.boxtext = evnt.dataTransfer.files[0].name;
      $scope.$apply();
    }

  };

  function sendRequest(){
    let filePath = document.getElementById(this.record);

    // Guard against no files
    if (filePath.files.length < 1) return;

    let file = filePath.files[0];

    // Save Content-Type, to be given to ckasset method
    // TODO: guard against non-image Content-Types
    this.imagetype = file.type;

    var fileReader = new FileReader();
    fileReader.onloadend = element => {

      ckassetService.request()
      .then( tokenResponseDictionary => {

        // Give image data to image-crop component
        this.imagedata = element.target.result;

        var data = new Uint8Array(element.target.result);


        ckassetService.upload(tokenResponseDictionary.data.tokens[0].url, data, this.imagetype, assetDictionary => {
          const { recordName } = tokenResponseDictionary.data.tokens[0];
          const { name } = filePath.files[0];
          const { singleFile } = assetDictionary.data;
          const referenceObj = { type: 'REFERENCE', value: { recordName: this.record, action: 'DELETE_SELF' } };
          ckassetService.modify(name, referenceObj, recordName, singleFile, finalObj => {  //eslint-disable-line
            // this.edit({ image: { field: 'imageRef', recordname: recordName } });
          });
        });
      });
    };

    fileReader.readAsArrayBuffer(file);
  };

}
