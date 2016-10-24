ckauthenticateService.$inject = [];

export default function ckauthenticateService(){

  var _subscribers = [];

  return {
    authenticate(){

      // Get the container.
      var container = CloudKit.getDefaultContainer();

      function gotoAuthenticatedState(userIdentity) {

        // Send notifcation to observers
        _subscribers.forEach( handler => {
          handler(userIdentity);
        });

        var name = userIdentity.nameComponents;
        if(name) {
          // displayUserName(name.givenName + ' ' + name.familyName);
        } else {
          // displayUserName('User record name: ' + userIdentity.userRecordName);
        }
        container
        .whenUserSignsOut()
        .then(gotoUnauthenticatedState);
      }
      function gotoUnauthenticatedState(error) {

        // Send notifcation to observers
        _subscribers.forEach( handler => {
          handler(null);
        });

        if(error && error.ckErrorCode === 'AUTH_PERSIST_ERROR') {
          showDialogForPersistError();
        }

        // displayUserName('Unauthenticated User');
        container
        .whenUserSignsIn()
        .then(gotoAuthenticatedState)
        .catch(gotoUnauthenticatedState);
      }

      // Check a user is signed in and render the appropriate button.
      return container.setUpAuth()
      .then(function(userIdentity) {

        // Either a sign-in or a sign-out button was added to the DOM.

        // userIdentity is the signed-in user or null.
        if(userIdentity) {
          gotoAuthenticatedState(userIdentity);
        } else {
          gotoUnauthenticatedState();
        }
        return userIdentity;
      })
      .then(function(userIdentity) {

        var title = null;

        if (userIdentity){
          title = 'UserIdentity for ' + userIdentity.userRecordName + ' is ' +
            (userIdentity.nameComponents || 'non-discoverable');
        } 
        return title;
      });

    },

    subscribe(handler){
      _subscribers.push(handler);
    }
  };
}
