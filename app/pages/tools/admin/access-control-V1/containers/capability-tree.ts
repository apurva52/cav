export class TreeNodeDataInfo {
    label?: string;
    data?: any;
    icon?: any;
    expandedIcon?: any;
    collapsedIcon?: any;
    children?: any ;
    leaf?: boolean;
    expanded?: boolean;
    type?: string;
    parent?: any;
    partialSelected?: boolean;
    fullyselected: boolean= false;
    styleClass: string[] = [];
    toolTip : string;
    checked : boolean
}