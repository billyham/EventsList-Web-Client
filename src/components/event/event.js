import template from './event.html';
import styles from './event.scss';

export default {
  template,
  bindings: {
    imageRef: '<',
    video: '<',
    title: '<'
  },
  controller: [controller]
};

function controller(){
  this.styles = styles;
  this.isSelected = false;
  this.toggleSelected = function toggleSelected(){
    this.isSelected = !this.isSelected;
  };

}
