
export interface Monitor {
  id: string;
  msg: string;
  /**
   * Formated date will come from server as it can be in diffrient timezone
   */
  date: string;
}
export interface MonitorResponse {
  count?: number;
  items?: Array<Monitor>;
}

