import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';

import { NDAgentInfo } from '../../interfaces/nd-agent-info';
import { ConfigUiUtility } from '../../utils/config-utility';
import { ViewAdvanceSettings, InputFields, FileFields } from '../../interfaces/bci-log';
import { ConfigNdAgentService } from '../../services/config-nd-agent.service';
import { ConfigUtilityService } from '../../services/config-utility.service';
import { ConfigKeywordsService } from '../../services/config-keywords.service';
import { ImmutableArray } from '../../utils/immutable-array';
import { SessionService } from 'src/app/core/session/session.service';
declare var Prism;
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';

@Component({
    selector: 'app-config-bci-logs',
    templateUrl: './config-bci-logs.component.html',
    styleUrls: ['./config-bci-logs.component.css']
})
export class ConfigBCILogsComponent implements OnInit {

    /**Getting nd agent status data */
    ndAgentStatusData: NDAgentInfo[];

    /**List of connected tiers/server/instances */
    tierList: SelectItem[];
    serverList: SelectItem[];
    instanceList: SelectItem[];

    /** File type list */
    fileTypeList: SelectItem[];

    /** to store tier/server/instance list connected by ## symbol */
    tierSerInsList: any[]

    /** To store tier/server/instance name after selecting from drop down */
    selectedTier: string = "";
    selectedServer: string = "";
    selectedInstance: string = "";

    /** Agent type List */
    agentList: SelectItem[];

    /** Advance settings for view */
    viewAdvanceSetting: ViewAdvanceSettings;

    /** To store selected fileTye */
    selectedFileType: string = "";

    /** To store list of files recieved from BCI */
    fileListArr: any[] = [];

    /**Filtered items ..copy of fileListArr */
    filteredItems: any[] = [];

    /** File selected on radio button click */
    selectedFile: string = "";

    /** To show download file dialog */
    downloadDialog: boolean = false;

    /** To store the file content */
    fileContent: string = "";

    /**Highlighted file content */
    fileHighLightContent: string = "";

    /** flag to show the content area of the file */
    showContentBox: boolean = false;

    /** To search the file */
    searchText: string = "";

    /**Object for InputFields class */
    messageFields: InputFields

    /** To show header of text area with selected file name from the radio button */
    fileNameHeader: string = "";

    /** To search the text from the file content */
    searchFileText: string = "";

    /**to set file label name */
    fileNameOnClick: string = "";

    /**To check if goBack is clicked */
    isGoBack: boolean = false;

    /** To display selected file size */
    fileSize: number;

    /** To show header message in download file dialog */
    hdrMsg: string = "";
 
    /** To disable profile permissions for users */
    isProfilePerm: boolean;

    /** Object for file fields */
    fileFieldsData: FileFields[] = [];
    fileFieldDetails: FileFields;

    //Store ls -ltrh contents
    dataAssgnArr : string[] = [];
    prodKey: string;
    cols = [
        { field: 'fileName', header: 'File Name' },
        { field: 'fileSize', header: 'File Size' },
        { field: 'fileModifiedDate', header: 'Modification Time' },
        { field: '', header: 'Download and View' }
        ];
    breadcrumb: BreadcrumbService;
    constructor(private configNdAgentService: ConfigNdAgentService, private sessionService: SessionService,
        private configUtilityService: ConfigUtilityService,
        private configKeywordsService: ConfigKeywordsService, breadcrumbService: BreadcrumbService) {
	this.breadcrumb = breadcrumbService;
    }

    ngOnInit() {
	this.breadcrumb.add({label: 'Download Agent Logs', routerLink: '/nd-agent-config/bci-logs'});
	this.prodKey = this.sessionService.session.cctx.pk;
 	/** For Profile Access Permission */
	this.isProfilePerm=+sessionStorage.getItem("ProfileAccess") == 4 ? true : false;

    	if (this.isProfilePerm)
      	   this.configUtilityService.infoMessage("Configurations view : Read only");

        /** Get connected agents list by executing get_bci_agents_info shell */
        this.loadNDAgentStatusData();
    }

    loadNDAgentStatusData() {
        /** Initialiazing server and instance with blank array */
        this.tierList = []
        this.serverList = []
        this.instanceList = []
        this.selectedTier = "";
        this.selectedServer = "";
        this.selectedInstance = "";
        this.selectedFileType = "";
        this.searchText = "";
        this.searchFileText = "";
        this.fileListArr = [];
        this.filteredItems = [];
        this.showContentBox = false;

        //Initializing file content as no files selected 
        this.fileContent = "No files selected"
        this.fileHighLightContent = "No files selected"

        this.messageFields = new InputFields();

        //Creating instance of view
        this.viewAdvanceSetting = new ViewAdvanceSettings();

        //Creating instance for file fields
        this.fileFieldDetails = new FileFields();

        //Blank fileFieldsData array
        this.fileFieldsData = [];

        this.configNdAgentService.getNDAgentStatusData().subscribe(data => {
            // data = [{"nst":"1546408316788","at":"Java","st":"Active","pid":"26104","si":"<IP>","cpath":"-","ai":1,"tier":"AppServer_6","server":"netstorm-ProLiant-ML110-G7","instance":"Instance1","iD":"/opt/cavisson/netdiagnostics","ver":"4.1.13 BUILD 29","brs":"01/02/19 11:20:56"},{"nst":"1546406580654","at":"Java","st":"Active","pid":"28434","si":"<IP>","cpath":"-","ai":2,"tier":"Cmon54","server":"cavisson-ProLiant-ML10-v2","instance":"Instance1","iD":"/home/cavisson/netdiagnostics","ver":"4.1.13 BUILD 31","brs":"12/28/18 15:49:50"},{"nst":"1546406580543","at":"Java","st":"Active","pid":"13002","si":"<IP>","cpath":"-","ai":3,"tier":"Appserver_29","server":"CAV-QA-30-29","instance":"Instance1","iD":"/opt/cavisson/netdiagnostics","ver":"4.1.13 BUILD 32","brs":"12/31/18 13:00:53"},{"nst":"1546406584023","at":"Java","st":"Active","pid":"49529","si":"<IP>","cpath":"-","ai":4,"tier":"AtgTier","server":"netstorm-ProLiant-ML10-v2","instance":"Instance1","iD":"/opt/cavisson/netdiagnostics","ver":"4.1.13 BUILD 32","brs":"12/31/18 16:02:50"}]
            this.ndAgentStatusData = data;

            //Create tierList dropdown
            this.createTierList(data);
            this.createFileType();
            this.createAgentList();
        });
    }

    /** Method to get tier list from nd agent status data  */
    createTierList(data: NDAgentInfo[]) {
        this.tierList = [];
        this.tierSerInsList = [];
        let tempTierList = []
        for (var res of data) {

            //If the object is connected or in Active state( Do not add if instance is disconnected)
            if (res.st != '-') {
                // Creating tier dropdown
                // this.tierList.push({ label: res.tier, value: res.tier });
                tempTierList.push(res.tier)
                
                //It will store tier/server/instance in format: tier1##server1##instance1
                this.tierSerInsList.push(res.tier + "##" + res.server + "##" + res.instance)
            }
            let tempNewTierList = this.removeDuplicateElements(tempTierList)
            this.tierList = ConfigUiUtility.createDropdown(tempNewTierList)
        }

    }

    /** Create dropdown for file type */
    createFileType() {
        this.fileTypeList = [];
        let label = ["Logs", "Scripts", "Custom"]
        let val = ["logs", "scripts", "Custom"]
        this.fileTypeList = ConfigUiUtility.createListWithKeyValue(label, val);
    }

    /** Create agent list */
    createAgentList() {
        this.agentList = [];
        let agent = ["Java"];
        this.agentList = ConfigUiUtility.createDropdown(agent);
    }

    /** Fetch server(s) when a tier is selected from the dropdown */
    fetchServer(selectedTier: any) {
        this.serverList = []
        this.instanceList = []
        this.selectedServer = "";
        this.selectedInstance = "";

        //List to store the values of the server
        let tempList = []

        //Iterating tier##server##instance list
        for (let obj in this.tierSerInsList) {

            //Getting the first index of ## character
            let firstIndex = this.tierSerInsList[obj].indexOf("##");

            //Getting the last index of ## character
            let lastIndex = this.tierSerInsList[obj].lastIndexOf("##")

            // populating temPlist with those servers whose tier name is equal to the selected tier name
            if (this.tierSerInsList[obj].includes(selectedTier + "##")) {
                tempList.push(this.tierSerInsList[obj].substring(firstIndex + 2, lastIndex))
            }

            //To remove duplicate elements
            let tempNewList = this.removeDuplicateElements(tempList);

            // Creating dropdown of server list for selected tier
            this.serverList = ConfigUiUtility.createDropdown(tempNewList)
        }
    }

    /** Fetch instance(s) when a server is selected from the dropdown */
    fetchInstance(selectedServer: any) {
        this.instanceList = []
        this.selectedInstance = "";

        //List to store the values of the instance
        let tempList = []

        //Iterating tier##server##instance list
        for (let obj in this.tierSerInsList) {

            // populating temPlist with those instance whose server name is equal to the selected server name
            if (this.tierSerInsList[obj].includes("##" + selectedServer + "##")) {
                tempList.push(this.tierSerInsList[obj].substring(this.tierSerInsList[obj].lastIndexOf("##") + 2))
            }

            //To remove duplicate elements
            let tempNewList = this.removeDuplicateElements(tempList);

            // Creating dropdown of instance list for selected server
            this.instanceList = ConfigUiUtility.createDropdown(tempNewList)
        }

    }

    /** To remove duplicate elements from the list */
    removeDuplicateElements(tempList: any[]) {
        return Array.from(new Set(tempList));
    }

    //To identify the OS type of the selected instance
    identifyOSType() {
        for (let obj of this.ndAgentStatusData) {
            if (this.selectedTier == obj.tier && this.selectedServer == obj.server && this.selectedInstance == obj.instance) {
                this.viewAdvanceSetting.osType = obj.os;
                this.viewAdvanceSetting.installationDir = obj.iD;

                //To identify the agent and auto fill in textfield
                this.viewAdvanceSetting.agentMode = obj.at;
                break;
            }
        }
    }

    /** Show Agent files located at the selected source path(FileType) */
    showFiles() {

        let message: string = "";
        let command = "";
        this.fileSize = 0;
	this.showContentBox = false;
	
        // invoke method to initialize the message input fields
        this.createMessageFieldsOnShowClick();
	
        //Blank fileFieldsData array
        this.fileFieldsData = [];

        //If download is clicked then send req to show size of the file
            command = "ls -ltrh "

        //to construct list file message
        message = this.constructMessage(command);


        // Sending message to NDC to get the list of files from the specified directory
        this.configNdAgentService.listFiles(message).subscribe(data => {
            this.dataAssgnArr = data;
            //spliting the dataAssgnArr on basis of whitespaces to extract file size, file name and modified data and time.
            // Example - drwxrwxr-x  2 root root       4096 Sep  7  2018 cavisson_libs
            for(let i=1; i<this.dataAssgnArr.length-1; i++ )
            {
                    this.fileFieldDetails = new FileFields();
                    let permission = this.dataAssgnArr[i].split(/[ ]+/)[0];
                    if(permission.startsWith('d'))
                    {
                        this.fileFieldDetails.isDirectory = true;
                    }
                    this.fileFieldDetails.fileName = this.dataAssgnArr[i].split(/[ ]+/)[8];
                    this.fileFieldDetails.fileSize = this.dataAssgnArr[i].split(/[ ]+/)[4];

                    // For modification time sorting, append current year in modification time if modification time does not exist.
                    let date = new Date();
                    let fileCurrentYear = date.getFullYear();

                    //variable name for modification month that holds month's numeric value. 
                    let fileModifiedMonth;
                    if(this.dataAssgnArr[i].split(/[ ]+/)[5].startsWith('Jan'))
                        fileModifiedMonth = '01';
                    else if(this.dataAssgnArr[i].split(/[ ]+/)[5].startsWith('Feb'))
                        fileModifiedMonth = '02';
                    else if(this.dataAssgnArr[i].split(/[ ]+/)[5].startsWith('Mar'))
                        fileModifiedMonth = '03';
                    else if(this.dataAssgnArr[i].split(/[ ]+/)[5].startsWith('Apr'))
                        fileModifiedMonth = '04';
                    else if(this.dataAssgnArr[i].split(/[ ]+/)[5].startsWith('May'))
                        fileModifiedMonth = '05';
                    else if(this.dataAssgnArr[i].split(/[ ]+/)[5].startsWith('Jun'))
                        fileModifiedMonth = '06';
                    else if(this.dataAssgnArr[i].split(/[ ]+/)[5].startsWith('Jul'))
                        fileModifiedMonth = '07';
                    else if(this.dataAssgnArr[i].split(/[ ]+/)[5].startsWith('Aug'))
                        fileModifiedMonth = '08';
                    else if(this.dataAssgnArr[i].split(/[ ]+/)[5].startsWith('Sep'))
                        fileModifiedMonth = '09';
                    else if(this.dataAssgnArr[i].split(/[ ]+/)[5].startsWith('Oct'))
                        fileModifiedMonth = '10';
                    else if(this.dataAssgnArr[i].split(/[ ]+/)[5].startsWith('Nov'))
                        fileModifiedMonth = '11';
                    else if(this.dataAssgnArr[i].split(/[ ]+/)[5].startsWith('Dec'))
                        fileModifiedMonth = '12';

                    //fileModifiedDate holds modified date if it has one digit we will append 0 before it so modification time sort can maintain. 
                    let fileModifiedDate;
                    if(this.dataAssgnArr[i].split(/[ ]+/)[6].length == 1)
                    {
                        fileModifiedDate = "0" + this.dataAssgnArr[i].split(/[ ]+/)[6];
                    }
                    else
                    {
                        fileModifiedDate = this.dataAssgnArr[i].split(/[ ]+/)[6];   
                    }

                    if(this.dataAssgnArr[i].split(/[ ]+/)[7].includes('%3A'))
                    {
                        this.fileFieldDetails.fileModifiedDate = fileCurrentYear + "-" + fileModifiedMonth + "-" + fileModifiedDate + " " + this.dataAssgnArr[i].split(/[ ]+/)[7].replace("%3A",":");
                    }
                    else
                    {
                        this.fileFieldDetails.fileModifiedDate = this.dataAssgnArr[i].split(/[ ]+/)[7] + "-" + fileModifiedMonth  + "-" + fileModifiedDate + " 00:00";
                    }


                    //Converting file size in human readable form
                    if(this.fileFieldDetails.fileSize.endsWith('G') || this.fileFieldDetails.fileSize.endsWith('M') || this.fileFieldDetails.fileSize.endsWith('K')){
                        this.fileFieldDetails.fileSize = this.fileFieldDetails.fileSize + "B"
                    }
                    else{
                        this.fileFieldDetails.fileSize = this.fileFieldDetails.fileSize + "B"
                    }
                    //Push fileFieldDetails into fileFieldsData array
                    this.fileFieldsData = ImmutableArray.push(this.fileFieldsData, this.fileFieldDetails);

                    //Sort to folders to come before files
                    this.fileFieldsData = this.fileFieldsData.sort((a)=>{
                        if(a.isDirectory){
                            return -1;
                        }
                        return 0
                    })
            }
            //Show files case

                if (!data[0].includes("Error")) {
                    //response array will contain last element as - ;] , so remove this element from array
                    this.fileListArr = data.slice(0, -1);
                    this.filteredItems = this.fileListArr
                    //Assigning selected tier/server/instance to the tier/server/instance variables that are used to send the message to the NDC
                }
                else if (data[0].includes("Not a directory") || data[0].includes("No such file or directory")) {
                    this.configUtilityService.errorMessage("Not a directory")
                    
                }
                else {
                    this.configUtilityService.errorMessage(data[0].substring(0, data[0].length - 2))
                this.fileListArr = [];
                this.filteredItems = [];
                this.showContentBox = false;
                this.messageFields = new InputFields();
            }
            this.selectedFile = "";
            if(data[0].includes("Error")){
                this.configUtilityService.errorMessage("Error in getting file size")
            }
        this.fileNameOnClick = "";
    })    
    }

    /** To initialize the message  input fields when user clicks on show files button */
    createMessageFieldsOnShowClick() {
        this.messageFields.tier = this.selectedTier;
        this.messageFields.server = this.selectedServer;
        this.messageFields.instance = this.selectedInstance;
        this.messageFields.agentMode = this.viewAdvanceSetting.agentMode;
        this.messageFields.compressedMode = this.viewAdvanceSetting.compressedMode;
        this.messageFields.executeForcefully = this.viewAdvanceSetting.executeForcefully;
        this.messageFields.fileType = this.selectedFileType;
        this.messageFields.sourcePath = this.viewAdvanceSetting.sourcePath;
        this.messageFields.timeout = this.viewAdvanceSetting.timeout;

    }

    //Method to create message to send to NDC to list files of the specified directory
    constructMessage(command) {

        /**AgentType=Java;Arguments= ls ../logs/;DownloadFile=0;
         * Tier=T1;Server=S1;Instance=A1;TestRun=1;Path=;TimeOut=60;ExecuteForceFully=0;CompressMode=0;'*/

        let argument = "";
        let trNo = this.getTRNo();

        //If connected machine is linux
        if (this.viewAdvanceSetting.osType == "LinuxEx") {

            //If selected file type is not custom
            if (this.selectedFileType != 'Custom') {
                if (this.fileNameOnClick != "")
                    argument = command + this.viewAdvanceSetting.installationDir + "/" + this.selectedFileType + "/" + this.fileNameOnClick
                else {
                    argument = command + this.viewAdvanceSetting.installationDir + "/" + this.selectedFileType
                }
            }
            else {
                let args = "";
                //When file is selected
                if (this.fileNameOnClick != ""){
                    //if file is a directory then include directory name in sourcepath
                    if(this.fileNameOnClick.endsWith("/")){
                            this.viewAdvanceSetting.sourcePath = this.viewAdvanceSetting.sourcePath + "/" + this.fileNameOnClick
                            this.viewAdvanceSetting.sourcePath = this.viewAdvanceSetting.sourcePath.substring(0, this.viewAdvanceSetting.sourcePath.length - 1);
                            args = this.viewAdvanceSetting.sourcePath;
                            
                    }
                    //Otherwise dont include in source path
                    else{
                        args = this.viewAdvanceSetting.sourcePath + "/" + this.fileNameOnClick
                    }
                }
                //Show files case when no file is selected
                else{
                    this.viewAdvanceSetting.sourcePath = this.viewAdvanceSetting.sourcePath + "/" + this.fileNameOnClick
                    this.viewAdvanceSetting.sourcePath = this.viewAdvanceSetting.sourcePath.substring(0, this.viewAdvanceSetting.sourcePath.length - 1);
                    args = this.viewAdvanceSetting.sourcePath

                }

                //Creating message to send to NDC
                argument = command + "/" + args

            }
        }

        return "AgentType=" + this.viewAdvanceSetting.agentMode + ";Arguments=" + argument + ";DownloadFile=0;Tier="
            + this.selectedTier + ";Server=" + this.selectedServer + ";Instance=" + this.selectedInstance
            + ";TestRun=" + trNo + ";Path=/tmp;Timeout=" + this.viewAdvanceSetting.timeout + ";ExecuteForceFully="
            + this.viewAdvanceSetting.executeForcefully + ";CompressMode=" + this.viewAdvanceSetting.compressedMode + ";"

    }


    /** To get TRNo if test is running */
    getTRNo() {
        let trNo = "";
        if (sessionStorage.getItem("isTrNumber") != "null" && sessionStorage.getItem("isTrNumber") != null) {
            trNo = sessionStorage.getItem("isTrNumber"); // When test is running
        }
        else {
            trNo = "1"; // When test is not running
        }
        return trNo;
    }

    /** To open a dialog to ask the user for destination path to download the file */
    openDownloadFileDialog(selectedFile, fileSize) {

	//Assigning selected file and file size.
	//Converting GB,MB,KB into bytes so check size is greater than 10MB

       	if(fileSize.includes('GB'))
        {
            fileSize = fileSize.substring(0, fileSize.length-2);
            this.fileSize = Math.ceil(fileSize * 1024*1024*1024);
        }
        else if(fileSize.includes('MB'))
        {
            fileSize = fileSize.substring(0, fileSize.length-2);
            this.fileSize = Math.ceil(fileSize * 1024*1024);
        }
        else if(fileSize.includes('KB'))
        {
            fileSize = fileSize.substring(0, fileSize.length-2);
            this.fileSize = Math.ceil(fileSize * 1024);
        }
        else
        {
            fileSize = fileSize.substring(0, fileSize.length-1);
            this.fileSize = Math.ceil(fileSize);
        }
 
	this.selectedFile = selectedFile;

        //To show Download File name on Download Dialog box
        this.hdrMsg = "Download File: " +  selectedFile;

        //Assigning with default path
        this.viewAdvanceSetting.destPath = "/tmp";
        this.viewAdvanceSetting.newFileName = this.selectedFile;
        this.downloadDialog = true;

        //invoke method to initialize the message input fields
        this.createMessageFieldsOnShowClick();
    }

    /** To download selected file */
    downloadFile() {

        /** Download message format will be: 
         * ndi_communicate_with_ndc <IP> <PORT> 'download_file_req:AgentType=java;FileName=nd_bci_9_debug.log0;
         * Tier=T1;Server=S1;Instance=A1;TestRun=1;FileType=logs;Path=/tmp;TimeOut=10;DeleteFile=0;New file name=newFile.xml;FileSize=20
         */

        let fileType = "";

        if (this.messageFields.fileType != 'Custom') {
            fileType = this.messageFields.fileType;
        }
        else {
            fileType = this.messageFields.sourcePath; // If filetype is custom
        }

        let trNo = this.getTRNo();

        this.searchFileText = "";

        let message = "AgentType=" + this.messageFields.agentMode + ";FileName=" + this.selectedFile + ";Tier="
            + this.messageFields.tier + ";Server=" + this.messageFields.server + ";Instance=" + this.messageFields.instance
            + ";TestRun=" + trNo + ";FileType=" + fileType + ";Path=" + this.viewAdvanceSetting.destPath
            + ";TimeOut=" + this.messageFields.timeout + ";DeleteFile=0;"


        //Appenging new file name and and file size with the  message
        message = message + ";New file name=" + this.viewAdvanceSetting.newFileName + ";FileSize=" + this.fileSize

        this.configNdAgentService.downloadAgentFile(message, this.prodKey).subscribe(data => {

            if (data != "Error in downloading files") {
                this.configUtilityService.successMessage("File downloaded successfully at path : " + this.viewAdvanceSetting.destPath);
                this.fileContent = data;
                this.fileContent = Prism.highlight(data, Prism.languages.markup);
                this.fileHighLightContent = this.fileContent;
                this.showContentBox = true;
                //Setting file header name over textarea
                this.fileNameHeader = this.selectedFile;
            }
            else {
                this.configUtilityService.errorMessage("Error in downloading selected file");
            }

        })

        this.downloadDialog = false;

    }

    /** Get files list on clicking the directory(if any) */
    doubleClick(_file) {

        //On clicking any directory it should open its respective files
        this.fileNameOnClick = _file + "/";

        //show files of the selected directory on click of label
        this.showFiles();

    }

    /** To go back from the current folder */
    goBack() {

        //Custom case
        if (this.viewAdvanceSetting.sourcePath != "") {

            //if path ends with / i.e. /root/weblogic/coherence/
            if (this.viewAdvanceSetting.sourcePath.endsWith("/")) {

                this.viewAdvanceSetting.sourcePath = this.viewAdvanceSetting.sourcePath.substring(0, this.viewAdvanceSetting.sourcePath.lastIndexOf("/"))
            }

            // Removing last element from the path i.e. /root/weblogic/coherence will be /root/weblogic/
            this.viewAdvanceSetting.sourcePath = this.viewAdvanceSetting.sourcePath.substring(0, this.viewAdvanceSetting.sourcePath.lastIndexOf("/"))

        }
        this.showFiles()
    }

    /**
    * Purpose : To invoke the service responsible to open Help Notification Dialog 
    * related to the current component.
    */
    sendHelpNotification() {
        //currently only java agent is supported
        this.configKeywordsService.getHelpContent("Agent Logs", "Download Agent Logs", "");
    }

    //assign the copy of fileListArr in filteredItems
    assignCopy(){
        this.filteredItems = Object.assign([], this.fileListArr);
     }

     //Filter file names
     filterItem(value){
        if(!value){
            this.assignCopy();
        } // when nothing has typed
        this.filteredItems = Object.assign([], this.fileListArr).filter(
            it => {
                return it.toLowerCase().includes(value);}
        )
        // this.assignCopy();
     }

     //Search content in file opened
     searchContent(args){
        if (!args) { return this.fileContent; }
        var re = new RegExp(args, 'gi'); //'gi' for case insensitive and can use 'g' if you want the search to be case sensitive.
        this.fileHighLightContent = this.fileContent;
        this.fileHighLightContent =  this.fileHighLightContent.replace(re, "<mark>" + args + "</mark>");
      }
     
      //This method is used for sorting of file size.
      myFileSizeSort(event, fileFieldsData) {
          if (event["field"] == "fileSize") {
            if (event.order == -1) {
              var temp = (event["field"]);
              event.order = 1
              fileFieldsData = fileFieldsData.sort(function (a, b) {
                a[temp] = a[temp].toString();
                b[temp] = b[temp].toString();

                //Converting GB,MB,KB into bytes.
                if(a[temp].includes('GB'))
                {
                    a[temp] = a[temp].substring(0, a[temp].length-2);
                    a[temp] = Math.ceil(a[temp] * 1024*1024*1024);
                }
                else if(a[temp].includes('MB'))
                {
                    a[temp] = a[temp].substring(0, a[temp].length-2);
                    a[temp] = Math.ceil(a[temp] * 1024*1024);
                }
                else if(a[temp].includes('KB'))
                {
                    a[temp] = a[temp].substring(0, a[temp].length-2);
                    a[temp] = Math.ceil(a[temp] * 1024);
                }
                else if(a[temp].includes('B'))
                {
                    a[temp] = a[temp].substring(0, a[temp].length-1);
                    a[temp] = Math.ceil(a[temp]);
                }
                else
                {
                    a[temp] = Math.ceil(a[temp]);
                }   

                if(b[temp].includes('GB'))
                {
                    b[temp] = b[temp].substring(0, b[temp].length-2);
                    b[temp] = Math.ceil(b[temp] * 1024*1024*1024);
                }
                else if(b[temp].includes('MB'))
                {
                    b[temp] = b[temp].substring(0, b[temp].length-2);
                    b[temp] = Math.ceil(b[temp] * 1024*1024);
                }
                else if(b[temp].includes('KB'))
                {
                    b[temp] = b[temp].substring(0, b[temp].length-2);
                    b[temp] = Math.ceil(b[temp] * 1024);
                }
                else if(b[temp].includes('B'))
                {
                    b[temp] = b[temp].substring(0, b[temp].length-1);
                    b[temp] = Math.ceil(b[temp]);
                }   
                else
                {
                    b[temp] = Math.ceil(b[temp]);
                }

                //If a[temp] / b[temp] is coming "-" then we are connverting it to -1 so that we can sort the values
                if (a[temp] == "-")
                  a[temp] = "-1";
                else if (b[temp] == "-")
                  b[temp] = "-1";
                var value = parseInt(a[temp]);
                var value2 = parseInt(b[temp]);
                return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
              });
            }
            else {
              var temp = (event["field"]);
              event.order = -1;
              //asecding order
              fileFieldsData = fileFieldsData.sort(function (a, b) {
                a[temp] = a[temp].toString();
                b[temp] = b[temp].toString();

                //Converting GB,MB,KB into bytes.
                if(a[temp].includes('GB'))
                {
                    a[temp] = a[temp].substring(0, a[temp].length-2);
                    a[temp] = Math.ceil(a[temp] * 1024*1024*1024);
                }
                else if(a[temp].includes('MB'))
                {
                    a[temp] = a[temp].substring(0, a[temp].length-2);
                    a[temp] = Math.ceil(a[temp] * 1024*1024);
                }
                else if(a[temp].includes('KB'))
                {
                    a[temp] = a[temp].substring(0, a[temp].length-2);
                    a[temp] = Math.ceil(a[temp] * 1024);
                }
                else if(a[temp].includes('B'))
                {
                    a[temp] = a[temp].substring(0, a[temp].length-1);
                    a[temp] = Math.ceil(a[temp]);
                }   
                else
                {
                    a[temp] = Math.ceil(a[temp]);
                }

                if(b[temp].includes('GB'))
                {
                    b[temp] = b[temp].substring(0, b[temp].length-2);
                    b[temp] = Math.ceil(b[temp] * 1024*1024*1024);
                }
                else if(b[temp].includes('MB'))
                {
                    b[temp] = b[temp].substring(0, b[temp].length-2);
                    b[temp] = Math.ceil(b[temp] * 1024*1024);
                }
                else if(b[temp].includes('KB'))
                {
                    b[temp] = b[temp].substring(0, b[temp].length-2);
                    b[temp] = Math.ceil(b[temp] * 1024);
                }
                else if(b[temp].includes('B'))
                {
                    b[temp] = b[temp].substring(0, b[temp].length-1);
                    b[temp] = Math.ceil(b[temp]);
                }  
                else
                {
                    b[temp] = Math.ceil(b[temp]);
                }
                //If a[temp] / b[temp] is coming "-" then we are connverting it to -1 so that we can sort the values
                if (a[temp] == "-")
                  a[temp] = "-1";
                else if (b[temp] == "-")
                  b[temp] = "-1";
                var value = parseInt(a[temp]);
                var value2 = parseInt(b[temp]);
                return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
              });
            }
          }
          this.fileFieldsData = [];
          fileFieldsData.forEach(element => {
            //If element.fileSize is coming -1 then it will reset the value of same to "-"
            if (element.fileSize == "-1")
              element.fileSize = "-";

              //converting bytes into KB, MB and GB.
              if(element.fileSize >= 1024*1024*1024)
              {
                  element.fileSize = element.fileSize / (1024*1024*1024);
                  if(element.fileSize.toString().includes('.'))
                    element.fileSize = element.fileSize.toFixed(1) + "GB";
                  else
                  element.fileSize = element.fileSize + "GB";
              }
              else if(element.fileSize >= 1024*1024)
              {
                  element.fileSize = element.fileSize / (1024*1024);
                  if(element.fileSize.toString().includes('.'))
                   element.fileSize = element.fileSize.toFixed(1) + "MB";
                  else
                  element.fileSize = element.fileSize + "MB";
              }
              else if(element.fileSize >= 1024)
              {
                  element.fileSize = element.fileSize / 1024;
                  if(element.fileSize.toString().includes('.'))
                   element.fileSize = element.fileSize.toFixed(1) + "KB";
                  else
                   element.fileSize = element.fileSize + "KB";
              }
              else 
              {
                element.fileSize = element.fileSize + "B";
              }
            this.fileFieldsData = this.fileFieldsData.concat(element);
          });
        }

}
