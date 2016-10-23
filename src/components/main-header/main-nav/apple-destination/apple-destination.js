export default {
  controller: ['$document', controller]
};

function controller($document) {

  // Waits until the window is fully loaded with the CloudKit library before
  // moving the apple button.
  window.addEventListener('cloudkitloaded', function() {
    var targetobj = $document.find('aside');
    targetobj.detach();
    $document.find('apple-destination').append(targetobj);
  });



}
