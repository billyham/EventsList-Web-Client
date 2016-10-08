// =============================================================================
// A service that responds with a boolean to inform the caller whether or
// not the user is currently signed in. It does so by looking for the local
// Cloud ID cookie.
// =============================================================================

auth.$inject = ['$cookies'];

export default function auth($cookies){

  return {
    isSignedIn(){
      return !!$cookies.get(process.env.CLOUD_ID);
    }

  };

}
