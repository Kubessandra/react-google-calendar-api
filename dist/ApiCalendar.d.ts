interface ConfigApiCalendar {
    clientId: string;
    apiKey: string;
    scope: string;
    discoveryDocs: string[];
    hosted_domain?: string;
}
interface TimeCalendarType {
    dateTime?: string;
    timeZone: string;
}

declare class ApiCalendar {
    config: ConfigApiCalendar;
    tokenClient: google.accounts.oauth2.TokenClient | null;
    onLoadCallback: any;
    calendar: string;
    constructor(config: ConfigApiCalendar);
    get sign(): boolean;
    /**
     * Auth to the google Api.
     */
    private initGapiClient;
    /**
     * Init Google Api
     * And create gapi in global
     */
    private handleClientLoad;
    /**
     * Sign in Google user account
     */
    handleAuthClick(): void;
    /**
     * Set the default attribute calendar
     * @param {string} newCalendar
     */
    setCalendar(newCalendar: string): void;
    /**
     * Execute the callback function when gapi is loaded
     * @param callback
     */
    onLoad(callback: any): void;
    /**
     * Sign out user google account
     */
    handleSignoutClick(): void;
    /**
     * List all events in the calendar
     * @param {number} maxResults to see
     * @param {string} calendarId to see by default use the calendar attribute
     * @returns {any}
     */
    listUpcomingEvents(maxResults: number, calendarId?: string): any;
    /**
     * List all events in the calendar queried by custom query options
     * See all available options here https://developers.google.com/calendar/v3/reference/events/list
     * @param {object} queryOptions to see
     * @param {string} calendarId to see by default use the calendar attribute
     * @returns {any}
     */
    listEvents(queryOptions: object, calendarId?: string): any;
    /**
     * Create an event from the current time for a certain period
     * @param {number} time in minutes for the event
     * @param {string} summary of the event
     * @param {string} description of the event
     * @param {string} calendarId
     * @param {string} timeZone The time zone in which the time is specified. (Formatted as an IANA Time Zone Database name, e.g. "Europe/Zurich".)
     * @returns {any}
     */
    createEventFromNow({ time, summary, description }: any, calendarId?: string, timeZone?: string): any;
    /**
     * Create Calendar event
     * @param {string} calendarId for the event.
     * @param {object} event with start and end dateTime
     * @param {string} sendUpdates Acceptable values are: "all", "externalOnly", "none"
     * @returns {any}
     */
    createEvent(event: {
        end: TimeCalendarType;
        start: TimeCalendarType;
    }, calendarId?: string, sendUpdates?: 'all' | 'externalOnly' | 'none'): any;
    /**
     * Delete an event in the calendar.
     * @param {string} eventId of the event to delete.
     * @param {string} calendarId where the event is.
     * @returns {any} Promise resolved when the event is deleted.
     */
    deleteEvent(eventId: string, calendarId?: string): any;
    /**
     * Update Calendar event
     * @param {string} calendarId for the event.
     * @param {string} eventId of the event.
     * @param {object} event with details to update, e.g. summary
     * @param {string} sendUpdates Acceptable values are: "all", "externalOnly", "none"
     * @returns {any}
     */
    updateEvent(event: object, eventId: string, calendarId?: string, sendUpdates?: string): any;
    /**
     * Get Calendar event
     * @param {string} calendarId for the event.
     * @param {string} eventId specifies individual event
     * @returns {any}
     */
    getEvent(eventId: string, calendarId?: string): any;
}

export { ApiCalendar as default };
