export default {
  controller: ['$document', controller]
};

function controller($document) {

  var targetobj = $document.find('article');
  targetobj.detach();
  $document.find('apple-destination').append(targetobj);

}
