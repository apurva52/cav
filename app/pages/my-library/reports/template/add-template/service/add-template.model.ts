import { MenuItem, SelectItem } from 'primeng';
import { TableHeader } from 'src/app/shared/table/table.model';

export interface AddTemplateData {
    addTemplateMenuOptions?: AddTemplateDataPanel;
}

export interface AddTemplateDataPanel {
    collapsed?: boolean;
    orderList?: ListItems[];
    metricGroupValues?: ListItems[];
    dropDown?: SelectItem[];
    dropDownBar?: SelectItem[];
    dropDownGraph?: SelectItem[];
    dropDownValue?: SelectItem[];
    indicesItems?: SelectItem[];
    dropDownFilterValue?:SelectItem[],
    dropDownInclude?:SelectItem[],
}

export interface ListItems {
    label: string;
}
export interface TemplateDataDTO {
    templateDTO?: TemplateObject,
    cctx?: CctxInfo,
}
export interface CctxInfo{
    cck?:any;
    pk?:any;
    prodType?:any;
    u?:any;
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
    ext?: string;
    temInfo?: any[];
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
