export default function(){
  return{
    scope: false,
    link: function(scope, element){
      element.bind('change', function(){
        scope.$ctrl.onChange();
      });
    }
  };
}
