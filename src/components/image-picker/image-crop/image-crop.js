import template from './image-crop.html';
import styles from './image-crop.scss';

export default {
  template,
  bindings: {
    imagedata: '<',
    imagetype: '<'
  },
  controller: ['$document', '$scope', controller]

};

function controller($document, $scope) {
  // ------------------------------ Properties ------------------------------ //
  this.styles = styles;
  this.showerror = false;
  // var _canvas = null;

  // ---------------------------- Initialization ---------------------------- //
  const canvasWidth = 220;
  const canvasHeight = 220;

  // Wait for HTML to render
  $scope.$watch('$ctrl.imagedata', () => {
    this.showerror = false;
    if (!this.imagedata) return;

    const canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    // This is important, a mismatch with CSS will distort the the dimensions
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Make a blob from the image
    const blob = new Blob([this.imagedata], { type: this.imagetype });
    createImageBitmap(blob)
    .then( imageBitmap => {

      // Guard against images that are too small
      if (imageBitmap.height < 440 || imageBitmap.width < 440){
        this.showerror = true;
        return;
      }

      // Identify the resize-ratio
      let ratio = 1;
      let landscape = imageBitmap.width >= imageBitmap.height;
      const big = landscape ? imageBitmap.width : imageBitmap.height;
      const small = landscape ? imageBitmap.height : imageBitmap.width;
      ratio = small / big;

      const finalWidth = landscape ? canvasWidth : canvasWidth * ratio;
      const finalHeight = landscape ? canvasHeight * ratio : canvasHeight;

      const xoffset = (canvasWidth - finalWidth) / 2;
      const yoffset = (canvasHeight - finalHeight) / 2;

      ctx.drawImage(imageBitmap, xoffset, yoffset, finalWidth, finalHeight);
    });

  });



}
