import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MonitorupdownstatusService } from '../../../service/monitorupdownstatus.service';
//import { GdfTableData} from '../../../../containers/gdf-table-data';
//import * as CHECK_MON_DROPDOWN_LIST from '../../../../constants/check-mon-dropdown-constants';
//import { UtilityService } from '../../../../services/utility.service';
//import { ImmutableArray } from '../../../../utility/immutable-array';
//import { MessageService } from '../../../../services/message.service';
//import { TableData } from '../../../../containers/table-data';
import { GdfTableData, ImmutableArray } from './gdf-table-data';
import { TableData } from './table-data';

const TYPE_LABEL = ['sample','rate','cumulative'];
const TYPE_VALUE = ['sample','rate','cumulative'];

@Component({
  selector: 'app-cav-snmp',
  templateUrl: './cav-snmp.component.html',
  styleUrls: ['./cav-snmp.component.css']
})



export class CavSnmpComponent implements OnInit {

  
  item: TableData;

  /*This variable is used to show header on ADD and EDIT functionality for GDF detail Table*/
  dialogHeaderForTable: string = "Add";

  /*flag used to display dialog*/
  addDialog: boolean = false;

  gdfData: GdfTableData; // graph definition table data

  formulaTypeList: any[] = []; // formulae list 

  relationList:any[]= [];

  /*This variable is used to check whether it is ADD/EDIT functionality*/
  isFromAdd: boolean;

  /*Counter for ADD/EDIT  */
  count: number = 0;

   /*This variable is used to store the selected gdf details*/
   selectedGDFdetails:GdfTableData[];
   
   /*This variable is used to hold temporary id of the selected row of gdf details table used in EDIT functionality */
  tempId:number = 0;

  versionList:any[] = []; // holds the version list by default it is 1.
  levelList:any[] = []; //holds security level list
  graphTypeList:any[] = []; //added for bug 101175
  cols:any[];

  
  constructor(private monUpDownStatus:MonitorupdownstatusService,
    private router: Router,) { }

  ngOnInit() {
    this.item = new TableData()
  
    this.item.metaData = "Tier>Server>Instance";

    this.versionList = [
          {
            label: '1',
            value: '1'
          },
          {
            label:'2c',
            value: '2c'
          },
          {
             label: '3',
             value: '3'
          }

    ]
    this.levelList = [
      {
        label:'--Select--',
        value: ''
      },
      {
        label: 'No authentication and no privacy',
        value: 'noAuthNoPriv'
      },
      {
        label: 'Authentication and no privacy',
        value: 'authNoPriv'
      },
      {
        label: 'Authentication and privacy',
        value: 'authPriv'
      }
    ]
    this.relationList = [
      {
        label : 'Yes',
        value: 'Yes'
      },
      {
        label: 'No',
        value: 'No'
      }
    ]
    this.graphTypeList = [
      {
        label: 'sample',
        value: 'sample'
      },
      {
        label:'rate',
        value: 'rate'
      },
      {
        label: 'cumulative',
        value: 'cumulative'
      }
    ]
 
    this.formulaTypeList = [
      {
        label: 'None',
        value: 'None'
      },
      {
        label: 'Multiply By',
        value: 'MultiplyBy'
      },
      {
        label: 'Divide By',
        value: 'DivideBy'
      },
      {
        label: 'MSToSec',
        value: 'MSToSec'
      },
      {
        label: 'PerSec',
        value: 'PerSec'
      }
    ]

    this.cols = [
      {field: 'oid',header:'OID'},
      {field: 'type', header: 'Type'},
      {field:'rel',header: 'Relative'},
      {field: 'formulae', header: 'Formulae'},
      {field: 'fVal', header: 'Formuale Value'},
      {field: 'grN', header:'Graph  Name'},
      {field: 'grphDesc', header: 'Graph Description' }
    ]

    // if (this.monUpDownStatus.isFromEdit) // check whether UI is from "ADD" or "EDIT"  mode
    // {
    //   this.monUpDownStatus.isFromEdit = false
    //   //this.item = Object.assign({}, this.monUpDownStatus.getSNMPEditData)
    //   console.log("item snmp===>",this.item)
      
    // }

    //this.item['metaData'] = "Tier>Server>Instance";
    // this.formulaTypeList = UtilityService.createListWithKeyValue(CHECK_MON_DROPDOWN_LIST.CUSTOM_FORMULAE_LABEL, CHECK_MON_DROPDOWN_LIST.CUSTOM_FORMULAE_VALUE);
    // this.versionList = UtilityService.createListWithKeyValue(CHECK_MON_DROPDOWN_LIST.VERSION_LABEL, CHECK_MON_DROPDOWN_LIST.VERSION_VALUE);
    // this.relationList = UtilityService.createListWithKeyValue(CHECK_MON_DROPDOWN_LIST.RELATION_LABEL, CHECK_MON_DROPDOWN_LIST.RELATION_VALUE);
    // this.levelList = UtilityService.createListWithKeyValue(CHECK_MON_DROPDOWN_LIST.LEVEL_LABEL, CHECK_MON_DROPDOWN_LIST.LEVEL_VALUE);
    // this.graphTypeList = UtilityService.createListWithKeyValue(TYPE_LABEL, TYPE_VALUE)
  }
/**For ADD Functionality-
  *This method is called when user want to ADD gdf details
  */
  openDialog()
  {
    this.dialogHeaderForTable = "Add graph definition details";
    this.gdfData = new GdfTableData();
    this.addDialog = true;
    this.isFromAdd = true;
  }

  /*This method is called when cancel operation performed for closing the dialog of gdf details*/
  closeDialog()
  {
     this.addDialog = false;
  }

   /** For SAVE Functionality-
   * This method is called when user performs save operation when ADD/EDIT is done for the gdf details.
   */
  saveGDFdetails()
  {
    /* for saving the details on ADD Functionality*/
    let monitorSettings = this.addMonitorSettings(this.gdfData)
    console.log("mon setting===>",monitorSettings)
    if(this.isFromAdd) 
    {
      monitorSettings["id"] = this.count;
     this.item.gdfDetails=ImmutableArray.push(this.item.gdfDetails, monitorSettings);
     console.log("table data===>",this.item.gdfDetails)
      this.count = this.count + 1;
      this.addDialog = false;
    }
    
    /*for saving the updated details on EDIT functionality*/
    else 
    {
      monitorSettings["id"] = this.tempId; 
      this.item.gdfDetails =  ImmutableArray.replace(this.item.gdfDetails , monitorSettings, this.getSelectedRowIndex(monitorSettings["id"]))
      this.isFromAdd = true;
      this.addDialog = false;
      this.selectedGDFdetails = [];
    }
     


  }

  addMonitorSettings(gdfData:GdfTableData)
  {
    if(gdfData.type == '')
    {
      gdfData.type = "NA";
    }

    if(gdfData.fVal == '')
    {
      gdfData.fVal = "NA";
    }

    return gdfData;
  }

  editDialog()
  {
    if (!this.selectedGDFdetails || this.selectedGDFdetails.length < 1) 
    {
      //this.messageService.errorMessage("No row is selected to edit");
      return;
    }
    else if (this.selectedGDFdetails.length > 1)
    {
     // this.messageService.errorMessage("Select a single row to edit");
      return;
    }
    
    this.addDialog = true;
    this.isFromAdd = false;
    this.dialogHeaderForTable = "Edit Graph Definition Details";

    this.tempId =  this.selectedGDFdetails[0]["id"];  
    this.gdfData = Object.assign({}, this.selectedGDFdetails[0]);
  }

    /*This method returns selected row on the basis of Id */
    getSelectedRowIndex(data): number 
    {
      let index = this.item.gdfDetails.findIndex(each => each["id"] ==  this.tempId)
      return index;
    }

  /** For DELETE Functionality-
  * This method is used to delete entries of the gdf details data table 
  */
   deleteGDFDetails()
   {
     if (this.selectedGDFdetails.length == 0) 
     {
     // this.messageService.errorMessage("No record is present to delete");
      return;
     }
     let arrId = [];
     this.selectedGDFdetails.map(function(each)
     {
       arrId.push(each["id"])
     })
 
     this.item['gdfDetails'] = this.item['gdfDetails'].filter(function(val)
     {
       return arrId.indexOf(val["id"]) == -1;  //value to be deleted should return false
     })
 
    /**clearing object used for storing data */
     this.selectedGDFdetails = [];
   }
  saveSnmp(){
    //  this.monUpDownStatus.saveSNMP(this.item)
    //  this.item = new TableData()
    //  this.router.navigate(["/custom-monitors"]);
  }
}




