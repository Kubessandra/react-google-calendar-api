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
### Create Event From now:

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
