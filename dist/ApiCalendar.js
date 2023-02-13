"use strict";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/ApiCalendar.ts
var ApiCalendar_exports = {};
__export(ApiCalendar_exports, {
  default: () => ApiCalendar_default
});
module.exports = __toCommonJS(ApiCalendar_exports);
var scriptSrcGoogle = "https://accounts.google.com/gsi/client";
var scriptSrcGapi = "https://apis.google.com/js/api.js";
var ApiCalendar = class {
  constructor(config) {
    this.config = config;
    this.tokenClient = null;
    this.onLoadCallback = null;
    this.calendar = "primary";
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
  get sign() {
    return !!this.tokenClient;
  }
  /**
   * Auth to the google Api.
   */
  initGapiClient() {
    gapi.client.init({
      apiKey: this.config.apiKey,
      discoveryDocs: this.config.discoveryDocs,
      hosted_domain: this.config.hosted_domain
    }).then(() => {
      if (this.onLoadCallback) {
        this.onLoadCallback();
      }
    }).catch((e) => {
      console.log(e);
    });
  }
  /**
   * Init Google Api
   * And create gapi in global
   */
  handleClientLoad() {
    const scriptGoogle = document.createElement("script");
    const scriptGapi = document.createElement("script");
    scriptGoogle.src = scriptSrcGoogle;
    scriptGoogle.async = true;
    scriptGoogle.defer = true;
    scriptGapi.src = scriptSrcGapi;
    scriptGapi.async = true;
    scriptGapi.defer = true;
    document.body.appendChild(scriptGapi);
    document.body.appendChild(scriptGoogle);
    scriptGapi.onload = () => {
      gapi.load("client", this.initGapiClient);
    };
    scriptGoogle.onload = () => __async(this, null, function* () {
      this.tokenClient = yield google.accounts.oauth2.initTokenClient({
        client_id: this.config.clientId,
        scope: this.config.scope,
        prompt: "",
        callback: () => {
        }
      });
    });
  }
  /**
   * Sign in Google user account
   */
  handleAuthClick() {
    if (gapi && this.tokenClient) {
      if (gapi.client.getToken() === null) {
        this.tokenClient.requestAccessToken({ prompt: "consent" });
      } else {
        this.tokenClient.requestAccessToken({
          prompt: ""
        });
      }
    } else {
      console.error("Error: this.gapi not loaded");
      new Error("Error: this.gapi not loaded");
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
   * Execute the callback function when gapi is loaded
   * @param callback
   */
  onLoad(callback) {
    if (gapi) {
      callback();
    } else {
      this.onLoadCallback = callback;
    }
  }
  /**
   * Sign out user google account
   */
  handleSignoutClick() {
    if (gapi) {
      const token = gapi.client.getToken();
      if (token !== null) {
        google.accounts.id.disableAutoSelect();
        google.accounts.oauth2.revoke(token.access_token, () => {
        });
        gapi.client.setToken(null);
      }
    } else {
      console.error("Error: this.gapi not loaded");
    }
  }
  /**
   * List all events in the calendar
   * @param {number} maxResults to see
   * @param {string} calendarId to see by default use the calendar attribute
   * @returns {any}
   */
  listUpcomingEvents(maxResults, calendarId = this.calendar) {
    if (gapi) {
      return gapi.client.calendar.events.list({
        calendarId,
        timeMin: (/* @__PURE__ */ new Date()).toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults,
        orderBy: "startTime"
      });
    } else {
      console.error("Error: this.gapi not loaded");
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
    if (gapi) {
      return gapi.client.calendar.events.list(__spreadValues({
        calendarId
      }, queryOptions));
    } else {
      console.error("Error: gapi not loaded");
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
  createEventFromNow({ time, summary, description = "" }, calendarId = this.calendar, timeZone = "Europe/Paris") {
    const event = {
      summary,
      description,
      start: {
        dateTime: (/* @__PURE__ */ new Date()).toISOString(),
        timeZone
      },
      end: {
        dateTime: new Date((/* @__PURE__ */ new Date()).getTime() + time * 6e4).toISOString(),
        timeZone
      }
    };
    return this.createEvent(event, calendarId);
  }
  /**
   * Create Calendar event
   * @param {string} calendarId for the event.
   * @param {object} event with start and end dateTime
   * @param {string} sendUpdates Acceptable values are: "all", "externalOnly", "none"
   * @param {string} sendNotifications Sends email notification to attendees
   * @returns {any}
   */
  createEvent(event, calendarId = this.calendar, sendUpdates = "none", sendNotifications = true) {
    if (gapi.client.getToken()) {
      return gapi.client.calendar.events.insert({
        calendarId,
        //@ts-ignore
        resource: event,
        sendNotifications,
        //@ts-ignore the @types/gapi.calendar package is not up to date(https://developers.google.com/calendar/api/v3/reference/events/insert)
        sendUpdates
      });
    } else {
      console.error("Error: this.gapi not loaded");
      return false;
    }
  }
  /**
   * Create Calendar event with video conference
   * @param {string} calendarId for the event.
   * @param {object} event with start and end dateTime
   * @param {string} sendUpdates Acceptable values are: "all", "externalOnly", "none"
   * @param {string} sendNotifications Sends email notification to attendees
   * @returns {any}
   */
  createEventWithVideoConference(event, calendarId = this.calendar, sendUpdates = "none", sendNotifications = true) {
    if (gapi.client.getToken()) {
      return gapi.client.calendar.events.insert({
        calendarId,
        resource: __spreadProps(__spreadValues({}, event), {
          //@ts-ignore
          conferenceData: {
            createRequest: {
              requestId: crypto.randomUUID(),
              conferenceSolutionKey: {
                type: "hangoutsMeet"
              }
            }
          }
        }),
        sendNotifications,
        //@ts-ignore the @types/gapi.calendar package is not up to date(https://developers.google.com/calendar/api/v3/reference/events/insert)
        sendUpdates,
        conferenceDataVersion: 1
      });
    } else {
      console.error("Error: this.gapi not loaded");
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
    if (gapi) {
      return gapi.client.calendar.events.delete({
        calendarId,
        eventId
      });
    } else {
      console.error("Error: gapi is not loaded use onLoad before please.");
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
  updateEvent(event, eventId, calendarId = this.calendar, sendUpdates = "none") {
    if (gapi) {
      return gapi.client.calendar.events.patch({
        calendarId,
        eventId,
        resource: event,
        sendUpdates
      });
    } else {
      console.error("Error: gapi is not loaded use onLoad before please.");
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
    if (gapi) {
      return gapi.client.calendar.events.get({
        calendarId,
        eventId
      });
    } else {
      console.error("Error: gapi is not loaded use onLoad before please.");
      return null;
    }
  }
  /**
   * Get Calendar List
   * @returns {any}
   */
  listCalendars() {
    if (gapi) {
      return gapi.client.calendar.calendarList.list();
    } else {
      console.error("Error: gapi is not loaded use onLoad before please.");
      return null;
    }
  }
  /**
   * Create Calendar
   * @param {string} summary, title of the calendar.
   * @returns {any}
   */
  createCalendar(summary) {
    if (gapi) {
      return gapi.client.calendar.calendars.insert({ summary });
    } else {
      console.error("Error: gapi is not loaded use onLoad before please.");
      return null;
    }
  }
};
var ApiCalendar_default = ApiCalendar;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
