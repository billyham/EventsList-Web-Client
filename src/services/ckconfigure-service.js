ckconfigureService.$inject = [];

export default function ckconfigureService(){

  return {
    configure(){

      CloudKit.configure({
        locale: 'en-us',

        containers: [{
          // Change this to a container identifier you own.

          //TODO: Using .env variables is pointless, the values are sent to the browser
          //TODO: Also process.env.CLOUD_ID is replaced during the Build script with 
          // the acutal values via the EnvironmentPlugin which under the hood
          // searches for and replaces string values during the webpack build.
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
    }
  };
}
