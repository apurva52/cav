import { MenuItem, SelectItem } from 'primeng';
import { TableHeader } from 'src/app/shared/table/table.model';
import { ListItems } from '../../../template/add-template/service/add-template.model';

export interface AddReportSettingsData {
    addTemplateMenuOptions?: AddTemplateDataPanel;
}

export interface AddTemplateDataPanel {
    orderList?: MenuItem[];
    metricGroupValues?: ListItems[];
    metricsValues?: ListItems[];
    dropDown?: SelectItem[];
    formula?: SelectItem[];
    indicesItems?: SelectItem[];
    dropDownGraph?:SelectItem[];
    dropDownBar?:SelectItem[],
    dropDownPercentile?:SelectItem[],
    dropDownSlab?:SelectItem[],
    graphPercentile?:SelectItem[],
    graphSlab?:SelectItem[],
    hierarchicalGraph?:SelectItem[],
    hierarchicalChart?:SelectItem[],
    multiLayout?:SelectItem[],
    compareReport?:SelectItem[],
    trendCompareGraph?:SelectItem[],
    trendCompareChart?:SelectItem[],
}
export interface GroupData {
    group?: {
      groupName?: string,
      mgId?: number,
      glbMgId?: number,
      metricTypeName?: string,
      vectorType?: boolean,
      hierarchicalComponent?: string
    }[],
    rsTime?: { "100": 100, "101": 101, "102": 102, "103": 103, "104": 104 },
    status?: {
      code?: number,
      msg?: string
    }
  }
  export interface GraphData {
    group?: {
      groupName?: string,
      mgId?: number,
      glbMgId?: number,
      metricTypeName?: string,
      vectorType?: boolean,
      hierarchicalComponent?: string
    }[],
    rsTime?: { "100": 100, "101": 101, "102": 102, "103": 103, "104": 104 },
    status?: {
      code?: number,
      msg?: string
    }
  }
  export interface TemplateObject{
    tInfo:TInfo;
    ars:ReportSet[];
    ft:FilterTypeInfo;
}
  export interface TInfo{

    tn?: string;
    des?: string;
    cd?: any;
    md?: any;
    un?: string;
    tr?: number;
    rptSetNum?: number;
    type?: string;
    ext?: string
}
  export interface ReportSet{

    rsName?: string;
    dt?: number;
    ct?: number;
    fType?: any;
    basedOn?: number;
    sl?: boolean;
    tb?: any;
    cpi?: boolean;
    gCtx?: GCtxInfo[];
    threshold?:ThresholdInfo;   
    pct?:any[]; 
    indices?:any;
}
  export interface ThresholdInfo{

    min?: any;
    maj?: any;
    cri?: any
}

// export interface CctxInfo{
//     cck?: string;
//     pk?: string;
//     u?: string;
//     prodType?: string
// }

  export interface GCtxInfo{

    glbMetricId?: number;
    measure?: MeasureInfo;
    subject?: SubjectInfo;

}
  export interface MeasureInfo{

    mgType?: string;
    mgTypeId?: number;
    mg?: string;
    mgId?: number;
    metric?: any;
    metricId?: number;
    showTogether?: number
}
  export interface SubjectInfo{
    tags?: TagsInfo[];
}
  export interface TagsInfo{
    key?: string;
    value?: string;
    mode?: number
}

export interface RepoData{
  vectorType?:boolean;
  mgId?:number;
  metricTypeName?:string;
  glbMgId?:number;
  groupName?:string;
  hierarchicalComponent?: any;
  label?: string;
  value?: string;
}
export interface FilterTypeInfo{
  in?:boolean;
  typ?:any;
  opt?:any;
  val1?:number;
  val2?:number;
}