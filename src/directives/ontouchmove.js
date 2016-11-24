export default function() {
  return {
    scope: false,
    link: function(scope, element){
      element.bind('touchmove', function(event){
        event.preventDefault();
        event.stopPropagation();
        scope.$ctrl.onTouchMove(event);
      });
    }
  };
}
