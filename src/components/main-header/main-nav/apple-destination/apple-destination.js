export default {
  controller: ['$document', controller]
};

function controller($document) {

  var targetobj = $document.find('aside');
  // console.log(targetobj);
  targetobj.detach();
  $document.find('apple-destination').append(targetobj);

}
