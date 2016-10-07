import template from './main.html';
import styles from './main.scss';

export default {
  template,
  bindings: {
  },
  controller: ['$document', controller]
};

function controller($document){
  this.styles = styles;

  var targetobj = $document.find('article');
  targetobj.detach();
  $document.find('footer').append(targetobj);

}
