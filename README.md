# react-google-calendar-api

![Build Status](https://travis-ci.com/Insomniiak/react-google-calendar-api.svg?branch=master)
![npm (custom registry)](https://img.shields.io/npm/l/express.svg?registry_uri=https%3A%2F%2Fregistry.npmjs.com)
![npm (downloads)](https://img.shields.io/npm/dy/react-google-calendar-api.svg?style=popout)
[![Gitter chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/react-google-calendar-api/community?utm_source=share-link&utm_medium=link&utm_campaign=share-link)

An api to manage your google calendar

## Install

```
npm install --save react-google-calendar-api
```

## Use

```
import ApiCalendar from 'react-google-calendar-api';
```

### Typescript Import

```
import ApiCalendar from 'react-google-calendar-api/src/ApiCalendar';
```

Create a file apiGoogleconfig.json in the root directory with your googleApi clientId and ApiKey.
https://console.developers.google.com/flows/enableapi?apiid=calendar.

```json
{
  "clientId": "<CLIENT_ID>",
  "apiKey": "<API_KEY>",
  "scope": "https://www.googleapis.com/auth/calendar",
  "discoveryDocs": [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
  ]
}
```

## Setup

### handleAuthClick:

```javascript
    /**
     * Sign in with a Google account.
     * @returns {any} A Promise that is fulfilled with the GoogleUser instance when the user successfully authenticates and grants the requested scopes, or rejected with an object containing an error property if an error happened
     */
    public handleAuthClick(): Promise<any>
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

  export default class DoubleButton extends React.Component {
      constructor(props) {
        super(props);
        this.handleItemClick = this.handleItemClick.bind(this);
      }

      public handleItemClick(event: SyntheticEvent<any>, name: string): void {
        if (name === 'sign-in') {
          ApiCalendar.handleAuthClick()
          .then(() => {
            console.log('sign in succesful!');
          })
          .catch((e) => {
            console.error(`sign in failed ${e}`);
          })
        } else if (name === 'sign-out') {
          ApiCalendar.handleSignoutClick();
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
   public createEvent(event: object, calendarId: string = this.calendar, sendUpdates: string = 'none',): any {
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

#### Example

```javascript
import ApiCalendar from 'react-google-calendar-api';

const eventFromNow: object = {
  summary: 'Poc Dev From Now',
  time: 480,
};

ApiCalendar.createEventFromNow(eventFromNow)
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
import ApiCalendar from 'react-google-calendar-api';

if (ApiCalendar.sign)
  ApiCalendar.listUpcomingEvents(10).then(({ result }: any) => {
    console.log(result.items);
  });
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
import ApiCalendar from 'react-google-calendar-api';
if (ApiCalendar.sign)
  ApiCalendar.listEvents({
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
import ApiCalendar from 'react-google-calendar-api';

const event = {
  summary: 'New Event Title',
};

ApiCalendar.updateEvent(event, '2eo85lmjkkd2i63uo3lhi8a2cq').then(console.log);
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
import ApiCalendar from 'react-google-calendar-api';

ApiCalendar.deleteEvent('2eo85lmjkkd2i63uo3lhi8a2cq').then(console.log);
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
import ApiCalendar from 'react-google-calendar-api';

ApiCalendar.getEvent('2eo85lmjkkd2i63uo3lhi8a2cq').then(console.log);
```

### Get BasicUserProfile Event

```javascript
   /**
   * @returns {any} Get the user's basic profile information.
   * Documentation: https://developers.google.com/identity/sign-in/web/reference#googleusergetbasicprofile
   */
   public getBasicUserProfile(): any
```

#### Examples

```javascript
import ApiCalendar from 'react-google-calendar-api';

ApiCalendar.getBasicUserProfile('2eo85lmjkkd2i63uo3lhi8a2cq')
  .getEmail()
  .then(console.log);

ApiCalendar.getBasicUserProfile('2eo85lmjkkd2i63uo3lhi8a2cq')
  .getName()
  .then(console.log);
```

### or with async/wait

```javascript
import ApiCalendar from 'react-google-calendar-api';

const response = await ApiCalendar.getBasicUserProfile();

response.getEmail();
```

## Utils

### listenSign:

```javascript
     /**
     * Execute the callback function when a user is disconnected or connected with the sign status.
     * @param callback
     */
    public listenSign(callback: any): void
```

### onLoad:

```javascript
    /**
     * Execute the callback function when gapi is loaded (gapi needs to be loaded to use any other methods)
     * @param callback
     */
    public onLoad(callback: any): void
```

#### Example

```javascript
    import React, {ReactNode} from 'react';
    import ApiCalendar from 'react-google-calendar-api';

    export default class StatusSign extends React.Component<any, any> {
        constructor(props) {
            super(props);
            this.state = {
              sign: ApiCalendar.sign,
            };
            this.signUpdate = this.signUpdate.bind(this);
            ApiCalendar.onLoad(() => {
                ApiCalendar.listenSign(this.signUpdate);
            });
        }

        public signUpdate(sign: boolean): any {
            this.setState({
                sign
            })
        }

        render(): ReactNode {
            return (
                <div>{this.state.sign}</div>
            );
        }
    }
```
