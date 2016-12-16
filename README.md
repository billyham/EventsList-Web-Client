## EventsList Web Client

_**This project is in-progress**_  
To see a current implementation, visit the [mock site](http://kitschplayer.com/events/)

__A note about security and authentication on the mock site:__
_For authentication, sign in with your Apple account. Any authenticated user can create a new draft event. Only the site's owner is allowed to publish a draft event. Published events are viewable to everyone, draft events are only visible to the authenticated user._  

---
### About EventsList Web Client
This is an angular web app client for managing the iCloud content of an iOS app. EventsList is an iOS app that displays event listings for a theater. This web client would be used by a staff person at the theater for loading new event information or editing existing events.  

This front-end web app uses Apple's CloudKit.js library. CloudKit is implemented as the persistent data store. CloudKit is available for use in web apps when a developer has enabled it for an iOS or macOS project.

See the corresponding [GitHub Repo](https://github.com/billyham/EventsList-iOS-Client) for the iOS app.

---
### Implementation

 - Clone the repo.
 - In the project directory, add dependencies with `npm run install`
 - CloudKit is Apple's cloud-based data store, it requires a registered developer to have an iOS or macOS project with the iCloud/CloudKit entitlements.

The following are required environment variables. These will be specific to your iCloud account and can be generated from the CloudKit dashboard.
- API_TOKEN
- CLOUD_ID

---
### Commands available in the project directory

To run locally in a browser (on port 8080):
`npm run start`

To build static files for deployment:
`npm run build`

For unit tests:
`npm run unit-test`

For linter test:
`npm run lint`

For combined unit and linter tests:
`npm test`

---
### CloudKit Data Model
Record Types & fields:
 - Program
  - title (String)
  - video (String)
  - fulldescription (String)
  - imageRef (Reference)
 - Image440
  - fileName (String)
  - image (Asset)
  - programRef (Reference)
