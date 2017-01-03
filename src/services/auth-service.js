/* =============================================================================
   A service that responds with a boolean to inform the caller whether or
   not the user is currently signed in. It does so by looking for the local
   Cloud ID cookie.
   ========================================================================== */

authService.$inject = ['$cookies'];

export default function authService($cookies){

  console.log('authService instatiation fires');

  return {
    isSignedIn(){
      return !!$cookies.get(process.env.CLOUD_ID);
    }

  };

}
