import { Component, Input, OnInit } from '@angular/core';
import { UtilityService } from '../../../../service/utility.service';
import * as _ from "lodash";
import { ConfirmationService, MessageService } from 'primeng';
import { AddMonValidationService } from '../../service/add-mon-validation.service';
import * as COMPONENT from '../../constants/monitor-configuration-constants';

export const SUMMARY_SUCCESS = "SUCCESS";
export const SUMMARY_ERROR = "ERROR";
export const SEVERITY_SUCCESS = "success";
export const SEVERITY_ERROR = "error";

@Component({
  selector: 'app-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.scss']
})
export class DynamicTableComponent implements OnInit {


  @Input()
  tableCompData: any;

  @Input()
  disabled:boolean;

  @Input()
  tableTemplate;

  columnData:any[]= [];

  /**Flag for ADD/EDIT options of the dynamic dataTable */ 
  isNewRow:boolean = false;

  /** Flag for ADD/EDIT dialog box */
  addEditDialog:boolean;

  /** Used to store dataTable data */
  // tableData:any[]=[];

   /** Used to hold selected row data of the dataTable **/
   selectedJson:any[] = [];

   /**Counter for ADD/EDIT  */
   count: number = 0;

   /**Used to hold temporary id of the selected row ,used in edit functionality */
   tempId:number = 0;

   /**Used to display header for respective data tables */
   headerForTable:string;
 
  /**Used to display header for ADD/EDIT dialog box for respective data tables */
   dialogHeaderForTable:string;
   rejectVisible: boolean = true;
   acceptLable: string = "Yes";
   headerAddEditForm:string;
   /***It holds array for the values of table  */
  tableTmpArr = [];

  constructor(private messageService: MessageService, private confirmationService: ConfirmationService,
    private validationServiceObj: AddMonValidationService) { }

  ngOnInit()
   {
    this.headerForTable = this.tableCompData["label"]; // assigning the header to the respective data tables
    this.getFormHeader();  
    this.columnData = this.tableCompData["columnData"];
    let that = this;

    this.tableCompData["columnData"].map(each=>{
      each['validationObj']['required'] = each['validationObj']['defRequired']
    })
    if(this.tableCompData["data"].length != 0){
      that.getTableData();
    }
  }

  getTableData(){
    let me = this;
    me.columnData.map(function(each)
    {
    let key = each.args;
    if(each.type == "Dropdown")
    {
      
      // if(each.args)
      //   key = "ui-" + each.args;
      // else
        key = "ui-" + each.label;

    me.tableCompData["data"].map(eachData=>{
      let val = eachData[key];    // to handle edit case in case of dropdown tag
      eachData[key] = eachData[each.label];
      eachData[each['label']] = val;
    })
    }
    else{
      me.tableCompData["data"].map(eachData=>{
        if(!(key && eachData[key])) // for cases where args is not present.for eg:InstanceAndPort check monitor
        {
          key = each['label'];
        }
        eachData[each['label']] = eachData[key]
      })
    }
    })
    }
  
  getFormHeader()
  {
    /**
      * handling the case of removing '-s' from table  headers
      */
     this.headerAddEditForm = this.headerForTable;
     let headerLength = this.headerForTable.length;
    //  let headerLengthArr = this.headerForTable.split('');
     let lastString = this.headerForTable.substring(headerLength-3,headerLength)
     if(lastString == '(s)')
     {
       this.headerAddEditForm = this.headerForTable.substring(0,headerLength-3)
     }
     return this.headerAddEditForm;
  }
 
  /** For ADD Functionality- 
   * This method is used to show ADD Dialog for adding new entries in the dataTable
   */
   openAddDialog(){
     this.isNewRow = true;
     this.addEditDialog = true;
     this.dialogHeaderForTable = "Add " + this.headerAddEditForm;
     this.clearFieldData();
   }


 /** For EDIT Functionality-
  * This method is used to show EDIT Dialog for editing existing entries in the dataTable 
  */
  openEditDialog()
  {
    this.dialogHeaderForTable = "Edit " + this.headerAddEditForm;
    if (!this.selectedJson || this.selectedJson.length < 1) 
    {
      this.messageService.add({ severity: SEVERITY_ERROR , summary: SUMMARY_ERROR, detail: "Select row to edit." });
      return;
    }
    else if (this.selectedJson.length > 1)
    {
      this.messageService.add({ severity: SEVERITY_ERROR , summary: SUMMARY_ERROR, detail: "Select a single row to edit." });
      return;
    }
    
    this.tempId =  this.selectedJson[0]['id'];  

    let that = this;
    this.columnData.map(function(each)
    {
      if(each['type'] == "Dropdown")
        each.value = that.selectedJson[0]['ui-' + each.label]
      else
        each.value = that.selectedJson[0][each.label]
    })

    this.isNewRow = false;
    this.addEditDialog = true;
  }
  
/** For SAVE Functionality-
  * This is common method used to submit and save data when ADD/EDIT is performed
  */
  saveData()
  {
    let me = this;
    /**** Check for whether an item is selected from the dropdown list or not   */
    // added below block to iterate for validation blank field when type is Dropdown
    for(let i=0; i<this.columnData.length; i++){
      if(this.columnData[i]['type'] === 'Dropdown'){
        if(!this.validateField(this.columnData[i])){
          return;
        }
      }

      if(this.columnData[i]['type']=='TextField' || this.columnData[i]['type']=='instanceName'){
        if(!this.validateHostInstance(this.columnData[i])){
          return;
        }
      }
    }

    this.addEditDialog = false;
    let data = {};
    this.columnData.map(each=>{
      data['id'] = me.count;
      if(each['type'] == "Dropdown")
      {
        data['ui-' + each.label] = each.value;
        each['dropDownList'].map(val=>{
          if(each.value == val.value)
            data[each['label']] = val.label;
        })
      }
      else{
        data[each['label']] = each.value;
      }
    });

    // this.tableCompData['data'].push(data);
    // me.count = me.count + 1;
    /**** creating row object for table from the fields of form ****/
    // this.columnData.map(function(each)
    // {
    //   data[each.args] = each.value;   
    //   value = value + each.value;
    //   if(each.dropDownList !=  null)
    //   {
    //     let obj = _.find(each.dropDownList,function(list) { return list.value == each.value})
    //     /**creating this key for UI purpose *******/
    //     let key = "ui-" + each.args;
    //     data[key] = obj.label;
    //   }
    // })

  //   let keyFound = _.find(this.tableTmpArr, function (each) { return each.data ==  value})
  //   if (keyFound)
  //  {
  //    alert("Duplicate data entry in Table");
  //    return false;
  //  }
  //  else {
  //     tblObj["data"] = value;
  //    }
    /***Check for ADD/EDIT operation **/
    if (this.isNewRow)
    {
      // data["id"] = this.count;
      // tblObj["id"] = this.count;
      //to insert new row in table ImmutableArray.push() is created as primeng 4.0.0 does not support above line 
      this.tableCompData['data']=UtilityService.push(this.tableCompData['data'], data); //adding new entries in the datatable when ADD is performed
      this.count = this.count + 1;
    }
    else
    { 
      data["id"] = this.tempId; //assign temporary id
      this.tableCompData['data']=UtilityService.replace(this.tableCompData['data'], data , this.getSelectedRowIndex(data))
    }

    // this.tableTmpArr.push(tblObj);

    
    /**** sending data to parent component *****/
  //  let obj = {"data":this.tableCompData}
    
  
  //  this.updateTableVal.emit(this.tableCompData);
  //  this.store.dispatch({ type: MONITOR_DATA , payload: obj });

   this.selectedJson = [];
   this.clearFieldData();
   this.isNewRow = false;
  }


  /**This method returns selected row on the basis of Id */
   getSelectedRowIndex(data): number 
   {
    let index = this.tableCompData['data'].findIndex(each => each["id"] == this.tempId)
    return index;
  }

 
 /** For DELETE Functionality-
  * This method is used to delete entries of the Table 
  */
  deleteData()
  {
    
    let me = this;
   if (me.tableCompData['data'].length == 0) 
    {
     this.messageService.add({ severity: SEVERITY_ERROR , summary: SUMMARY_ERROR, detail: "No record is present to delete." });
     return;
    }
    if (!this.selectedJson ||this.selectedJson.length < 1) {
      this.messageService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: "Select a row to delete" });
      return;
    }

    me.rejectVisible = true;
    me.acceptLable = "Yes";

    me.confirmationService.confirm({
      message: 'Are you sure to remove this data?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        let arrId = [];
        this.selectedJson.map(function(each)
        {
          arrId.push(each.id)
        })
    
        this.tableCompData['data'] = this.tableCompData['data'].filter(function(val)
        {
          return arrId.indexOf(val.id) == -1;  //value to be deleted should return false
        })
        this.selectedJson = []
      },
      reject: () => { },
    });
   
  }

  /** Method to validate whether dropdown item is selected or not in the ADD form  */
  validateField(obj) : boolean
  {
    if(obj["value"] == null || obj["value"] == '' )
    {
      this.messageService.add({ severity: SEVERITY_ERROR, summary: SUMMARY_ERROR, detail: "Please enter " + obj["label"] });
       return false;
    }
    return true;
  }

   clearFieldData()
  {
    this.columnData.map(function(each)
    {
      each.value = each.defVal
    })
  }
  validateHostInstance(obj){
    let methodName: string = obj['validationObj']['method'] || null;
         let index = -1;
         if (methodName) {
           index = methodName.indexOf("(");
           if (index != -1)
             methodName = methodName.substring(0, index)
         }
         if (methodName && obj['value']) {
           let returnMsg = this.validationServiceObj[methodName](obj['value']);
           if (returnMsg) {
             this.messageService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: returnMsg });
             return false;
           }
         }
         return true;
 }
}
