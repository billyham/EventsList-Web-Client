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
  // Wait for HTML to render
  $scope.$watch('$ctrl.imagedata', () => {
    this.showerror = false;

    console.log('image-crop $watch fires ', this.imagedata);

    if (!this.imagedata) return;

    // Initialization
    const canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    // This is important, a mismatch with CSS will distort the the dimensions
    canvas.width = 220;
    canvas.height = 220;

    console.log($document.find('canvas'));

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

      const finalWidth = landscape ? 220 : 220 * ratio;
      const finalHeight = landscape ? 220 * ratio : 220;

      // console.log('this is the imageBitmap: ', imageBitmap);
      ctx.drawImage(imageBitmap, 0, 0, finalWidth, finalHeight);
    });

  });



}
