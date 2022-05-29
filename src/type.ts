export interface ConfigApiCalendar {
  clientId: string
  apiKey: string
  scope: string
  discoveryDocs: string[]
  hosted_domain?: string
}

export interface TimeCalendarType {
  dateTime?: string
  timeZone: string
}