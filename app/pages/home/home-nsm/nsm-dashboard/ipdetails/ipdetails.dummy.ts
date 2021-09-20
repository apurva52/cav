import { Table } from "../../../../../shared/table/table.model";
import { IpdetailsNameTable } from './ipdetails.model';


export const IPDETAILS_NAME_DATA: IpdetailsNameTable = {

    paginator: {
        first: 1,
        rows: 10,
        rowsPerPageOptions: [10, 20, 50, 100],
    },


    headers: [
        {
            cols: [ 
                {
                    label: 'Sl No',
                    valueField: 'sl',
                    classes: 'text-right',
                    isSort: true,
                   
                    selected: true,
                    width: '5%'
                },
                {
                    label: 'Blade Name',
                    valueField: 'bladename',
                    classes: 'text-right',
                    isSort: true,

                    selected: true,
                    width: '5%'
                }, 
                {
                    label: 'Blade Type',
                    valueField: 'Bladetype',
                    classes: 'text-right',
                    isSort: true,

                    selected: true,
                    width: '5%'
                }, 
                {
                    label: 'Team',
                    valueField: 'team',
                    classes: 'text-right',
                    isSort: true,

                    selected: true,
                    width: '5%'
                }, 
                {
                    label: 'Project',
                    valueField: 'project',
                    classes: 'text-right',
                    isSort: true,

                    selected: true,
                    width: '5%'
                }, 
                {
                    label: 'Owner',
                    valueField: 'owner',
                    classes: 'text-right',
                    isSort: true,

                    selected: true,
                    width: '5%'
                }, 
                {
                    label: 'Allocation',
                    valueField: 'allocation',
                    classes: 'text-right',
                    isSort: true,

                    selected: true,
                    width: '5%'
                }, 
                {
                    label: 'Build Version',
                    valueField: 'buildversion',
                    classes: 'text-right',
                    isSort: true,

                    selected: true,
                    width: '5%'
                }, 
                {
                    label: 'Build Upgradation Date',
                    valueField: 'BUD',
                    classes: 'text-right',
                    isSort: true,

                    selected: true,
                    width: '5%'
                },
                {
                    label: 'Controller Name',
                    valueField: 'cn',
                    classes: 'text-right',
                    isSort: true,

                    selected: true,
                    width: '5%'
                },
                {
                    label: 'Controller Blade',
                    valueField: 'cb',
                    classes: 'text-right',
                    isSort: true,

                    selected: true,
                    width: '5%'
                },
            ] ,
          
        //data:[]
    }  
],
      data: [ {
          cb :"controller",
          cn:"work",  
          buildversion:"4.6.1(build#37)",
          BUD:"2021-07-13 08:43:23",
          allocation:"aditional",
          owner:"Shivendra_Pratap_Singh",
          project:"	Webstore",
          team:"khols", 
          Bladetype:"None",
          bladename:"None",
          sl:"1"
       }, 
          {
              cb: "controller",
              cn: "work",
              buildversion: "4.6.1(build#37)",
              BUD: "2021-07-13 08:43:23",
              allocation: "aditional",
              owner: "Shivendra_Pratap_Singh",
              project: "	Webstore",
              team: "khols",
              Bladetype: "None",
              bladename: "None",
              sl: "1"
          },
          {
              cb: "controller",
              cn: "work",
              buildversion: "4.6.1(build#37)",
              BUD: "2021-07-13 08:43:23",
              allocation: "aditional",
              owner: "Shivendra_Pratap_Singh",
              project: "	Webstore",
              team: "khols",
              Bladetype: "None",
              bladename: "None",
              sl: "1"
          },
          {
              cb: "controller",
              cn: "work",
              buildversion: "4.6.1(build#37)",
              BUD: "2021-07-13 08:43:23",
              allocation: "aditional",
              owner: "Shivendra_Pratap_Singh",
              project: "	Webstore",
              team: "khols",
              Bladetype: "None",
              bladename: "None",
              sl: "1"
          },
      ] ,


}