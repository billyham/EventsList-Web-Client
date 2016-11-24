export default function() {
  return {
    scope: false,
    link: function(scope, element){
      element.bind('touchstart', function(event){
        event.preventDefault();
        event.stopPropagation();
        scope.$ctrl.onTouchStart(event);
      });
    }
  };
}
