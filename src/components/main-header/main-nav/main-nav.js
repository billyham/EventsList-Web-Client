import template from './main-nav.html';
import styles from './main-nav.scss';

export default {
  template,
  bindings: {

  },
  controller: ['$document', 'ckauthenticateService', '$scope', controller]
};

function controller($document, ckauthenticateService, $scope) {
  this.styles = styles;
  this.isopen = false;
  this.auth = 'Sign In with Apple ID';

  // Initial setup

  // Observer changes to state of authentication
  ckauthenticateService.subscribe( userIdentity => {
    $scope.$apply( () => {
      this.auth = userIdentity ? 'Logout' : 'Sign In with Apple ID';
    });
  });

  // Methods
  this.togglemenu = function togglemenu(){
    this.isopen = !this.isopen;
  };

  this.signInOut = function signInOut(){
    // Create a new event and give it to the hidden apple button
    const customEvent = new CustomEvent('click');

    // Work around for the fact that the Apple buttons can be layered on each other
    const colLength = $document.find('aside').children().children().length;
    let choosenButton = 0;
    if (colLength > 1){
      if (this.auth === 'Logout'){
        choosenButton = 1;
      }else{
        choosenButton = 0;
      }
    }

    $document.find('aside').children().children()[choosenButton].dispatchEvent(customEvent);
  };
}
