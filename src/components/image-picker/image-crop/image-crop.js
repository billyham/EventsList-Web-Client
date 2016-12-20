import template from './image-crop.html';
import styles from './image-crop.scss';
import exif from 'exif-js';

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
  // ============================== Properties ============================== //
  this.styles = styles;

  var _isEditing =          false;
  var _canvasWidth =        0;
  var _canvasHeight =       0;
  var _overlayOriginX =     0;
  var _overlayOriginY =     0;

  var _resizeRatio =        1;
  var _rawWidth =           0;
  var _rawHeight =          0;
  var _initialPointerX =    0;
  var _initialPointerY =    0;

  var _currentX =           0;
  var _currentY =           0;
  var _previousX =          0;
  var _previousY =          0;

  const initiaWidth = 220, initialHeight = 220;
  _canvasWidth = initiaWidth, _canvasHeight = initialHeight;

  // ================================ Methods =============================== //
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

  // ================================= Init ================================= //
  // Wait for HTML to render, watch for changes to imageData
  $scope.$watch('$ctrl.imagedata', () => {
    this.setSize(initiaWidth, initialHeight);
    _rawWidth = _rawHeight = 0;

    if (!this.imagedata) return;

    const canvas = document.getElementById('canvas-image');
    var ctx = canvas.getContext('2d');

    const dataV = new DataView(this.imagedata);
    if (this.imagetype === 'image/png'){
      _rawWidth = dataV.getUint32(16);
      _rawHeight = dataV.getUint32(20);
    }
    if (this.imagetype === 'image/jpeg'){

      for(let x = 0; x < 40000; x++){
        if (dataV.getUint8(x) === 255){

          // APPO marker
          if(dataV.getUint8(x+1) === 224){
            // console.log('density units: ', dataV.getUint8(11));
            // console.log('x density: ', dataV.getUint16(x + 12));
            // console.log('y density: ', dataV.getUint16(x + 14));
          }

          // Start Of Frame marker
          if (dataV.getUint8(x+1) === 192){
            // console.log('found SOF0 marker at: ', x);
            _rawHeight = dataV.getUint16(x + 5);
            _rawWidth = dataV.getUint16(x + 7);
            // console.log('height and width: ', dataV.getUint16(x + 5), dataV.getUint16(x + 7));
          }

          if(dataV.getUint8(x+1) === 193){
            // console.log('found SOF1 marker at: ', x);
            _rawHeight = dataV.getUint16(x + 5);
            _rawWidth = dataV.getUint16(x + 7);
          }

          if(dataV.getUint8(x+1) === 194){
            // console.log('found SOF2 marker at: ', x);
            _rawHeight = dataV.getUint16(x + 5);
            _rawWidth = dataV.getUint16(x + 7);
          }

          //Start Of Scan marker, stop looking for markers
          if (dataV.getUint8(x+1) === 218) break;
        }
        // if (x === 39999) console.log('more than 40000 bytes');
      }

      // Override raw JPEG and PNG header info if exif data exists
      const exifObj = exif.readFromBinaryFile(this.imagedata);
      // console.log('exif: ', exifObj);
      if (exifObj && exifObj.PixelXDimension && exifObj.PixelYDimension){
        _rawWidth = exifObj.PixelXDimension;
        _rawHeight = exifObj.PixelYDimension;
      }
    }

    // Guard against images that are too small
    if (_rawWidth === 0 && _rawHeight === 0) console.log('failed to read image dimensions');
    if (_rawWidth < 440 || _rawHeight < 440){
      this.showError = true;
      this.clearImage();
      return;
    }

    // Identify the resize-ratio and aspect ratio
    let aspectRatio = 1;
    let landscape = _rawWidth >= _rawHeight;
    const big = landscape ? _rawWidth : _rawHeight;
    const small = landscape ? _rawHeight : _rawWidth;
    aspectRatio = big / small;
    _resizeRatio = landscape ? _rawHeight / 440 : _rawWidth / 440;

    const finalWidth = landscape ? _canvasWidth * aspectRatio : _canvasWidth;
    const finalHeight = landscape ? _canvasHeight : _canvasHeight * aspectRatio ;

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
    this.drawOverlay();
    // Create an initial cropped image
    this.drawCroppedCanvas();
  });

  // ========================= Function declarations ======================== //
  // Set size of image canvas and container elements based on raw image size
  function setSize(setWidth, setHeight){

    const collectionOfElements = document.getElementsByClassName('image-initial-size');
    for (let n = 0; n < collectionOfElements.length; n++) {
      collectionOfElements[n].style.width = `${setWidth}px`;
      collectionOfElements[n].style.height = `${setHeight}px`;
    }

    const canvas = document.getElementById('canvas-image');
    _canvasWidth = canvas.width = setWidth;
    _canvasHeight = canvas.height = setHeight;

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
    canvas.width = _canvasWidth;
    canvas.height = _canvasHeight;

    // If no event was provided, create an initial overlay, centered
    if (!event){
      _previousX = _currentX = _canvasWidth / 2;
      _previousY = _currentY = _canvasHeight / 2;
    }else{
      _currentX = _previousX + (event.pageX - _initialPointerX);
      _currentY = _previousY + (event.pageY - _initialPointerY);

      // Accommodate touch events
      if (event.touches && event.touches.length > 0){
        _currentX = _previousX + (event.touches.item(0).pageX - _initialPointerX);
        _currentY = _previousY + (event.touches.item(0).pageY - _initialPointerY);
      }
    }

    // Keep overlay rect in the frame
    if (_currentX < cropHalf) _currentX = cropHalf;
    if (_currentX > _canvasWidth - cropHalf) _currentX = _canvasWidth - cropHalf;
    if (_currentY < cropHalf) _currentY = cropHalf;
    if (_currentY > _canvasHeight - cropHalf) _currentY = _canvasHeight - cropHalf;

    // Draw cropping frame
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'white';
    ctx.strokeRect(_currentX - cropHalf, _currentY - cropHalf, cropSize, cropSize);
    // Draw semi-transparent overlay on cropped out parts of image
    let landscape = _rawWidth >= _rawHeight;
    ctx.fillStyle = 'hsla(1, 1%, 1%, 0.4)';
    ctx.fillRect(0, 0, landscape ? _currentX - cropHalf : _canvasWidth, landscape ? _canvasHeight : _currentY - cropHalf);
    ctx.fillRect(landscape ? _currentX + cropHalf : 0, landscape ? 0 : _currentY + cropHalf, canvas.width, canvas.height);

    // Save origin at full size resolution
    _overlayOriginX = (_currentX - cropHalf) * 2;
    _overlayOriginY = (_currentY - cropHalf) * 2;
  }

  function onMouseDown(event){
    _isEditing = true;
    _initialPointerX = event.pageX;
    _initialPointerY = event.pageY;

    // Accommodate touch events
    if (event.touches && event.touches.length > 0){
      _initialPointerX = event.touches.item(0).pageX;
      _initialPointerY = event.touches.item(0).pageY;
    }

    this.drawOverlay(event);
  }

  function onMouseMove(event){
    if (!_isEditing) return;
    this.drawOverlay(event);
  }

  function onMouseUp(){
    if (_isEditing) this.drawCroppedCanvas();
    _isEditing = false;
    _previousX = _currentX;
    _previousY = _currentY;
  }

  function onMouseLeave(){
    if (_isEditing) this.drawCroppedCanvas();
    _isEditing = false;
    _previousX = _currentX;
    _previousY = _currentY;
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
        _overlayOriginX * _resizeRatio,
        _overlayOriginY * _resizeRatio,
        440 * _resizeRatio,
        440 * _resizeRatio,
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
          $window.URL.revokeObjectURL(imageForDraw.src);
        };
        fileReader.readAsArrayBuffer(blob);
      }, 'image/png');
    };
  }

}
