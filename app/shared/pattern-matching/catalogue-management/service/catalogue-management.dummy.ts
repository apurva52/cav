
import { CatalogueManagementTable } from './catalogue-management.model';

export const CATALOGUE_MANAGEMENT_DATA: CatalogueManagementTable = 
{
  categoryName:  [
    { label: 'Business Transaction', value: 'Business Transaction' },
    { label: 'Cavisson Diagnostics', value: 'Cavisson Diagnostics' },
    { label: 'Core Dump Stats', value: 'Core Dump Stats' },
  ],
  headers: [
    {
      cols: [
        {
          label: '#',
          valueField: 'serial',
          classes: 'text-left',
          isSort: false,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          width:'3%'
        },
        {
          label: 'Metric Name',
          valueField: 'name',
          classes: 'text-left',
          isSort: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          width:'10%'
        },
        {
          label: 'Metric/Indices_Derived Formula',
          valueField: 'description',
          classes: 'text-left',
          isSort: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          iconField: true,
           width:'17%'
        },
        {
          label: 'Metric Type',
          valueField: 'value',
          classes: 'text-center',
          isSort: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          width:'8%'
        },
        {
          label: 'Action',
          valueField: 'action',
          classes: 'text-center',
         isSort: false,
          filter: {
            isFilter: true,
            type: 'contains',
          },
         iconField: true,
          width:'5%'
        },
      ],
    },
  ],
  data: [
    {
      description:"",
      //glbMetricId:"",
      metricId:"",
      //label:"",
      name:"",
      value:""
    },
   
  ],
  iconsField: 'icon',
  
};

export const CATALOGUE_Data_Window: CatalogueManagementTable = {
  categoryName:  [
    { label: 'Business Transaction', value: 'Business Transaction' },
    { label: 'Cavisson Diagnostics', value: 'Cavisson Diagnostics' },
    { label: 'Core Dump Stats', value: 'Core Dump Stats' },
  ],
  headers: [
    {
      cols: [
        {
          label: '#',
          valueField: 'serial',
          classes: 'text-left',
         isSort: false,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          width:'3%'
        },
        {
          label: 'Name',
          valueField: 'name',
          classes: 'text-left',
          isSort: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          width:'8%'
        },
        {
          label: 'Metric Type',
          valueField: 'metricType',
          classes: 'text-left',
          isSort: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          width:'6%'
        },
        {
          label: 'Description',
          valueField: 'description',
          classes: 'text-left',
          isSort: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          iconField: true,
           width:'12%'
        },
        {
          label: 'Created By',
          valueField: 'createdBy',
          classes: 'text-center',
          isSort: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          width:'10%'
        },
        {
          label: 'Creation Date',
          valueField: 'creationDate',
          classes: 'text-center',
          isSort: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          width:'11%'
        },
        {
          label: 'Action',
          valueField: 'action',
          classes: 'text-center',
          isSort: false,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          iconField: true,
          width:'5%'
        },
      ],
    },
  ],
  data: [
    {
      status: {
        code: 200,
        msg: "get catalogue file Successfully"
      },
      data: [
        {
          targetData: [
            {
              description: "Used Virtual Memory (MB)",
              glbMetricId: "-1",
              metricId: 3,
              label: "Used Virtual Memory (MB)",
              name: "Used Virtual Memory (MB)",
              value: "Used Virtual Memory (MB)"
            }
          ],
          name: "test",
          description: "testing",
          createdBy: "guest",
          creationDate: "3/8/2021",
          metricType:"Normal"
        }
      ]
    },
  ],
  iconsField: 'icon',
};