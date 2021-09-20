//Fields of metric hierarchy table
export const METADATA ="_metadata";
export const DEF_VAL ="_defVal";
export const KEY_INDEX ="_keyInd";
export const FILTER_TYPE ="_filter";
export const FILTER_TYPE_UI = "_filter_ui";
export const FILTER ="_fVal";
export const HIERARICAL_VIEW ="_hr";
export const HIERARICAL_VIEW_UI ="_hr_ui";
export const VECTOR_PREFIX ="prefix";
export const VECTOR_SUFFIX ="suffix";
export const PATTERN = "_pat"

//fields of metric configuration table
export const METRIC_GROUP_NAME ="_mN";
export const METRIC_KEY_INDEX ="_metKeyIdx";
export const METRIC_TYPE ="_metType";
export const DATA_TYPE ="_dT";
export const METRIC_FORMULA ="_mF";
export const METRIC_DESC ="_metDesc";

export const FIELD ="field";
export const VISIBLE = "visible";
export const UNIT = "_unit"


//if visible is true, then it will not be shown in UI.
//if visible is false, then it will be shown in UI.
export const METRIC_HIER_HEADER_LIST = [
    { field : METADATA , header: 'Metric Hierarchy Component', visible:false},
    { field : DEF_VAL , header : 'Default Value', visible:true},
    { field : KEY_INDEX , header : 'Index' , visible:true},
    { field : FILTER_TYPE , header : 'Filter Type' , visible:true},
    { field : FILTER_TYPE_UI , header : 'Filter Type' , visible:false},
    { field : FILTER , header : 'Filter Val' , visible:true},
    { field : HIERARICAL_VIEW , header : 'Hierarchical View' , visible:true},
    { field : HIERARICAL_VIEW_UI, header : 'Hierarchical View' , visible:false},
    { field : VECTOR_PREFIX , header : 'Vector Prefix' , visible:false},
    { field : VECTOR_SUFFIX, header : 'Vector Suffix' , visible:false},
    { field : PATTERN, header : 'Pattern' , visible:false}
]

export const METRIC_CONF_HEADER_LIST = [
    { field : METRIC_GROUP_NAME , header: 'Metric Name',  visible:false},
    { field : UNIT , header: 'Unit',  visible:false},
    { field : METRIC_KEY_INDEX , header : 'Index',  visible:true},
    { field : METRIC_TYPE , header : 'Metric Type',  visible:true},
    { field : DATA_TYPE , header : 'Data type' ,  visible:false},
    { field : METRIC_FORMULA , header : 'Metric Formula' ,  visible:false},

]
