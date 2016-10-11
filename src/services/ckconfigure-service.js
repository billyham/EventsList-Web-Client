ckconfigureService.$inject = [];

export default function ckconfigureService(){

  return {
    configure(){

      CloudKit.configure({
        locale: 'en-us',

        containers: [{
          // Change this to a container identifier you own.
          containerIdentifier: process.env.CLOUD_ID,

          apiTokenAuth: {
            // And generate a web token through CloudKit Dashboard.
            apiToken: process.env.API_TOKEN,

            persist: true, // Sets a cookie.

            signInButton: {
              id: 'apple-sign-in-button',
              theme: 'white-with-outline' // Other options: 'white', 'white-with-outline'.
            },

            signOutButton: {
              id: 'apple-sign-out-button',
              theme: 'white-with-outline'
            }
          },
          environment: 'development'
        }]
      });
      // console.log(CloudKit);
    }
  };
}
