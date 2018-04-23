![alt](https://kitn.net/wp-content/uploads/2016/09/google-calendar-logo.jpg)
![npm (custom registry)](https://img.shields.io/npm/l/express.svg?registry_uri=https%3A%2F%2Fregistry.npmjs.com)

# react-google-calendar-api
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
import ApiCalendar from 'react-google-calendar-api/ApiCalendar';
```

Create a file apiGoogleconfig.json in the root directory with your googleApi clientId and ApiKey.
https://console.developers.google.com/flows/enableapi?apiid=calendar.

```json
{
  "clientId": "<CLIENT_ID>",
  "apiKey": "<API_KEY>",
  "scope": "https://www.googleapis.com/auth/calendar",
  "discoveryDocs": ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]
}
```

## Setup

### handleAuthClick:

```javascript
    /**
     * Sign in with a Google account.
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
  
  export default class DoubleButton extends React.Component {
      constructor(props) {
        super(props);
        this.handleItemClick = this.handleItemClick.bind(this);
      }
      
      public handleItemClick(event: SyntheticEvent<any>, name: string): void {
        if (name === 'sign-in') {
          ApiCalendar.handleAuthClick();
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
     * @returns {any} Promise on the event.
     */
    public createEvent(event: object, calendarId: string = this.calendar): any {
 ```
### Create Event From Now:

```javascript
     /**
     * Create an event from the current time for a certain period.
     * @param {number} Time in minutes for the event
     * @param {string} Summary(Title) of the event
     * @param {string} Description of the event (optional)
     * @param {string} CalendarId by default calendar set by setCalendar.
     * @returns {any} Promise on the event.
     */ 
    public createEventFromNow({time, summary, description = ''}: any, calendarId: string = this.calendar): any
 ```
#### Example

```javascript
  import ApiCalendar from 'react-google-calendar-api';

  const eventFromNow: object = {
      summary: "Poc Dev From Now",
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
    ApiCalendar.listUpcomingEvents(10)
      .then(({result}: any) => {
        console.log(result.items);
      });
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
