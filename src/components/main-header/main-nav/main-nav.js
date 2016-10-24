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
    $document.find('aside').children().children()[0].dispatchEvent(customEvent);

    // DEPRECATED METHOD
    // var clickEvent = document.createEvent('HTMLEvents');
    // clickEvent.initEvent('click', true, true);
    // $document.find('aside').children().children()[0].dispatchEvent(clickEvent);
  };
}
