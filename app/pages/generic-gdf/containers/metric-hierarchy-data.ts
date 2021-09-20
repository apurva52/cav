export class MetricHierarchyData
{
      _metadata:string=''; // meta data name
      _defVal:string='' // default value
      _keyInd:string='';// Key/index for command based monitor
      _filter:string='';// filter type - positive(+) and negative(-) filter. By default it is none so blank is the value.
      _filter_ui:string=''; //filter type for showing label in UI - positive filter and negative filter.
      _fVal:string=''; // value of selected filter 
      _hr:string='2'; //hierarchical view default is '2'
      _linked:boolean= false; // for hierarchical view link implementation
      id:number;
      _pat:string='*';//Pattern
      _keyInd_ui:string = ''; // key/Index UI
}