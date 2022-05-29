var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
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
    scriptGoogle.onload = async () => {
      this.tokenClient = await google.accounts.oauth2.initTokenClient({
        client_id: this.config.clientId,
        scope: this.config.scope,
        prompt: "",
        callback: () => {
        }
      });
    };
  }
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
  setCalendar(newCalendar) {
    this.calendar = newCalendar;
  }
  onLoad(callback) {
    if (gapi) {
      callback();
    } else {
      this.onLoadCallback = callback;
    }
  }
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
  listUpcomingEvents(maxResults, calendarId = this.calendar) {
    if (gapi) {
      return gapi.client.calendar.events.list({
        calendarId,
        timeMin: new Date().toISOString(),
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
  createEventFromNow({ time, summary, description = "" }, calendarId = this.calendar, timeZone = "Europe/Paris") {
    const event = {
      summary,
      description,
      start: {
        dateTime: new Date().toISOString(),
        timeZone
      },
      end: {
        dateTime: new Date(new Date().getTime() + time * 6e4).toISOString(),
        timeZone
      }
    };
    return this.createEvent(event, calendarId);
  }
  createEvent(event, calendarId = this.calendar, sendUpdates = "none") {
    if (gapi.client.getToken()) {
      return gapi.client.calendar.events.insert({
        calendarId,
        resource: event,
        sendUpdates
      });
    } else {
      console.error("Error: this.gapi not loaded");
      return false;
    }
  }
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
};
var ApiCalendar_default = ApiCalendar;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
