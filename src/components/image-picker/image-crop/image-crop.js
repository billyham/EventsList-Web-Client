import template from './image-crop.html';
import styles from './image-crop.scss';

export default {
  template,
  bindings: {
    imagedata: '<',
    imagetype: '<',
    clearImage: '&',
    showError: '='
  },
  controller: ['$document', '$scope', controller]
};

function controller($document, $scope) {
  // ------------------------------ Properties ------------------------------ //
  this.styles = styles;
  this.isEditing = false;
  this.canvasWidth = 0;
  this.canvasHeight = 0;

  // ------------------------------- Methods -------------------------------- //
  this.setSize = setSize;
  this.tryClear = tryClear;
  this.onMouseMove = onMouseMove;
  this.onMouseDown = onMouseDown;
  this.onMouseUp = onMouseUp;
  this.onMouseLeave = onMouseLeave;
  this.drawCrop = drawCrop;

  // ---------------------------- Initialization ---------------------------- //
  const initiaWidth = 220, initialHeight = 220;
  this.canvasWidth = initiaWidth, this.canvasHeight = initialHeight;

  // Wait for HTML to render, watch for changes to imageData
  $scope.$watch('$ctrl.imagedata', () => {
    this.setSize(initiaWidth, initialHeight);
    if (!this.imagedata) return;

    const canvas = document.getElementById('canvas-image');
    var ctx = canvas.getContext('2d');

    // Make a blob from the image
    const blob = new Blob([this.imagedata], { type: this.imagetype });
    // Make a bitmap from blob
    createImageBitmap(blob)
    .then( imageBitmap => {
      // Guard against images that are too small
      if (imageBitmap.height < 440 || imageBitmap.width < 440){
        this.showError = true;
        this.tryClear();
        return;
      }

      // Identify the resize-ratio
      let ratio = 1;
      let landscape = imageBitmap.width >= imageBitmap.height;
      const big = landscape ? imageBitmap.width : imageBitmap.height;
      const small = landscape ? imageBitmap.height : imageBitmap.width;
      ratio = big / small;

      const finalWidth = landscape ? this.canvasWidth * ratio : this.canvasWidth;
      const finalHeight = landscape ? this.canvasHeight : this.canvasHeight * ratio ;

      // Adjust elements to new size
      this.setSize(finalWidth, finalHeight);

      const xoffset = (this.canvasWidth - finalWidth) / 2;
      const yoffset = (this.canvasHeight - finalHeight) / 2;

      ctx.drawImage(imageBitmap, xoffset, yoffset, finalWidth, finalHeight);
    });
  });

  // ------------------------ Function declarations ------------------------- //
  // Set size of image canvas and container elements based on bitmap size
  function setSize(setWidth, setHeight){

    const collectionOfElements = document.getElementsByClassName('image-initial-size');
    for (let n = 0; n < collectionOfElements.length; n++) {
      collectionOfElements[n].style.width = `${setWidth}px`;
      collectionOfElements[n].style.height = `${setHeight}px`;
    }

    const canvas = document.getElementById('canvas-image');
    this.canvasWidth = canvas.width = setWidth;
    this.canvasHeight = canvas.height = setHeight;

    // Remove any lingering crop overlays
    const overlayCanvas = document.getElementById('canvas-overlay');
    const overlayCtx = overlayCanvas.getContext('2d');
    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
  }

  // Called automatically when image doesn't match mimimum size
  function tryClear(){
    this.clearImage();
    $scope.$apply();
  };

  // Crop overlay canvas
  function drawCrop(event){
    if (!this.isEditing) return;
    // The crop box size
    const cropSize = 220;
    const cropHalf = cropSize / 2;

    const canvas = document.getElementById('canvas-overlay');
    canvas.width = this.canvasWidth;
    canvas.height = this.canvasHeight;

    // ---------------------------------------------------------------------- //
    // courtesy of http://simonsarris.com/blog/510-making-html5-canvas-useful
    var element = canvas, offsetX = 0, offsetY = 0;
  
    if (element.offsetParent !== undefined) {
      do {
        offsetX += element.offsetLeft;
        offsetY += element.offsetTop;
      } while ((element = element.offsetParent));
    }
    let x = event.pageX - offsetX;
    let y = event.pageY - offsetY;
    // ---------------------------------------------------------------------- //

    // Keep the rect in the frame
    if (x < cropHalf) x = cropHalf;
    if (x > this.canvasWidth - cropHalf) x = this.canvasWidth - cropHalf;
    if (y < cropHalf) y = cropHalf;
    if (y > this.canvasHeight - cropHalf) y = this.canvasHeight - cropHalf;

    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'white';
    ctx.strokeRect(x - cropHalf, y - cropHalf, cropSize, cropSize);
  }

  function onMouseDown(event){
    this.isEditing = true;
    this.drawCrop(event);
  }

  function onMouseMove(event){
    this.drawCrop(event);
  }

  function onMouseUp(){
    this.isEditing = false;
  }

  function onMouseLeave(){
    this.isEditing = false;
  }

}
