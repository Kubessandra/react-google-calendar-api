# Changelog

This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 29/05/2022

### Overview
- Migration to the Google OAuth 2 system.
- Enhancement of the typing.
- Enhancement of the management for the config.
- Removing some useful utils / functionnalities because of the compatibility with the new Google Auth API.
- The state of the session(Signin status) cannot be handled by the package anymore.
- Adding a folder with an exemple of using the package.
- New build system of the package using `tsup`

Issues impacted by this update: 
  - [Gapi auth deprecation #81](https://github.com/Kubessandra/react-google-calendar-api/issues/81)
  - [This lib is not working correct anymore #80](https://github.com/Kubessandra/react-google-calendar-api/issues/80)
  - [Migrate to Google Identity Services #77](https://github.com/Kubessandra/react-google-calendar-api/issues/77)
  - [ApiCalendar any type #46](https://github.com/Kubessandra/react-google-calendar-api/issues/46)

### Breaking changes:

- Removing `listenSign`
- Removing `getBasicUserProfile`
- No special import for Typescript anymore, you now have the same import as in `js` with typing included.
- The package need to be initialized now (More flexibility for the handling of the config).

ex: 
```javascript
import ApiCalendar from 'react-google-calendar-api';

const config = {
  "clientId": "<CLIENT_ID>",
  "apiKey": "<API_KEY>",
  "scope": "https://www.googleapis.com/auth/calendar",
  "discoveryDocs": [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
  ]
}

const apiCalendar = new ApiCalendar(config)
// You can use apiCalendar like you were using ApiCalendar before
```