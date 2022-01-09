const Config = require('../../../apiGoogleconfig.json');
class ApiCalendar {
    constructor() {
        this.sign = false;
        this.gapi = null;
        this.onLoadCallback = null;
        this.calendar = 'primary';
        try {
            this.updateSigninStatus = this.updateSigninStatus.bind(this);
            this.initClient = this.initClient.bind(this);
            this.handleSignoutClick = this.handleSignoutClick.bind(this);
            this.handleAuthClick = this.handleAuthClick.bind(this);
            this.createEvent = this.createEvent.bind(this);
            this.listUpcomingEvents = this.listUpcomingEvents.bind(this);
            this.listEvents = this.listEvents.bind(this);
            this.createEventFromNow = this.createEventFromNow.bind(this);
            this.listenSign = this.listenSign.bind(this);
            this.onLoad = this.onLoad.bind(this);
            this.setCalendar = this.setCalendar.bind(this);
            this.updateEvent = this.updateEvent.bind(this);
            this.deleteEvent = this.deleteEvent.bind(this);
            this.getEvent = this.getEvent.bind(this);
            this.getBasicUserProfile = this.getBasicUserProfile.bind(this);
            this.handleClientLoad();
        }
        catch (e) {
            console.log(e);
        }
    }
    /**
     * Update connection status.
     * @param {boolean} isSignedIn
     */
    updateSigninStatus(isSignedIn) {
        this.sign = isSignedIn;
    }
    /**
     * Auth to the google Api.
     */
    initClient() {
        this.gapi = window['gapi'];
        this.gapi.client
            .init(Config)
            .then(() => {
            // Listen for sign-in state changes.
            this.gapi.auth2
                .getAuthInstance()
                .isSignedIn.listen(this.updateSigninStatus);
            // Handle the initial sign-in state.
            this.updateSigninStatus(this.gapi.auth2.getAuthInstance().isSignedIn.get());
            if (this.onLoadCallback) {
                this.onLoadCallback();
            }
        })
            .catch((e) => {
            console.log(e);
        });
    }
    /**
     * Init Google Api
     * And create gapi in global
     */
    handleClientLoad() {
        this.gapi = window['gapi'];
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        document.body.appendChild(script);
        script.onload = () => {
            window['gapi'].load('client:auth2', this.initClient);
        };
    }
    /**
     * Sign in Google user account
     */
    handleAuthClick() {
        if (this.gapi) {
            return this.gapi.auth2.getAuthInstance().signIn();
        }
        else {
            console.log('Error: this.gapi not loaded');
            return Promise.reject(new Error('Error: this.gapi not loaded'));
        }
    }
    /**
     * Set the default attribute calendar
     * @param {string} newCalendar
     */
    setCalendar(newCalendar) {
        this.calendar = newCalendar;
    }
    /**
     * Execute the callback function when a user is disconnected or connected with the sign status.
     * @param callback
     */
    listenSign(callback) {
        if (this.gapi) {
            this.gapi.auth2.getAuthInstance().isSignedIn.listen(callback);
        }
        else {
            console.log('Error: this.gapi not loaded');
        }
    }
    /**
     * Execute the callback function when gapi is loaded
     * @param callback
     */
    onLoad(callback) {
        if (this.gapi) {
            callback();
        }
        else {
            this.onLoadCallback = callback;
        }
    }
    /**
     * Sign out user google account
     */
    handleSignoutClick() {
        if (this.gapi) {
            this.gapi.auth2.getAuthInstance().signOut();
        }
        else {
            console.log('Error: this.gapi not loaded');
        }
    }
    /**
     * List all events in the calendar
     * @param {number} maxResults to see
     * @param {string} calendarId to see by default use the calendar attribute
     * @returns {any}
     */
    listUpcomingEvents(maxResults, calendarId = this.calendar) {
        if (this.gapi) {
            return this.gapi.client.calendar.events.list({
                calendarId: calendarId,
                timeMin: new Date().toISOString(),
                showDeleted: false,
                singleEvents: true,
                maxResults: maxResults,
                orderBy: 'startTime',
            });
        }
        else {
            console.log('Error: this.gapi not loaded');
            return false;
        }
    }
    /**
     * List all events in the calendar queried by custom query options
     * See all available options here https://developers.google.com/calendar/v3/reference/events/list
     * @param {object} queryOptions to see
     * @param {string} calendarId to see by default use the calendar attribute
     * @returns {any}
     */
    listEvents(queryOptions, calendarId = this.calendar) {
        if (this.gapi) {
            return this.gapi.client.calendar.events.list(Object.assign({ calendarId }, queryOptions));
        }
        else {
            console.log('Error: this.gapi not loaded');
            return false;
        }
    }
    /**
     * Create an event from the current time for a certain period
     * @param {number} time in minutes for the event
     * @param {string} summary of the event
     * @param {string} description of the event
     * @param {string} calendarId
     * @param {string} timeZone The time zone in which the time is specified. (Formatted as an IANA Time Zone Database name, e.g. "Europe/Zurich".)
     * @returns {any}
     */
    createEventFromNow({ time, summary, description = '' }, calendarId = this.calendar, timeZone = 'Europe/Paris') {
        const event = {
            summary,
            description,
            start: {
                dateTime: new Date().toISOString(),
                timeZone: timeZone,
            },
            end: {
                dateTime: new Date(new Date().getTime() + time * 60000),
                timeZone: timeZone,
            },
        };
        return this.createEvent(event, calendarId);
    }
    /**
     * Create Calendar event
     * @param {string} calendarId for the event.
     * @param {object} event with start and end dateTime
     * @param {string} sendUpdates Acceptable values are: "all", "externalOnly", "none"
     * @returns {any}
     */
    createEvent(event, calendarId = this.calendar, sendUpdates = 'none') {
        if (this.gapi) {
            return this.gapi.client.calendar.events.insert({
                calendarId: calendarId,
                resource: event,
                sendUpdates: sendUpdates,
            });
        }
        else {
            console.log('Error: this.gapi not loaded');
            return false;
        }
    }
    /**
     * Delete an event in the calendar.
     * @param {string} eventId of the event to delete.
     * @param {string} calendarId where the event is.
     * @returns {any} Promise resolved when the event is deleted.
     */
    deleteEvent(eventId, calendarId = this.calendar) {
        if (this.gapi) {
            return this.gapi.client.calendar.events.delete({
                calendarId: calendarId,
                eventId: eventId,
            });
        }
        else {
            console.log('Error: gapi is not loaded use onLoad before please.');
            return null;
        }
    }
    /**
     * @returns {any} Get the user's basic profile information. Documentation: https://developers.google.com/identity/sign-in/web/reference#googleusergetbasicprofile
     */
    getBasicUserProfile() {
        if (this.gapi) {
            return this.gapi.auth2
                .getAuthInstance()
                .currentUser.get()
                .getBasicProfile();
        }
        else {
            console.log('Error: gapi is not loaded use onLoad before please.');
            return null;
        }
    }
    /**
     * Update Calendar event
     * @param {string} calendarId for the event.
     * @param {string} eventId of the event.
     * @param {object} event with details to update, e.g. summary
     * @param {string} sendUpdates Acceptable values are: "all", "externalOnly", "none"
     * @returns {any}
     */
    updateEvent(event, eventId, calendarId = this.calendar, sendUpdates = 'none') {
        if (this.gapi) {
            return this.gapi.client.calendar.events.patch({
                calendarId: calendarId,
                eventId: eventId,
                resource: event,
                sendUpdates: sendUpdates,
            });
        }
        else {
            console.log('Error: gapi is not loaded use onLoad before please.');
            return null;
        }
    }
    /**
     * Get Calendar event
     * @param {string} calendarId for the event.
     * @param {string} eventId specifies individual event
     * @returns {any}
     */
    getEvent(eventId, calendarId = this.calendar) {
        if (this.gapi) {
            return this.gapi.client.calendar.events.get({
                calendarId: calendarId,
                eventId: eventId,
            });
        }
        else {
            console.log('Error: gapi is not loaded use onLoad before please.');
            return null;
        }
    }
}
let apiCalendar;
try {
    apiCalendar = new ApiCalendar();
}
catch (e) {
    console.log(e);
}
export default apiCalendar;
