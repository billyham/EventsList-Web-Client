export default function() {
  return {
    scope: false,
    link: function(scope, element){
      element.bind('touchend', function(event){
        event.preventDefault();
        event.stopPropagation();
        scope.$ctrl.onTouchEnd(event);
      });
    }
  };
}
