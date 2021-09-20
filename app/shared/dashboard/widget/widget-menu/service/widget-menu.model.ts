export interface Tags {
  key: string;
  value: string;
  mode: number;
}
export interface Subject {
  tags: Tags[];
}
export interface Measure {
  mgTypeId: number;
  mg: string;
  mgId: number;
  metric: string;
  metricId: number;
  showTogether: number;
}
export interface WidgetDrillDownMenuState {
  measure: Measure;
  menuHierarchy: string;
  openFrom: string;
  parentMenuName: string;
  vector: boolean;
  subject: Subject;
  id: string;
}
export interface WidgetDrillDownMenuItem {
  label: string;
  items: any[];
  state: WidgetDrillDownMenuState;
  time: widgetTime[];
  isDirect: boolean;
}
export interface widgetTime {
  startTime: number;
  endTime: number;
  graphTimeKey: string;
  viewBy: number;
}

export interface WidgetDrillDownMenuStatus {
  code: number;
  msg: string;
}
export interface WidgetDrillDownMenu {
  items: WidgetDrillDownMenuItem[];
  derivedGraphAvail: boolean;
  errorCode: number;
  status: WidgetDrillDownMenuStatus[];
}


export class ActionInfo {
  action: string = null;
  subAction: string = null;
  data: any;

  }
