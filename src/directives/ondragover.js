export default function(){
  return{
    scope: false,
    link: function(scope, element) {
      element.bind('dragover', function(){
        scope.$ctrl.onDragOver(event);
      });
    }
  };
}
