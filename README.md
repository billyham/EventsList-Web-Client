## EventsList Web Client

This is an angular web app client for managing the iCloud content of an iOS app. EventsList is an iOS app that displays event listings for a theater. This web client would be used by a staff person at the theater for loading new event information or editing existing events.

See the corresponding [GitHub Repo](https://github.com/billyham/EventsList-iOS-Client) for the iOS app.

The following are required environment variables. These will be specific to your iCloud account and can be generated from the CloudKit dashboard.
- API_TOKEN
- CLOUD_ID

To run in a browser for development (on port 8080):
`npm run start`

To build static files for deployment:
`npm run build`

This web app does not require a web server, all of its persistent data is saved to iCloud. 
