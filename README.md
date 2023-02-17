# react-google-calendar-api

![Build Status](https://travis-ci.com/Insomniiak/react-google-calendar-api.svg?branch=master)
![npm (custom registry)](https://img.shields.io/npm/l/express.svg?registry_uri=https%3A%2F%2Fregistry.npmjs.com)
![npm (downloads)](https://img.shields.io/npm/dy/react-google-calendar-api.svg?style=popout)
[![Gitter chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/react-google-calendar-api/community?utm_source=share-link&utm_medium=link&utm_campaign=share-link)

An api to manage your google calendar

## Install

Npm

```
npm install --save react-google-calendar-api
```

yarn

```
yarn add react-google-calendar-api
```

## Use (Javascript / Typescript)

You will need to enable the "Google Calendar API"(https://console.developers.google.com/flows/enableapi?apiid=calendar.)
You will need a clientId and ApiKey from Google(https://developers.google.com/workspace/guides/create-credentials)

```javascript
import ApiCalendar from "react-google-calendar-api";

const config = {
  clientId: "<CLIENT_ID>",
  apiKey: "<API_KEY>",
  scope: "https://www.googleapis.com/auth/calendar",
  discoveryDocs: [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
  ],
};

const apiCalendar = new ApiCalendar(config);
```

## Setup

### handleAuthClick:

```javascript
    /**
     * Sign in with a Google account.
     * @returns {any} A Promise that is fulfilled with the GoogleUser instance when the user successfully authenticates and grants the requested scopes, or rejected with an object containing an error property if an error happened
     */
    public handleAuthClick(): void
```

### handleSignOutClick:

```javascript
    /**
     * Sign out user google account
     */
    public handleSignoutClick(): void
```

#### Example

```javascript
  import React, {ReactNode, SyntheticEvent} from 'react';
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

  export default class DoubleButton extends React.Component {
      constructor(props) {
        super(props);
        this.handleItemClick = this.handleItemClick.bind(this);
      }

      public handleItemClick(event: SyntheticEvent<any>, name: string): void {
        if (name === 'sign-in') {
          apiCalendar.handleAuthClick()
        } else if (name === 'sign-out') {
          apiCalendar.handleSignoutClick();
        }
      }

      render(): ReactNode {
        return (
              <button
                  onClick={(e) => this.handleItemClick(e, 'sign-in')}
              >
                sign-in
              </button>
              <button
                  onClick={(e) => this.handleItemClick(e, 'sign-out')}
              >
                sign-out
              </button>
          );
      }
  }
```

### setCalendar:

```javascript
    /**
     * Set the default attribute calendar
     * @param {string} newCalendar ID.
     */
    public setCalendar(newCalendar: string): void
```

## Manage Event

You need to be registered with handleAuthClick.

### Create Event:

```javascript
    /**
    * Create calendar event
    * @param {string} CalendarId for the event by default use 'primary'.
    * @param {object} Event with start and end dateTime
    * @param {string} sendUpdates Acceptable values are: "all", "externalOnly", "none"
    * @returns {any} Promise on the event.
    */
   public createEvent(event: object, calendarId: string = this.calendar, sendUpdates: string = 'none',): any
```

### Create Event From Now:

```javascript
     /**
     * Create an event from the current time for a certain period.
     * @param {number} Time in minutes for the event
     * @param {string} Summary(Title) of the event
     * @param {string} Description of the event (optional)
     * @param {string} CalendarId by default calendar set by setCalendar.
     * @param {string} timeZone The time zone in which the time is specified. (Formatted as an IANA Time Zone Database name, e.g. "Europe/Zurich".)
     * @returns {any} Promise on the event.
     */
    public createEventFromNow({time, summary, description = ''}: any, calendarId: string = this.calendar, timeZone: string = "Europe/Paris"): any
```

### Create Event With Video Conference:

```javascript
     /**
     * Create Calendar event with video conference
     * @param {object} event with start and end dateTime
     * @param {string} calendarId for the event.
     * @param {string} sendUpdates Acceptable values are: "all", "externalOnly", "none"
     * @returns {any}
     */
  public createEventWithVideoConference(
    event: any,
    calendarId: string = this.calendar,
    sendUpdates: "all" | "externalOnly" | "none" = "none"
  ): any
```

#### Example

```javascript
import ApiCalendar from "react-google-calendar-api";

const config = {
  clientId: "<CLIENT_ID>",
  apiKey: "<API_KEY>",
  scope: "https://www.googleapis.com/auth/calendar",
  discoveryDocs: [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
  ],
};

const apiCalendar = new ApiCalendar(config);

const eventFromNow: object = {
  summary: "Poc Dev From Now",
  time: 480,
};

apiCalendar
  .createEventFromNow(eventFromNow)
  .then((result: object) => {
    console.log(result);
  })
  .catch((error: any) => {
    console.log(error);
  });

const eventWithVideoConference: object = {
  summary: "Event With Google Meet Conference",
  start: {
    dateTime: new Date().toISOString(),
    timeZone: "Europe/Paris",
  },
  end: {
    dateTime: new Date(new Date().getTime() + 3600000).toISOString(),
    timeZone: "Europe/Paris",
  },
};

apiCalendar
  .createEventWithVideoConference(eventWithVideoConference)
  .then((result: object) => {
    console.log(result);
  })
  .catch((error: any) => {
    console.log(error);
  });
```

### List All Upcoming Events:

```javascript
    /**
     * List all events in the calendar
     * @param {number} maxResults to see
     * @param {string} calendarId to see by default use the calendar attribute
     * @returns {any} Promise with the result.
     */
    public listUpcomingEvents(maxResults: number, calendarId: string = this.calendar): any
```

#### Example

```javascript
  // The user need to signIn with Handle AuthClick before
  apiCalendar.listUpcomingEvents(10).then(({ result }: any) => {
    console.log(result.items);
```

### List All Events:

```javascript
    /**
     * List all events in the calendar queried by custom query options
     * See all available options here https://developers.google.com/calendar/v3/reference/events/list
     * @param {object} queryOptions to see
     * @param {string} calendarId to see by default use the calendar attribute
     * @returns {any}
     */
    public listEvents(queryOptions, calendarId = this.calendar): any
```

#### Example

```javascript
  // The user need to signIn with Handle AuthClick before
  apiCalendar.listEvents({
      timeMin: new Date()..toISOString(),
      timeMax: new Date().addDays(10).toISOString(),
      showDeleted: true,
      maxResults: 10,
      orderBy: 'updated'
  }).then(({ result }: any) => {
    console.log(result.items);
  });
```

### Update Event

```javascript
   /**
    * Update Calendar event
    * @param {string} calendarId for the event.
    * @param {string} eventId of the event.
    * @param {object} event with details to update, e.g. summary
    * @param {string} sendUpdates Acceptable values are: "all", "externalOnly", "none"
    * @returns {any} Promise object with result
    */
   public updateEvent(event: object, eventId: string, calendarId: string = this.calendar, sendUpdates: string = 'none'): any
```

#### Example

```javascript
const event = {
  summary: "New Event Title",
};

apiCalendar.updateEvent(event, "2eo85lmjkkd2i63uo3lhi8a2cq").then(console.log);
```

### Delete Event

```javascript
   /**
   * Delete an event in the calendar.
   * @param {string} eventId of the event to delete.
   * @param {string} calendarId where the event is.
   * @returns {any} Promise resolved when the event is deleted.
   */
   public deleteEvent(eventId: string, calendarId: string = this.calendar): any
```

#### Example

```javascript
apiCalendar.deleteEvent("2eo85lmjkkd2i63uo3lhi8a2cq").then(console.log);
```

### Get Event

```javascript
   /**
   * Get Calendar event
   * @param {string} calendarId for the event.
   * @param {string} eventId specifies individual event
   * @returns {any}
   */
   public getEvent(eventId: string, calendarId: string = this.calendar): any
```

#### Example

```javascript
apiCalendar.getEvent("2eo85lmjkkd2i63uo3lhi8a2cq").then(console.log);
```
