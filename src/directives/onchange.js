export default function(){
  return{
    scope: false,
    link: function(scope, element){
      element.bind('change', () => {
        // Provide input files to change handler
        scope.$ctrl.onChange(element[0].files);
      });
    }
  };
}
