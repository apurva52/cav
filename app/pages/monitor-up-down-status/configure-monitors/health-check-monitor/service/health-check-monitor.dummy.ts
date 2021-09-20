export const CONFIG_DATA_TABLE: any = {
    
  
     paginator: {
         first: 1,
         rows: 10,
         rowsPerPageOptions: [3, 5, 10, 25, 50, 100],
     },
     headers: [
         {
             cols: [
                 {
                     label: 'Monitor Name',
                     valueField: 'name',
                     classes: 'text-left',
                     selected: true,
                     editableCol: {
                       editable: true,
                       editType: 'input',
                     },
                     filter: {
                         isFilter: true,
                         type: 'contains',
                       },
                       isSort: true,
                       actionIcon: false
                 },
                 {
                     label: 'Arguments',
                     valueField: 'arguments',
                     classes: 'text-left',
                     selected: true,
                     editableCol: {
                       editable: true,
                       editType: 'input',
                     },
                     filter: {
                         isFilter: true,
                         type: 'contains',
                       },
                       isSort: true,
                       actionIcon: false
                 },
                 
             {
               label: 'Action',
               valueField: 'action',
               classes: 'text-right columnwidth',
               selected: true,
               filter: {
                   isFilter: true,
                   type: 'contains',
                 },
                 isSort: false,
                 actionIcon: true
           }
 
             ],
         },
     ],
     data: [
         {
             name: 'lorem',
             arguments: 'lorem',
             
             action: ''
         },
         {
          name: 'ipsum',
          arguments: 'ipsum',
          
          action: ''
      }
           
 
     ],
     tableFilter: true,

   }
    