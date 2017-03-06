import template from './image-picker.html';
import styles from './image-picker.scss';

export default {
  template,
  bindings: {
    record: '<',
    edit: '&',
    dbType: '<',
    deleteImg: '&'
  },
  controller: ['ckassetService', '$scope', 'imageService', 'guardService', controller]
};

function controller(ckassetService, $scope, imageService, guard){
  // ============================== Properties ============================== //
  this.styles = styles;
  this.imagetype = '';
  this.boxtext = 'Drag and drop a JPEG or PNG image file';
  this.imagedata = null;
  this.croppedImageData = null;
  this.recordName = '';
  this.showSizeError = false;
  this.showFileError = false;
  this.fileName = '';
  this.isLoading = false;
  this.hasUploadError = false;

  // =============================== Methods ================================ //
  this.clearImage = clearImage;
  this.onChange = onChange;
  this.onDrop = onDrop;
  this.loadImage = loadImage;
  this.submitRequest = submitRequest;

  // =============================== Init =================================== //


  // ========================== Function declarions ========================= //
  /**
   * Resets the component by removing an existing image selection. Also removes
   * any current error messages.
   *
   * @param  {boolean} hasNoImage Flag to indicate that the component has no
   *                              image selection.
   */
  function clearImage(hasNoImage){
    if (hasNoImage === false) return;
    // Clear properties
    this.imagetype = '';
    this.boxtext = 'Drag and drop a JPEG or PNG image file';
    this.imagedata = null;
    this.recordName = '';
    this.showSizeError = false;
    this.showFileError = false;
    this.hasUploadError = false;
    this.isLoading = false;

    // Clear the value of the file input HTML element
    let filePath = document.getElementById(this.record);
    angular.element(filePath).val('');
  }

  /**
   * Watch for changes in the input-file element
   *
   * @param  {Blob[]} tryFiles  Array of selected files.
   */
  function onChange(tryFiles){
    this.loadImage(tryFiles);
  }

  /**
   * Event handler for receiving drop events. Invokes the onChange event
   * associated with the <input> form item for selecting files, passing along
   * the dragged & dropped files.
   *
   * @param  {Event} evnt   HTML5 Drop event
   */
  function onDrop(evnt) {
    evnt.stopPropagation();
    evnt.preventDefault();
    if (evnt.dataTransfer.files.length < 1) return;

    this.loadImage(evnt.dataTransfer.files);
  };

  /**
   * Upon receiving an array of images as raw data Blobs, creates a FileReader and
   * attempts to read the first item in the array as an ArrayBuffer. Invokes a
   * digest cycle to update the UI by rendering the image as a selection.
   *
   * @param  {Blob[]} tryFiles  Array of image files.
   */
  function loadImage(tryFiles){

    this.showSizeError = false;
    this.showFileError = false;
    this.fileName = '';

    if (!tryFiles || tryFiles.length < 1) return;

    let file = tryFiles[0];

    // TODO: Guard against unrecognized image types
    this.imagetype = file.type;

    // Save file name, to be given to imageService method
    // TODO: Display the filename as a confirmation of the file choice
    this.fileName = file.name;

    var fileReader = new FileReader();
    fileReader.onloadend = element => {
      // Give image data to image-crop component
      this.imagedata = element.target.result;
      $scope.$apply();
    };

    fileReader.readAsArrayBuffer(file);
  };

  /**
   * Attempts to upload the image data to the cloud store and if successful,
   * invokes the edit() function passed to the modal window with the Image440
   * model object returned from the cloud store.
   *
   * @param  {boolean} hasNoImage   Flag to indicate to image selected.
   */
  function submitRequest(hasNoImage){
    if (hasNoImage === false) return;
    if (!this.croppedImageData) return;

    this.isLoading = true;
    this.hasUploadError = false;

    // Helper function requires 'This' context
    _cloudKitUpload.call(this, (error, imageObj) => {
      this.isLoading = false;
      if (error || !imageObj || !imageObj.recordName) return this.hasUploadError = true;
      this.edit({ image: { field: 'imageRef', recordname: imageObj.recordName, imageObj } });
    });
  }

  /**
   * Error first callback function to indicate completion. First arg is truthy
   * only if the upload fails. Second arg is provided on success as an Image440
   * model object.
   *
   * @callback requestCallback
   * @param {Error}     error
   * @param {Image440}  [imageObj]
   */

  /**
   * Calls upon the imageService to upload the image to cloud store.
   *
   * @param  {requestCallback} cb
   */
  function _cloudKitUpload(cb){

    imageService.upload(this.dbType, this.croppedImageData, this.fileName, this.record)
    .then( finalObj => {
      if (guard.arrayWithMember(finalObj, 'data', 'records')) throw new Error('Failed to upload image');
      if (cb) cb(null, finalObj.data.records[0]);
    })
    .catch( err => {
      // console.log('inside catch');
      if (cb) cb(err);
    });
  }

}
