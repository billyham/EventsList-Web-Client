export default function() {
  return {
    scope: false,
    link: function(scope, element){
      element.bind('touchcancel', function(event){
        event.preventDefault();
        event.stopPropagation();
        scope.$ctrl.onTouchCancel(event);
      });
    }
  };
}
