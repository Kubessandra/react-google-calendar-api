import {
  ConfigApiCalendar,
  TimeCalendarType,
} from './type';

const scriptSrcGoogle = "https://accounts.google.com/gsi/client"
const scriptSrcGapi = "https://apis.google.com/js/api.js"

class ApiCalendar {
  tokenClient: google.accounts.oauth2.TokenClient | null = null;
  onLoadCallback: any = null;
  calendar: string = 'primary';

  constructor(public config: ConfigApiCalendar) {
    try {
      this.initGapiClient = this.initGapiClient.bind(this);
      this.handleSignoutClick = this.handleSignoutClick.bind(this);
      this.handleAuthClick = this.handleAuthClick.bind(this);
      this.createEvent = this.createEvent.bind(this);
      this.listUpcomingEvents = this.listUpcomingEvents.bind(this);
      this.listEvents = this.listEvents.bind(this);
      this.createEventFromNow = this.createEventFromNow.bind(this);
      this.onLoad = this.onLoad.bind(this);
      this.setCalendar = this.setCalendar.bind(this);
      this.updateEvent = this.updateEvent.bind(this);
      this.deleteEvent = this.deleteEvent.bind(this);
      this.getEvent = this.getEvent.bind(this);
      this.handleClientLoad();
    } catch (e) {
      console.log(e);
    }
  }

  get sign(): boolean {
    return !!this.tokenClient;
  }

  /**
   * Auth to the google Api.
   */
  private initGapiClient(): void {
    gapi.client
      .init({
        apiKey: this.config.apiKey,
        discoveryDocs: this.config.discoveryDocs,
        hosted_domain: this.config.hosted_domain
      })
      .then((): void => {
        if (this.onLoadCallback) {
          this.onLoadCallback();
        }
      })
      .catch((e: any): void => {
        console.log(e);
      });
  }

  /**
   * Init Google Api
   * And create gapi in global
   */
  private handleClientLoad(): void {
    const scriptGoogle = document.createElement('script');
    const scriptGapi = document.createElement('script');
    scriptGoogle.src = scriptSrcGoogle;
    scriptGoogle.async = true;
    scriptGoogle.defer = true;
    scriptGapi.src = scriptSrcGapi;
    scriptGapi.async = true;
    scriptGapi.defer = true;
    document.body.appendChild(scriptGapi);
    document.body.appendChild(scriptGoogle);
    scriptGapi.onload = (): void => {
      gapi.load('client', this.initGapiClient);
    };
    scriptGoogle.onload = async (): Promise<void> => {
      this.tokenClient = await google.accounts.oauth2.initTokenClient({
        client_id: this.config.clientId,
        scope: this.config.scope,
        prompt: '',
        callback: (): void => {},
      });
    };
  }

  /**
   * Sign in Google user account
   */
  public handleAuthClick(): void {
    if (gapi && this.tokenClient) {
      if (gapi.client.getToken() === null) {
        this.tokenClient.requestAccessToken({ prompt: 'consent' });
      } else {
        this.tokenClient.requestAccessToken({
          prompt: '',
        });
      }
    } else {
      console.error('Error: this.gapi not loaded');
      new Error('Error: this.gapi not loaded')
    }
  }

  /**
   * Set the default attribute calendar
   * @param {string} newCalendar
   */
  public setCalendar(newCalendar: string): void {
    this.calendar = newCalendar;
  }

  /**
   * Execute the callback function when gapi is loaded
   * @param callback
   */
  public onLoad(callback: any): void {
    if (gapi) {
      callback();
    } else {
      this.onLoadCallback = callback;
    }
  }

  /**
   * Sign out user google account
   */
  public handleSignoutClick(): void {
    if (gapi) {
      const token = gapi.client.getToken();
      if (token !== null) {
        google.accounts.id.disableAutoSelect();
        google.accounts.oauth2.revoke(token.access_token, (): void => {});
        gapi.client.setToken(null)
      }
    } else {
      console.error('Error: this.gapi not loaded');
    }
  }

  /**
   * List all events in the calendar
   * @param {number} maxResults to see
   * @param {string} calendarId to see by default use the calendar attribute
   * @returns {any}
   */
  public listUpcomingEvents(
    maxResults: number,
    calendarId: string = this.calendar,
  ): any {
    if (gapi) {
      return gapi.client.calendar.events.list({
        calendarId: calendarId,
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: maxResults,
        orderBy: 'startTime',
      });
    } else {
      console.error('Error: this.gapi not loaded');
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
  public listEvents(
    queryOptions: object,
    calendarId: string = this.calendar,
  ): any {
    if (gapi) {
      return gapi.client.calendar.events.list({
        calendarId,
        ...queryOptions,
      });
    } else {
      console.error('Error: gapi not loaded');
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
  public createEventFromNow(
    { time, summary, description = '' }: any,
    calendarId: string = this.calendar,
    timeZone: string = 'Europe/Paris',
  ): any {
    const event = {
      summary,
      description,
      start: {
        dateTime: new Date().toISOString(),
        timeZone: timeZone,
      },
      end: {
        dateTime: new Date(new Date().getTime() + time * 60000).toISOString(),
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
  public createEvent(
    event: { end: TimeCalendarType; start: TimeCalendarType },
    calendarId: string = this.calendar,
    sendUpdates: 'all' | 'externalOnly' | 'none' = 'none',
  ): any {
    if (gapi.client.getToken()) {
      return gapi.client.calendar.events.insert({
        calendarId: calendarId,
        resource: event,
        //@ts-ignore the @types/gapi.calendar package is not up to date(https://developers.google.com/calendar/api/v3/reference/events/insert)
        sendUpdates: sendUpdates,
      });
    } else {
      console.error('Error: this.gapi not loaded');
      return false;
    }
  }

  /**
   * Delete an event in the calendar.
   * @param {string} eventId of the event to delete.
   * @param {string} calendarId where the event is.
   * @returns {any} Promise resolved when the event is deleted.
   */
  deleteEvent(eventId: string, calendarId: string = this.calendar): any {
    if (gapi) {
      return gapi.client.calendar.events.delete({
        calendarId: calendarId,
        eventId: eventId,
      });
    } else {
      console.error('Error: gapi is not loaded use onLoad before please.');
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
  updateEvent(
    event: object,
    eventId: string,
    calendarId: string = this.calendar,
    sendUpdates: string = 'none',
  ): any {
    if (gapi) {
      //@ts-ignore the @types/gapi.calendar package is not up to date(https://developers.google.com/calendar/api/v3/reference/events/patch)
      return gapi.client.calendar.events.patch({
        calendarId: calendarId,
        eventId: eventId,
        resource: event,
        sendUpdates: sendUpdates,
      });
    } else {
      console.error('Error: gapi is not loaded use onLoad before please.');
      return null;
    }
  }

  /**
   * Get Calendar event
   * @param {string} calendarId for the event.
   * @param {string} eventId specifies individual event
   * @returns {any}
   */

  getEvent(eventId: string, calendarId: string = this.calendar): any {
    if (gapi) {
      return gapi.client.calendar.events.get({
        calendarId: calendarId,
        eventId: eventId,
      });
    } else {
      console.error('Error: gapi is not loaded use onLoad before please.');
      return null;
    }
  }
}

export default ApiCalendar;
