import { Table } from 'src/app/shared/table/table.model';

export const PROJECT_TABLE: Table = {
  paginator: {
    first: 1,
    rows: 10,
    rowsPerPageOptions: [3, 5, 10, 25, 50, 100],
  },

  headers: [
    {
      cols: [
        {
          label: 'Project Name',
          valueField: 'projectname',
          classes: 'text-left',
          selected: true,
          isSort: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          iconField: true,
        },
        {
          label: 'Subject Name',
          valueField: 'subjectname',
          classes: 'text-left',
          selected: true,
          isSort: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          iconField: true,
        },
       
      ],
    },
  ],
  data: [
    {
      projectname: 'Metric Data',
      subjectname: '2020/10/21:20:20/22',
     
    },
    {
      projectname: 'Metric Data',
      subjectname: '2020/10/21:20:20/22',
     
    },
 
    {
      projectname: 'Metric Data',
      subjectname: '2020/10/21:20:20/22',
     
    },
    {
      projectname: 'Metric Data',
      subjectname: '2020/10/21:20:20/22',
     
    },
 
    {
      projectname: 'Metric Data',
      subjectname: '2020/10/21:20:20/22',
     
    },
 
    {
      projectname: 'Metric Data',
      subjectname: '2020/10/21:20:20/22',
     
    },
 
    {
      projectname: 'Metric Data',
      subjectname: '2020/10/21:20:20/22',
     
    },
 
    {
      projectname: 'Metric Data',
      subjectname: '2020/10/21:20:20/22',
     
    },
 
    {
      projectname: 'Metric Data',
      subjectname: '2020/10/21:20:20/22',
     
    },
 
    {
      projectname: 'Metric Data',
      subjectname: '2020/10/21:20:20/22',
     
    },
    {
      projectname: 'Metric Data',
      subjectname: '2020/10/21:20:20/22',
     
    },
    {
      projectname: 'Metric Data',
      subjectname: '2020/10/21:20:20/22',
     
    },
    {
      projectname: 'Metric Data',
      subjectname: '2020/10/21:20:20/22',
     
    },
    {
      projectname: 'Metric Data',
      subjectname: '2020/10/21:20:20/22',
     
    },
    {
      projectname: 'Metric Data',
      subjectname: '2020/10/21:20:20/22',
     
    },
    {
      projectname: 'Metric Data',
      subjectname: '2020/10/21:20:20/22',
     
    },
    {
      projectname: 'Metric Data',
      subjectname: '2020/10/21:20:20/22',
     
    },
    {
      projectname: 'Metric Data',
      subjectname: '2020/10/21:20:20/22',
     
    },
    {
      projectname: 'Metric Data',
      subjectname: '2020/10/21:20:20/22',
     
    },
    {
      projectname: 'Metric Data',
      subjectname: '2020/10/21:20:20/22',
     
    },
    {
      projectname: 'Metric Data',
      subjectname: '2020/10/21:20:20/22',
     
    },
    {
      projectname: 'Metric Data',
      subjectname: '2020/10/21:20:20/22',
     
    },
    {
      projectname: 'Metric Data',
      subjectname: '2020/10/21:20:20/22',
     
    },
    {
      projectname: 'Metric Data',
      subjectname: '2020/10/21:20:20/22',
     
    },
    {
      projectname: 'Metric Data',
      subjectname: '2020/10/21:20:20/22',
     
    },
    {
      projectname: 'Metric Data',
      subjectname: '2020/10/21:20:20/22',
     
    },
 
 
  
 
     
    
    

  ],
  tableFilter: true,
};
