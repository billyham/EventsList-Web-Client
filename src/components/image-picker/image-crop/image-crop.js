import template from './image-crop.html';
import styles from './image-crop.scss';
import EXIF from 'exif-js';

export default {
  template,
  bindings: {
    imagedata: '<',
    croppedImageData: '=',
    imagetype: '<',
    clearImage: '&',
    showError: '='
  },
  controller: ['$document', '$scope', '$window', controller]
};

function controller($document, $scope, $window) {
  // ------------------------------ Properties ------------------------------ //
  this.styles = styles;
  this.isEditing = false;
  this.canvasWidth = 0;
  this.canvasHeight = 0;
  this.imageBitmap = null;
  this.overlayOriginX = 0;
  this.overlayOriginY = 0;
  this.resizeRatio = 1;
  this.rawWidth = 0;
  this.rawHeight = 0;

  // ------------------------------- Methods -------------------------------- //
  this.setSize = setSize;
  this.drawOverlay = drawOverlay;
  this.drawCroppedCanvas = drawCroppedCanvas;
  // Mouse events
  this.onMouseDown = onMouseDown;
  this.onMouseMove = onMouseMove;
  this.onMouseUp = onMouseUp;
  this.onMouseLeave = onMouseLeave;
  // Touch events
  this.onTouchStart = onMouseDown;
  this.onTouchMove = onMouseMove;
  this.onTouchEnd = onMouseUp;
  this.onTouchCancel = onMouseLeave;

  // ---------------------------- Initialization ---------------------------- //
  const initiaWidth = 220, initialHeight = 220;
  this.canvasWidth = initiaWidth, this.canvasHeight = initialHeight;

  // Wait for HTML to render, watch for changes to imageData
  $scope.$watch('$ctrl.imagedata', () => {
    this.setSize(initiaWidth, initialHeight);

    if (!this.imagedata) return;

    const canvas = document.getElementById('canvas-image');
    var ctx = canvas.getContext('2d');

    const dataV = new DataView(this.imagedata);
    if (this.imagetype === 'image/png'){
      this.rawWidth = dataV.getUint32(16);
      this.rawHeight = dataV.getUint32(20);
    }
    if (this.imagetype === 'image/jpeg'){
      const exifObj = EXIF.readFromBinaryFile(this.imagedata);
      if (!exifObj){
        for(let x = 0; x < 4000; x++){
          if (dataV.getUint8(x) === 255){
            if (dataV.getUint8(x+1) === 192){
              this.rawHeight = dataV.getUint16(x + 5);
              this.rawWidth = dataV.getUint16(x + 7);
              break;
            // }else if(dataV.getUint8(x+1) === 194){
            //   console.log('found SOF2 marker at: ', x);
            }
          }
        }
      }else{
        this.rawWidth = exifObj.PixelXDimension;
        this.rawHeight = exifObj.PixelYDimension;
      }
    }

    // Guard against images that are too small
    if (this.rawWidth < 440 || this.rawHeight < 440){
      this.showError = true;
      this.clearImage();
      return;
    }

    // Identify the resize-ratio and aspect ratio
    let aspectRatio = 1;
    let landscape = this.rawWidth >= this.rawHeight;
    const big = landscape ? this.rawWidth : this.rawHeight;
    const small = landscape ? this.rawHeight : this.rawWidth;
    aspectRatio = big / small;
    this.resizeRatio = landscape ? this.rawHeight / 440 : this.rawWidth / 440;

    const finalWidth = landscape ? this.canvasWidth * aspectRatio : this.canvasWidth;
    const finalHeight = landscape ? this.canvasHeight : this.canvasHeight * aspectRatio ;

    // Adjust elements to new size
    this.setSize(finalWidth, finalHeight);

    const imageForDraw = new Image(finalWidth, finalHeight);
    const blobForDraw = new Blob([this.imagedata], { type: this.imagetype });
    imageForDraw.src = $window.URL.createObjectURL(blobForDraw);
    imageForDraw.onload = function(){
      // Draw the image canvas
      ctx.drawImage(imageForDraw, 0, 0, finalWidth, finalHeight);
    };

    // Draw an initial overlay
    this.drawOverlay({pageX: 0, pageY: 0});
    // Create an initial cropped image
    this.drawCroppedCanvas();
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

  // Crop overlay canvas
  function drawOverlay(event){
    // The crop box size
    const cropSize = 220;
    const cropHalf = cropSize / 2;

    const canvas = document.getElementById('canvas-overlay');
    canvas.width = this.canvasWidth;
    canvas.height = this.canvasHeight;

    // ---------------------------------------------------------------------- //
    // courtesy of http://simonsarris.com/blog/510-making-html5-canvas-useful
    // TODO: Need to factor in the movement of the angular model window
    var element = canvas, offsetX = 0, offsetY = 0;
    if (element.offsetParent !== undefined) {
      do {
        offsetX += element.offsetLeft;
        offsetY += element.offsetTop;
      } while ((element = element.offsetParent));
    }

    let x = event.pageX - (offsetX + $window.scrollX);
    let y = event.pageY - (offsetY + $window.scrollY);

    // Accommodate touch events
    if (event.touches && event.touches.length > 0){
      x = event.touches.item(0).pageX - (offsetX + $window.scrollX);
      y = event.touches.item(0).pageY - (offsetY + $window.scrollY);
    }
    // ---------------------------------------------------------------------- //

    // Keep overlay rect in the frame
    if (x < cropHalf) x = cropHalf;
    if (x > this.canvasWidth - cropHalf) x = this.canvasWidth - cropHalf;
    if (y < cropHalf) y = cropHalf;
    if (y > this.canvasHeight - cropHalf) y = this.canvasHeight - cropHalf;

    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'white';
    ctx.strokeRect(x - cropHalf, y - cropHalf, cropSize, cropSize);

    this.overlayOriginX = (x - cropHalf) * 2;
    this.overlayOriginY = (y - cropHalf) * 2;
  }

  function onMouseDown(event){
    this.isEditing = true;
    this.drawOverlay(event);
  }

  function onMouseMove(event){
    if (!this.isEditing) return;
    this.drawOverlay(event);
  }

  function onMouseUp(){
    if (this.isEditing) this.drawCroppedCanvas();
    this.isEditing = false;
  }

  function onMouseLeave(){
    if (this.isEditing) this.drawCroppedCanvas();
    this.isEditing = false;
  }

  function drawCroppedCanvas(){
    const croppedCanvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');
    croppedCanvas.width = 440;
    croppedCanvas.height = 440;

    const imageForDraw = new Image();
    const blobForDraw = new Blob([this.imagedata], { type: this.imagetype });
    imageForDraw.src = $window.URL.createObjectURL(blobForDraw);
    imageForDraw.onload = () => {

      const cropCtx = croppedCanvas.getContext('2d');
      cropCtx.drawImage(
        imageForDraw,
        this.overlayOriginX * this.resizeRatio,
        this.overlayOriginY * this.resizeRatio,
        440 * this.resizeRatio,
        440 * this.resizeRatio,
        0,
        0,
        440,
        440
      );
      // Convert Canvas > Blob > ArrayBuffer
      // -------------------------------------------------------------------- //
      // toBlob() is NOT available in Safari / WebKit
      // Polyfill courtesy of: https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob
      if (!HTMLCanvasElement.prototype.toBlob) {
        Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
          value: function (callback, type, quality) {

            var binStr = atob( this.toDataURL(type, quality).split(',')[1] ),
              len = binStr.length,
              arr = new Uint8Array(len);

            for (var i=0; i<len; i++ ) {
              arr[i] = binStr.charCodeAt(i);
            }

            callback( new Blob( [arr], {type: type || 'image/png'} ) );
          }
        });
      }
      // -------------------------------------------------------------------- //
      croppedCanvas.toBlob( blob => {
        var fileReader = new FileReader();
        fileReader.onloadend = element => {
          this.croppedImageData = element.target.result;
        };
        fileReader.readAsArrayBuffer(blob);
      }, 'image/png');
    };
  }

}
