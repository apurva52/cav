export interface Event {
  id: string;
  msg: string;
  severity: 'HIGH' | 'LOW' | 'MEDIUM' | 'INFO';
}

export interface EventGroup {
  events: Array<Event>;
  /**
   * Formated date will come from server as it can be in diffrient timezone
   */
  date: number;
}

export interface EventResponse {
  items?: Array<EventGroup>;
  count?: number;
  dcData?: any;
  rsTime?: any;
}

