ckauthenticateService.$inject = [];

export default function ckauthenticateService(){

  var _subscribers = [];

  return {
    authenticate(){

      // Get the container.
      var container = CloudKit.getDefaultContainer();

      function gotoAuthenticatedState(userIdentity) {

        var name = null;

        if(userIdentity.nameComponents) {
          name = `${userIdentity.nameComponents.givenName} ${userIdentity.nameComponents.familyName}`;
        }

        // Send notifcation to observers
        _subscribers.forEach( handler => {
          handler(name);
        });

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
      // console.log('adding a handler');
      _subscribers.push(handler);
    },

    fetchCurrentName() {
      var container = CloudKit.getDefaultContainer();

      // Fetch user's info.
      return container.fetchCurrentUserIdentity()
      .then(function(userIdentity) {
        var name = null;

        if (userIdentity.nameComponents){
          name = `${userIdentity.nameComponents.givenName} ${userIdentity.nameComponents.familyName}`;
        }
        return name;
      });
    }

  };
}
