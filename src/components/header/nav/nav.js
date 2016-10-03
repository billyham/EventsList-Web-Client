import template from './nav.html';
import styles from './nav.scss';

export default {
  template,
  bindings: {

  },
  controller: [controller]
};

function controller() {
  this.styles = styles;
}
