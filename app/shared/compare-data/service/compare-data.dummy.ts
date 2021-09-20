import { InfoData } from '../../dialogs/informative-dialog/service/info.model';
import { CompareDataTable } from './compare-data.model';
export const COMPARE_DATA_TABLE: CompareDataTable = {
  snapshots: [
    {
      label: '',
      value: ''
    }
  ],
  preset: [
    {
      label: '',
      value: ''
    },
    {
      label: '',
      value: ''
    }
  ],
  headers: [
    {
      cols: [
        {
          label: '',
          valueField: 'color',
          classes: 'text-center',
          isSort: false,
          rowColorField: true,
        },
        {
          label: 'Name',
          valueField: 'name',
          classes: 'text-left',
          isSort: true,
        },
        {
          label: 'Preset',
          valueField: 'presetlabel',
          classes: 'text-left',
          isSort: true,
        },
        {
          label: 'Start At',
          valueField: 'start',
          classes: 'text-left',
          isSort: true,
        },
        {
          label: 'End At',
          valueField: 'end',
          classes: 'text-left',
          isSort: true,
        },
        {
          label: 'Actions',
          valueField: 'remove',
          classes: 'text-center',
          isSort: false,
          iconField: true,
        },
      ],
    },
  ],
  
  data: 
  [
    {
      trendCompare: false,
      saveMeasurement: false,
      otype:0,
      snapShotName:"",
      snapshopIndex:0,
      includeDefaultBaseline:true,
      applyAllWidget:true,
      viewByLevel:'sec',
      viewByValue:'60',
      data:[
        {
        name:"Current_Session",
        preset: "LIVE5",
        start: 1610028497701,
        end: 1610042897701,
        rowBgColorField: '#00008B',
        presetlabel:'Last 4 Hours'
        }
      ]
    }
  ],
  status:{
    code:200,
    msg:"success"
  }
};
//Information 
export const CONTENT: InfoData = {    
  title: 'Help',
  information: 'Hi @all'

}
  //   {
  //      saveMeasurement:false,
  //       snapShotName: 'XYZ snapshot',
  //       trendCompare:false,
  //       //get/save/delete/update
  //       otype: 'get',
  //       snapshopIndex:0,
  //       includeDefaultBaseline: false,
  //     data: [
  //         {
  //           name:"Uttam",
  //           preset: "LIVE5",
  //           start: 1610028497701,
  //           end: 1610042897701,
  //           icon: 'icons8 icons8-delete-trash',
  //           rowBgColorField: 'd219a4',
  //           viewByLevel:'sec',
  //           viewByValue:'60',
  //           presetlabel:'Last 4 Hours'
      
  //         },
  //         {
  //           name:"Base Line Measurement",
  //           preset:"LIVE4",
  //           start: 1610036117642,
  //           end: 1610043317642,
  //           icon: 'icons8 icons8-delete-trash',
  //           rowBgColorField: '#337ABA',
  //           viewByLevel:'sec',
  //           viewByValue:'60',
  //           presetlabel:'Last 2 Hours'
  //         },
          
  //       ]
  //   }
  // ],
  // iconsField: 'icon',
  

