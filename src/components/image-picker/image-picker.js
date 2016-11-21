import template from './image-picker.html';
import styles from './image-picker.scss';

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
  this.recordName = '';
  this.showError = false;

  // ------------------------------- Methods -------------------------------- //
  this.onDrop = onDrop;
  this.clearImage = clearImage;
  this.loadImage = loadImage;
  this.submitRequest = submitRequest;

  // ------------------------------- Init ----------------------------------- //


  // -------------------------- Function declarions ------------------------- //
  function clearImage(){
    // Clear properties
    this.boxtext = 'Drag and drop an image file';
    this.imagedata = null;
    this.imagetype = '';
    this.recordName = '';
    this.showError = false;

    // Clear the value of the file input HTML element
    let filePath = document.getElementById(this.record);
    angular.element(filePath).val('');
  }

  function onDrop(evnt) {
    evnt.stopPropagation();
    evnt.preventDefault();

    // Set files on input-file HTML element
    let filePath = document.getElementById(this.record);
    // dataTranfser is a property on all drag events
    filePath.files = evnt.dataTransfer.files;

    if (evnt.dataTransfer.files.length < 1) return;

    this.boxtext = evnt.dataTransfer.files[0].name;
    this.imagetype = evnt.dataTransfer.files[0].type;
    this.loadImage();

  };

  function loadImage(){
    this.showError = false;

    let filePath = document.getElementById(this.record);

    // Guard against no files
    if (filePath.files.length < 1) return;
    let file = filePath.files[0];

    // Save Content-Type, to be given to ckasset method
    // TODO: guard against non-image Content-Types
    this.imagetype = file.type;

    var fileReader = new FileReader();
    fileReader.onloadend = element => {
      // Give image data to image-crop component
      this.imagedata = element.target.result;
      $scope.$apply();
    };

    fileReader.readAsArrayBuffer(file);
  };

  function submitRequest(){
    if (!this.imagedata) return;

    // TODO: Provide UI sprite to indicate progress

    // Helper function requires 'This' context
    _cloudKitUpload.call(this, () => {
      if (!this.recordName) return;
      this.edit({ image: { field: 'imageRef', recordname: this.recordName } });
    });
  }

  // Call upon the ckasset service to upload the image to CloudKit,
  // a sequence of three distinct ckasset calls
  function _cloudKitUpload(cb){
    let filePath = document.getElementById(this.record);

    ckassetService.request()
    .then( tokenResponseDictionary => {
      var data = new Uint8Array(this.imagedata);

      ckassetService.upload(tokenResponseDictionary.data.tokens[0].url, data, this.imagetype, assetDictionary => {
        this.recordName = tokenResponseDictionary.data.tokens[0].recordName;
        const { name } = filePath.files[0];
        const { singleFile } = assetDictionary.data;
        const referenceObj = { type: 'REFERENCE', value: { recordName: this.record, action: 'DELETE_SELF' } };
        ckassetService.modify(name, referenceObj, this.recordName, singleFile, finalObj => {  //eslint-disable-line
          if (cb) cb();
        });
      });
    });
  }

}
