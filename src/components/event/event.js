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

  this.makeSelected = function toggleSelected(){
    this.isSelected = true;
  };

  this.removeSelected = function removeSelected(clickEvent){
    // Prevent the action on the parent div
    clickEvent.cancelBubble = true;
    this.isSelected = false;
  };

}
