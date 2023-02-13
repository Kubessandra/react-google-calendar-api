export interface ConfigApiCalendar {
  clientId: string;
  apiKey: string;
  scope: string;
  discoveryDocs: string[];
  hosted_domain?: string;
}

export interface TimeCalendarType {
  dateTime?: string;
  timeZone: string;
}

export interface Event {
  summary?: string | undefined;
  description?: string | undefined;
  start: TimeCalendarType;
  end: TimeCalendarType;
  attendees?:
    | {
        email: string;
      }[]
    | undefined;
  reminders?:
    | {
        useDefault?: boolean;
        overrides?: {
          method: string;
          minutes: number;
        }[];
      }
    | undefined;
  conferenceData?:
    | {
        createRequest: {
          requestId: string;
          conferenceSolutionKey: {
            type: string;
          };
        };
      }
    | undefined;
}
