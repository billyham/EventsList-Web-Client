export default function() {
  return {
    scope: false,
    link: function(scope, element, attrs) {  //eslint-disable-line
      // scope -> Access to the Angular controller's properties and methods
      // element -> The HTML element
      // attrs -> attributes (keys and values) of the HTML element
      element.bind('dragstart', function(event){
        scope.$ctrl.onDragStart(event);
      });
    }
  };

}
