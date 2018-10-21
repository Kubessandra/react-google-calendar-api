'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Config = require("../../../apiGoogleconfig.json");

var ApiCalendar = function () {
    function ApiCalendar() {
        _classCallCheck(this, ApiCalendar);

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
            this.createEventFromNow = this.createEventFromNow.bind(this);
            this.listenSign = this.listenSign.bind(this);
            this.onLoad = this.onLoad.bind(this);
            this.setCalendar = this.setCalendar.bind(this);
            this.handleClientLoad();
        } catch (e) {
            console.log(e);
        }
    }
    /**
     * Update connection status.
     * @param {boolean} isSignedIn
     */


    _createClass(ApiCalendar, [{
        key: 'updateSigninStatus',
        value: function updateSigninStatus(isSignedIn) {
            this.sign = isSignedIn;
        }
        /**
         * Auth to the google Api.
         */

    }, {
        key: 'initClient',
        value: function initClient() {
            var _this = this;

            this.gapi = window['gapi'];
            this.gapi.client.init(Config).then(function () {
                // Listen for sign-in state changes.
                _this.gapi.auth2.getAuthInstance().isSignedIn.listen(_this.updateSigninStatus);
                // Handle the initial sign-in state.
                _this.updateSigninStatus(_this.gapi.auth2.getAuthInstance().isSignedIn.get());
                if (_this.onLoadCallback) {
                    _this.onLoadCallback();
                }
            }).catch(function (e) {
                console.log(e);
            });
        }
        /**
         * Init Google Api
         * And create gapi in global
         */

    }, {
        key: 'handleClientLoad',
        value: function handleClientLoad() {
            var _this2 = this;

            this.gapi = window['gapi'];
            var script = document.createElement("script");
            script.src = "https://apis.google.com/js/api.js";
            document.body.appendChild(script);
            script.onload = function () {
                window['gapi'].load('client:auth2', _this2.initClient);
            };
        }
        /**
         * Sign in Google user account
         */

    }, {
        key: 'handleAuthClick',
        value: function handleAuthClick() {
            if (this.gapi) {
                this.gapi.auth2.getAuthInstance().signIn();
            } else {
                console.log("Error: this.gapi not loaded");
            }
        }
        /**
         * Set the default attribute calendar
         * @param {string} newCalendar
         */

    }, {
        key: 'setCalendar',
        value: function setCalendar(newCalendar) {
            this.calendar = newCalendar;
        }
        /**
         * Execute the callback function when a user is disconnected or connected with the sign status.
         * @param callback
         */

    }, {
        key: 'listenSign',
        value: function listenSign(callback) {
            if (this.gapi) {
                this.gapi.auth2.getAuthInstance().isSignedIn.listen(callback);
            } else {
                console.log("Error: this.gapi not loaded");
            }
        }
        /**
         * Execute the callback function when gapi is loaded
         * @param callback
         */

    }, {
        key: 'onLoad',
        value: function onLoad(callback) {
            if (this.gapi) {
                callback();
            } else {
                this.onLoadCallback = callback;
            }
        }
        /**
         * Sign out user google account
         */

    }, {
        key: 'handleSignoutClick',
        value: function handleSignoutClick() {
            if (this.gapi) {
                this.gapi.auth2.getAuthInstance().signOut();
            } else {
                console.log("Error: this.gapi not loaded");
            }
        }
        /**
         * List all events in the calendar
         * @param {number} maxResults to see
         * @param {string} calendarId to see by default use the calendar attribute
         * @returns {any}
         */

    }, {
        key: 'listUpcomingEvents',
        value: function listUpcomingEvents(maxResults) {
            var calendarId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.calendar;

            if (this.gapi) {
                return this.gapi.client.calendar.events.list({
                    'calendarId': calendarId,
                    'timeMin': new Date().toISOString(),
                    'showDeleted': false,
                    'singleEvents': true,
                    'maxResults': maxResults,
                    'orderBy': 'startTime'
                });
            } else {
                console.log("Error: this.gapi not loaded");
                return false;
            }
        }
        /**
         * Create an event from the current time for a certain period
         * @param {number} time in minutes for the event
         * @param {string} summary of the event
         * @param {string} description of the event
         * @param {string} calendarId
         * @returns {any}
         */

    }, {
        key: 'createEventFromNow',
        value: function createEventFromNow(_ref) {
            var time = _ref.time,
                summary = _ref.summary,
                _ref$description = _ref.description,
                description = _ref$description === undefined ? '' : _ref$description;
            var calendarId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.calendar;

            var event = {
                summary: summary,
                description: description,
                start: {
                    dateTime: new Date().toISOString(),
                    timeZone: "Europe/Paris"
                },
                end: {
                    dateTime: new Date(new Date().getTime() + time * 60000),
                    timeZone: "Europe/Paris"
                }
            };
            return this.gapi.client.calendar.events.insert({
                'calendarId': calendarId,
                'resource': event
            });
        }
        /**
         * Create Calendar event
         * @param {string} calendarId for the event.
         * @param {object} event with start and end dateTime
         * @returns {any}
         */

    }, {
        key: 'createEvent',
        value: function createEvent(event) {
            var calendarId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.calendar;

            return this.gapi.client.calendar.events.insert({
                'calendarId': calendarId,
                'resource': event
            });
        }
    }]);

    return ApiCalendar;
}();

var apiCalendar = void 0;
try {
    apiCalendar = new ApiCalendar();
} catch (e) {
    console.log(e);
}
exports.default = apiCalendar;