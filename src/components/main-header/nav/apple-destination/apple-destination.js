import template from './apple-destination';

export default {
  template,
  bindings: {

  },
  controller: ['$document', controller]
};

function controller($document) {

  var targetobj = $document.find('article');
  targetobj.detach();
  $document.find('apple-destination').append(targetobj);

}
