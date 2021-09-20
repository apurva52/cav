import { Component, OnInit, Input, SimpleChanges, AfterViewInit, OnChanges, Output } from '@angular/core';
import { jsPlumb } from 'jsplumb';
import { MetadataService } from '../../../home/home-sessions/common/service/metadata.service';
import { Metadata } from '../../../home/home-sessions/common/interfaces/metadata';
import { NvhttpService, NVPreLoadedState, NVPreLoadingErrorState, NVPreLoadingState } from 'src/app/pages/home/home-sessions/common/service/nvhttp.service';
import { FlowchartDataSource } from './flowchartdatasource'
import { MessageService } from 'primeng';
import { jsPlumbSurfaceComponent, jsPlumbMiniviewComponent } from "jsplumbtoolkit-angular";
import { jsPlumbToolkitModule } from "jsplumbtoolkit-angular";
import * as $ from 'jquery';
import { Store } from 'src/app/core/store/store';
@Component({
  selector: 'app-flowchart',
  templateUrl: './flowchart.component.html',
  styleUrls: ['./flowchart.component.scss']
})
export class FlowchartComponent implements AfterViewInit {
  //@ViewChild(FlowchartComponent) flowchart:FlowchartComponent;
  //@ViewChild(DatasetComponent) dataset:DatasetComponent;
  jsPlumbInstance;
  currenttop: any;
  validitypagelist: any;
  validitypagelistt: any;
  currentleft: any;
  instance: any;
  container: any;
  pagetypechecking: any;
  finaleditpagename: any;
  finalpagetype: any;
  msgs: any;
  lastid: any;
  nodeToBeAssigned: any;
  conn: any;
  counter = 0;
  JQry: any;
  automation: any = false;
  gname: any;
  gtype: any;
  flowdata: any;
  options: any[];
  //flags.
  nodeFlag: boolean;
  setup: boolean = false;
  confirmdialog: boolean = false;
  connflag: boolean = false;
  //form controls
  nameSelect: any;
  typeSelect: any;
  confirmation: any;
  //jsPlumb declarations
  targetEndpoint: any;
  sourceEndpoint: any;
  onloadnodeFlag: boolean = false;
  endpointHoverStyle: any;
  endpointPaintStyle: any;
  connectorPaintStyle: any;
  connectorHoverStyle: any;
  anEndpointDestination: any;
  bpid: any;
  windows: any = [];
  positionleft: any = [];
  positiontop: any = [];
  wintype: any = [];
  winid: any = [];
  winhtml: any = [];
  tempwin: any;
  finalstring: any = null;
  tempString: any;
  positionstring: any = null;
  lastValue: any;
  nextValue: any;
  pageType: any;
  //main vars
  pages: any;
  connections: any = [];
  bpdata: any;
  bpposition: any;
  pageName: any;
  pageName2: any;

  @Input() item;
  @Input() saveFlag;
  @Input() load;
  metadata: Metadata = null;
  @Input() currentData;
  @Input() ranm;

  constructor(private metadataService: MetadataService, private messageService: MessageService, private httpService: NvhttpService) {
    this.metadata = new Metadata();
    this.instance = jsPlumb.getInstance({
      DragOptions: {
        cursor: 'pointer',
        zIndex: 2000
      },
      ConnectionOverlays: [
        ["Arrow", {
          location: 1
        }],
        ["Label", {
          location: 0.1,
          //id: "label",
          //cssClass: "aLabel"
        }]],
      Container: this.container
    });
    this.metadataService.getMetadata().subscribe(response => {
      this.metadata = response;
      let pagem: any[] = Array.from(this.metadata.pageNameMap.keys());
      this.pageName = pagem.map(key => {
        return { label: this.metadata.pageNameMap.get(key).name, value: this.metadata.pageNameMap.get(key).name }
      });
      // having a copy of it , so that can be shown in drop down and can alter its value
      this.pageName2 = this.pageName.slice();
      console.log("pageName : " + this.pageName + "this.pageName2  : " + this.pageName2);
    });
  }
  ngOnInit() {
    console.log("datsss", this.currentData, this.load, this.saveFlag)
    this.bpid = this.currentData.bpid;
    this.pageType = [{ label: "Mandatory", value: "Mandatory" },
    { label: "Optional", value: "optional" },
    { label: "Entry", value: "Entry" }];
    console.log("iddd", this.bpid)
  }

  ngAfterViewInit() {
    this.bindPlumb();
  }
  bindPlumb() {
    let root = this;
    console.log("inside jsPlumb");
    root.instance["bind"]("connection", function (connInfo, originalEvent) {
      console.log("connection " + connInfo.id + " was moved " + originalEvent);
      root.instance["repaintEverything"]();
    });
    root.instance["bind"]("connectionDrag", function (connection) {
      console.log("1.connectionDrag " + connection.id + " is being dragged. suspendedElement is ", connection.source.id, " of type ", connection.targetId);
    });

    root.instance["bind"]("connectionDragStop", function (connection) {
      console.log("3.connectionDragStop " + connection + " was dragged");
      root.instance["repaintEverything"]();
    });

    root.instance["bind"]("connectionMoved", function (params) {
      console.log("2.connectionMoved " + params + " was moved");
      root.instance["repaintEverything"]();
    });

  }
  ngOnChanges(changes: SimpleChanges) {
    //let root = this;
    //this.deleteAnchor();
    console.log("ngonchanges");
    this.JQry = jQuery.noConflict();
    //to declare insance of jsPlumb.
    console.log("cnnctbnglines");
    //jsPlumb["draggable"](this.JQry(".window"));
    this.container = document.getElementById("bpDig");
    this.endpointHoverStyle = {
      fill: "#216477",
      stroke: "#216477",
      paintStyle: {
        fillStyle: "#7AB02C",
        radius: 1,
        strokeWidth: 1
      }

    };
    this.connectorPaintStyle = {
      strokeWidth: 4,
      strokeStyle: "#61B7CF",
      joinstyle: "round",
      //outlineColor: "white",
      outlineStroke: "rgb(97, 183, 207)",
      outlineWidth: 1
    };
    this.endpointPaintStyle = {
      stroke: "#7AB02C",
      endpoint: "Dot",
      paintStyle: {
        fillStyle: "#7AB02C",
        radius: 2,
        strokeWidth: 1
      }
    };

    this.connectorHoverStyle = {
      srokeWidth: 2,
      strokeStyle: "#216477",
      outlineWidth: 2,
      outlineColor: "white"
    };
    this.sourceEndpoint = {
      endpoint: "Dot",
      paintStyle: {
        fillStyle: "#7AB02C",
        radius: 5,
        strokeWidth: 1
      },
      isSource: true,
      maxConnections: -1,
      connector: ["Flowchart", {
        stub: [3, 4],
        gap: 5,
        cornerRadius: 1,
        alwaysRespectStubs: true
      },
      ],
      connectorOverlays: [
        ["Arrow", {
          width: 7,
          length: 20,
          location: 1,
          id: "arrow"
        }]],
      connectorStyle: this.connectorPaintStyle,
      endpointStyle: this.endpointPaintStyle,
      hoverPaintStyle: this.endpointHoverStyle,
      connectorHoverStyle: this.connectorHoverStyle,
      dragOptions: {},
      overlays: [
        ["Label", {
          location: [0.5, 1.5],
          //label: "",
          cssClass: "endpointSourceLabel"
        }]]
    };
    this.targetEndpoint = {
      type: "Dot",
      paintStyle: {
        strokeStyle: "#7AB02C",
        fillStyle: "blue",
        outlineColor: "black",
        radius: 5,
        lineWidth: 10
      },
      hoverPaintStyle: this.endpointHoverStyle,
      maxConnections: -1,
      dropOptions: {
        hoverClass: "hover",
        activeClass: "active"
      },
      isTarget: true,
      overlays: [
        ["Label", {
          location: [0.5, -0.5],
          //label: "",
          cssClass: "endpointTargetLabel"
        }]]
    };

    this.anEndpointDestination = {
      endpoint: "Dot",
      isSource: true,
      isTarget: true,
      maxConnections: -1,
      anchor: "AutoDefault"
    };

    this.bpid = this.currentData.bpid;
    if (this.saveFlag == true) {
      console.log("save", this.saveFlag)
      this.getConn();
      this.connflag = true;
    }
    console.log("datsss", this.currentData)
    this.pageName2 = this.pageName;
    if (this.currentData.bppagelist == "" && this.currentData.bppositionlist == "" && this.connflag != true) {
      console.log("setup");
      this.cleanUp();
      if (this.currentData.bppagelist.length < 1) {
        let startConn = this.instance.getConnections({ source: "start" });
        console.log("ngonchngewwww", startConn);
        if (startConn.length) {
          console.log("enteronchngewww")
          document.getElementById('addbtn').style.display = 'block';
        }
      }

      this.setup = true;

      this.setupWindow("start");
      this.setupWindow("finish");

    }
    else {
      this.setup = false;
      this.load = true;
      this.loadConn();
      this.bindPlumb();
    }
    console.log("this.saveFlag", this.saveFlag);
    if (this.saveFlag == true)
      //this.getConn();
      /*if(this.load == true)
        this.loadConn();
            */
      this.onloadnodeFlag = false;
    console.log("flowchart currrentdata ", this.currentData);


    var root = this;
    this.instance["bind"]("click", function (conn, originalEvent) {
      var arr = root.instance["select"]({
        source: conn.sourceId,
        target: conn.targetId,
      });

      console.log("Clicked :  " + conn + " --- " + arr.length + " --- " + arr);
      if (arr.length > 0) {

        console.log("Delete connection from " + conn.sourceId + " to " + conn.targetId + "?");
        var r = confirm("Delete this connection");
        if (r == true)
          try {
            root.instance["detach"](conn);
          } catch (e) {
            console.log("detach exc : " + e);
            root.instance.deleteConnection(conn);
          }
        if (r == false) return false;
      }
      var evt = originalEvent;
      if (evt.stopPropagation) evt.stopPropagation();
      if (evt.cancelBubble != null) evt.cancelBubble = true;

    });

  }

  //-------jsPlumb functions-------
  //function to set up endpoints on elements.
  setupWindow(id) {
    console.log("idd", id, this.sourceEndpoint, this.targetEndpoint);
    /*this.instance.draggable(this.JQry('#' + id), {
            containment: "#bpDig"
          });*/
    if (id != "start") {
      this.instance.addEndpoint(
        this.JQry('#' + id), this.targetEndpoint, {
        anchor: "LeftMiddle",
        uuid: id + "LeftMiddle"
      });
    }
    if (id != "finish" && id != "start") {
      this.instance.draggable(this.JQry('#' + id), {
        containment: "#bpDig"
      });
      this.instance.addEndpoint(
        this.JQry('#' + id), this.sourceEndpoint, {
        anchor: "RightMiddle",
        uuid: id + "RightMiddle"
      });
    }
    if (id == "start") {
      this.instance.addEndpoint(
        this.JQry('#' + id), this.sourceEndpoint, {
        anchor: "RightMiddle",
        uuid: id + "RightMiddle",
        maxConnections: 1
      });
    }
  }

  //function called on addition of new node.
  doadd(target, currentleft, currenttop) {
    console.log("tops", currentleft, currenttop)
    this.pagetypechecking = '';
    console.log("pagelisttttt", this.currentData.bppagelist)
    console.log("doadd ", this.nodeFlag, this.onloadnodeFlag, "lastID:  " + this.lastid);
    if (this.onloadnodeFlag == true) {
      console.log("it should be false");
      this.nodeFlag = false;
    }
    else {
      this.nodeFlag = true;
    }
    //if(this.onloadnodeFlag != true  || this.nodeFlag == undefined || this.nodeFlag == false)
    //this.nodeFlag = true;
    //if(this.nodeFlag == false)
    //this.nodeFlag = true;
    //else{ 
    //this.nodeFlag = true;
    // }
    console.log("target ", target);
    this.pagetypechecking = target;
    /* if(target == "start")
     {
      this.pageType = [{ label: "Entry" , value: "Entry"}];
     }
     else {
       this.pageType = [{label: "Mandatory" , value: "Mandatory" },
               { label: "Optional" , value: "optional" },
               { label: "Entry" , value: "Entry"}];
        }*/
    let startConn = this.instance.getConnections({ source: "start" });
    if (startConn.length < 1) {
      console.log("doaddstart", startConn.length)
      document.getElementById('addbtn').style.display = 'none';
    }

    if (target == "start") {
      //typeSelect = "entry" ; 	
    }

    //assign id to the new node.
    let id = "dynamic_" + this.counter;
    console.log("id ", id);
    this.counter++;

    //let JQry = jQuery.noConflict();
    //add new window by using div with id container0 as template.
    let newDiv = this.JQry('<div  class="window" id="' + id + '" >').appendTo('#bpDig').html(this.JQry(("#container0"))[0].innerHTML.replace(/replaceWithId/g, id).replace(/replaceWithName/g, this.nameSelect));
    console.log("newDiv ", newDiv);

    let root = this;
    let elm = document.getElementById("" + id).querySelector("a");
    elm.addEventListener("click", () => { root.doadd(id, '', ''); }, false);

    this.removeAddButton(target);

    let elm1 = document.getElementById("" + id).querySelectorAll("a");
    let elm2 = document.getElementById("" + id).children[1];
    console.log("-elm1- ", elm1, id, target);
    elm1[2].addEventListener("click", () => { root.showdelete(id); }, false);
    //if(elm[1].attributes.innerHTML == '')
    elm1[1].addEventListener("click", () => { root.showassign(id); }, false);
    //if(elm[1].attributes.innerText == "Assign")
    elm1[1].addEventListener("click", () => { root.reassign(id); }, false);
    if (elm2 != undefined)
      elm2.addEventListener("dblclick", () => { root.showassign(id); }, false);
    console.log("--test-- ", document.getElementById("delete"));
    if (this.currentData.bppositionlist != "") {
      console.log("enter");
      document.getElementById(id).style.top = currenttop;
      document.getElementById(id).style.left = currentleft;
    }
    if (this.nodeFlag == true) {
      document.getElementById(id).style.top = (parseInt(document.getElementById(target).style.top)) + "px";
      document.getElementById(id).style.left = (parseInt(document.getElementById(target).style.left) + 150) + "px";
    }
    this.lastid = id;
    this.setupWindow(id);
    console.log("target ", target, "id ", id, " lastID: " + this.lastid + " --DO ADD--");
    this.instance.connect({
      uuids: [target + "RightMiddle", id + "LeftMiddle"],
      editable: true
    });

    if (this.automation == false)
      this.showassign(id);
    else
      this.doassign(id);
    return null;
  }

  removeAddButton(target) {
    console.log("dede", document.getElementById("" + target));
    if (document.getElementById("" + target) == null)
      return;
    let node = document.getElementById("" + target).querySelector('#addbtn');
    console.log("removeAddButton node ", node);
    node["style"]["display"] = 'block';
  }

  showassign(id) {
    let editpagename = document.querySelector('#' + id);
    this.finaleditpagename = editpagename.childNodes[2]["innerText"];
    this.finalpagetype = editpagename.childNodes[1]["innerText"];
    console.log("valuesassign", this.finaleditpagename, this.finalpagetype)
    if (this.finaleditpagename != '' || this.finaleditpagename != undefined) {
      this.nameSelect = this.finalpagetype;
      if (this.finaleditpagename == "entry")
        this.typeSelect = "Entry";
      if (this.finaleditpagename == "Optional" || this.finaleditpagename == "optional")
        this.typeSelect = "optional";
      if (this.finaleditpagename == "Mandatory")
        this.typeSelect = "Mandatory";
    }
    //this.onloadnodeFlag = true;
    //this.doadd(id,'','');
    console.log("sgsg", id);
    this.nodeFlag = true;
    //funtion to manipulate the options of page name and page type.
    this.nodeToBeAssigned = id;
  }

  doassign(id) {
    console.log("doassignidd", id)
    document.getElementById(id).childNodes[1]["innerHTML"] = this.gname;
    document.getElementById(id).childNodes[1]["title"] = this.gname;
    document.getElementById(id).childNodes[2]["innerHTML"] = this.gtype;
    console.log("3333", this.gtype);
    if (this.gtype == "entry") {
      document.getElementById(id).style.backgroundColor = "rgb(255, 243, 126)";
    }
    else if (this.gtype == "optional") {
      document.getElementById(id).style.backgroundColor = "rgb(255, 161, 161)";
    } else {
      document.getElementById(id).style.backgroundColor = "rgb(154, 253, 147)";
    }
  }

  assign() {
    this.msgs = [];
    //to change pageName and pageType
    console.log("matchuu", this.nameSelect, this.currentData.bppagelist)
    this.validitypagelist = this.currentData.bppagelist.split(",");
    console.log("matching", this.validitypagelist, this.nameSelect)
    for (var j = 0; j < this.validitypagelist.length; j++) {
      if (this.validitypagelist[j].includes(":")) {
        let d = this.validitypagelist[j];
        console.log("splited")
        this.validitypagelist[j] = this.validitypagelist[j].split(":")[0];
        console.log("matc", this.validitypagelist)
      }

      if (this.validitypagelist[j].includes("[")) {
        let a = this.validitypagelist[j].replace("[", "")
        let b = a.replace("]", "");
        this.validitypagelist[j] = b;
      }
      console.log("matci", this.validitypagelist)
      if (this.finalpagetype == "Assign") {
        if (this.nameSelect == this.validitypagelist[j]) {
          this.messageService.add({ key: 'bp-flowchart', severity: 'warn', summary: 'This Pagename is Already Added Please Select Other Page Name', detail: '' });
          return;
        }
      }
      if (this.finalpagetype != "Assign") {
        if (this.nameSelect == this.validitypagelist[j]) {
          if (this.typeSelect == this.finaleditpagename) {
            this.messageService.add({ key: 'bp-flowchart', severity: 'warn', summary: 'This Pagename is Already Added Please Select Other Page Name', detail: '' });
            return;
          }
        }
      }

    }
    if (this.pagetypechecking == "start" && this.typeSelect != "Entry") {
      this.messageService.add({ key: 'bp-flowchart', severity: 'warn', summary: 'For the First Node only the Entry Page Type Will be Assigned', detail: '' });
      return;
    }
    if (this.nameSelect == undefined || this.nameSelect == "undefined") {
      this.messageService.add({ key: 'bp-flowchart', severity: 'warn', summary: 'Please  Select Page Name', detail: '' });
      return;
    }
    var root = this;
    // remove the used page name 
    var filtered = this.pageName2.filter(function (value, index, arr) {
      return value.value != root.nameSelect;
    });
    console.log("filtered : " + filtered);
    this.pageName2 = filtered;
    console.log("type : " + this.typeSelect);
    console.log("document.getElementById ", document.getElementById(this.nodeToBeAssigned));
    document.getElementById(this.nodeToBeAssigned).childNodes[1]["innerHTML"] = this.nameSelect;
    document.getElementById(this.nodeToBeAssigned).childNodes[1]["title"] = this.nameSelect;
    document.getElementById(this.nodeToBeAssigned).childNodes[2]["innerHTML"] = this.typeSelect;
    console.log("this.nameSelect--", this.nameSelect, this.typeSelect)
    if (this.typeSelect == "Entry" || this.typeSelect == undefined || this.typeSelect == "undefined") {
      console.log("entry", document.getElementById(this.nodeToBeAssigned));

      document.getElementById(this.nodeToBeAssigned).style.backgroundColor = "rgb(255, 243, 126)";
    }

    else if (this.typeSelect == "optional") {
      document.getElementById(this.nodeToBeAssigned).style.backgroundColor = "rgb(255, 161, 161)";
    } else {
      document.getElementById(this.nodeToBeAssigned).style.backgroundColor = "rgb(154, 253, 147)";
    }

    this.nodeFlag = false;
  }

  reassign(id) {
    //    alert("to do reassign");
    console.log("reassign", id);
    if (document.querySelector("#typeselect")["value"] != "") {
      if (document.getElementById(id).childNodes[5]["innerHTML"].trim() == "")
        document.querySelector("#typeselect")["value"] = "mandatory";
      else
        document.querySelector("#typeselect")["value"] = document.getElementById(id).childNodes[5]["innerHTML"].trim();
    }
    else
      document.querySelector("#typeselect")["value"] = "mandatory";

    this.showassign(id);

  }

  showdelete(target) {
    this.validitypagelistt = this.currentData.bppagelist.split(",");
    for (var j = 0; j < this.validitypagelistt.length; j++) {
      if (this.validitypagelistt[j].includes(":")) {
        let d = this.validitypagelistt[j];
        console.log("splited")
        this.validitypagelistt[j] = this.validitypagelistt[j].split(":")[0];
        console.log("matc", this.validitypagelistt)
      }

      if (this.validitypagelistt[j].includes("[")) {
        let a = this.validitypagelistt[j].replace("[", "")
        let b = a.replace("]", "");
        this.validitypagelistt[j] = b;
      }
    }



    //    document.getElementById('addbtn').style.display = '';
    let deletepagename = document.querySelector('#' + target);
    let finaldeletepagename = deletepagename.childNodes[1]["innerText"];
    console.log("trgtng", target, this.validitypagelistt, finaldeletepagename);
    var i = this.validitypagelistt.indexOf(finaldeletepagename);
    if (i != -1) {
      this.validitypagelistt.splice(i, 1);
    }
    let notfound = 0;
    if (finaldeletepagename != "Assign") {
      for (let i of this.pageName2) {
        if (finaldeletepagename == i.label)
          notfound++;
      }
    }
    if (!(notfound > 0) && finaldeletepagename != "Assign")
      this.pageName2.push({ label: finaldeletepagename, value: finaldeletepagename })
    this.conn = this.instance.getConnections({ target: target });
    //in some case there may be multiple connection.
    var sourceid = [];
    for (var z = 0; z < this.conn.length; z++) {
      sourceid.push(this.conn[z].sourceId);
    }
    //this.instance.detachAllConnections(document.getElementById(target));
    this.instance.removeAllEndpoints(document.getElementById(target));
    // this.instance.detach(document.getElementById(target));
    //target.parentNode.remove()
    this.JQry('#' + target).remove();
    this.AddEndPoits();
    //jsPlumb.repaintEverything();
    //now enable add button for i.
    var addBtn;
    for (var z = 0; z < sourceid.length; z++) {
      addBtn = document.querySelector('#' + sourceid[z] + ' div');
      if (addBtn != null) {
        var ab = addBtn.querySelector('#addbtn');
        addBtn.style.display = "block";
        ab.style.display = "block";
      }
    }
  }

  //group all the connections having same sourceId.
  startNodeTarget: any = {};
  conns: any; //jsPlumb instance to get all connections.

  getConn() {
    this.msgs = [];
    console.log("getConn called", this.saveFlag);
    let list = [];
    let finalstring = null;
    let positionstring = null;
    this.tempwin = null;

    this.tempwin = document.getElementById("bpDig").querySelectorAll(".window"); //contains all nodes in flowchart
    console.log("this.tempwin ", this.tempwin);
    this.windows = [];
    for (let i = 0; i < this.tempwin.length; i++) {
      this.winid[i] = this.tempwin[i].id;
      //console.log("this.tempwin[i] " , this.tempwin[i]);
      if (this.winid[i] == "start" || this.winid[i] == "finish") {
        this.windows[i] = this.winid[i];
        this.wintype[i] = "mandatory";
      }
      else {
        this.windows[i] = this.tempwin[i].childNodes[1].innerText;
        this.wintype[i] = this.tempwin[i].childNodes[2].innerText;
      }
      this.positionleft[i] = this.tempwin[i].style.left; //left position of every node
      this.positiontop[i] = this.tempwin[i].style.top;  //top position of every node

      this.winhtml[i] = encodeURI(this.tempwin[i].innerHTML);
      this.pages = this.pages + this.winid[i] + "," + this.windows[i] + "," + this.wintype[i] + "," + this.positionleft[i] + "," + this.positiontop[i] + "," + this.winhtml[i] + "\n";

    }
    console.log("this.windows ", this.windows);
    console.log("this.positionleft ", this.positionleft, "this.positiontop ", this.positiontop);
    console.log(" pages ", this.pages);

    for (let j = 0; j < this.windows.length; j++) {
      console.log("this.wintype[j]", this.wintype[j]);
      if (this.windows[j] != "start" && this.windows[j] != "finish") {
        let ex1 = "";
        let ex2 = "";
        if (this.wintype[j] == "Optional" || this.wintype[j] == "optional") {
          ex1 = "[";
          ex2 = "]";
        }
        if (this.wintype[j] == "Entry" || this.wintype[j] == "entry") {
          ex1 = "";
          ex2 = ":E";
        }
        if (finalstring != null)
          finalstring = finalstring + "," + ex1 + this.windows[j] + ex2;
        else
          finalstring = ex1 + this.windows[j] + ex2;
        if (positionstring != null)
          positionstring = positionstring + ";" + this.windows[j] + "," + this.positionleft[j] + "," + this.positiontop[j];
        else
          positionstring = this.windows[j] + "," + this.positionleft[j] + "," + this.positiontop[j];
        console.log("finalstring = " + finalstring + "positionstring = " + positionstring);
      }
      if (this.tempwin.length > 2) {
        this.bpdata = finalstring;
      } else {
        this.bpdata = "";
      }
      this.bpposition = positionstring;
    }

    this.currentData.bppagelist = this.bpdata;
    this.currentData.bppositionlist = this.bpposition;

    console.log("this.currentData ", this.currentData);

    console.log("bpdata ", this.bpdata);
    console.log("bpposition ", this.bpposition);
    this.flowdata = new FlowchartDataSource(this.bpid, this.bpposition, this.bpdata)
    console.log("datadd", this.flowdata);
    this.httpService.SaveFlowChart(this.flowdata).subscribe((state: Store.State) => {
      if (state instanceof NVPreLoadingState) {

      }

      if (state instanceof NVPreLoadedState) {
        if (state.data)
          this.messageService.add({ key: 'bp-flowchart', severity: 'success', summary: 'Saved Successfully', detail: '' });
        this.metadataService.refreshMetadata();
        this.getdata();
        console.log("ree", state.data);
      }

    }, (state: Store.State) => {
      if (state instanceof NVPreLoadingErrorState) {
        this.messageService.add({ key: 'bp-flowchart', severity: 'error', summary: 'Error', detail: 'Failed to save the BP flow.' })
      }
    });
  }

  indexOf(lookingForValue, array) {
    console.log(lookingForValue + "array :" + array);
    for (let i in array) {
      if (array[i] == lookingForValue) {
        return i;
      }
    }
    return undefined;
  }

  loadConn() {
    this.onloadnodeFlag = true;
    this.connflag = false;
    this.cleanUp();
    this.setupWindow("start");
    this.setupWindow("finish");

    let nameToId = {};
    let spliteddata = this.currentData.bppositionlist.split(";");
    //this.bpposition = document.getElementById("bpposition")["value"];
    for (var i = 0; i < spliteddata.length; i++) {
      this.windows[i] = spliteddata[i].split(",")[0];
      this.positionleft[i] = spliteddata[i].split(",")[1];
      this.positiontop[i] = spliteddata[i].split(",")[2];
    }
    console.log("strtttt : " + JSON.stringify(this.currentData));
    if (this.currentData.bppagelist.length < 1) {
      let startConn = this.instance.getConnections({ source: "start" });
      if (startConn.length == 0) {
        document.getElementById('addbtn').style.display = 'block';
      }
      return;
    }
    else {
      console.log("pagelist", this.currentData.bppagelist)
      //this.pagelisttype = this.currentData.bppagelist;
      let bpdata = "start," + this.currentData.bppagelist;
      let bpdata2 = bpdata;
      console.log("bpdataaa", bpdata, bpdata2);
      console.log("pagelisttttt", this.currentData.bppagelist)
      //bpdata = bpdata2.replace(/[()]/g, "").replace(/[|;]/g, ',');
      //bpdata = bpdata2.replace(/\[/g,"").replace(/]/g,"").replace(/:E/g,"");
      // bpdata = bpdata2.replace(/[()]/g, "").replace(/[|;]/g, ',');
      bpdata = bpdata2.replace(/[()]/g, "").replace(/[|;]/g, ',');
      console.log("bpdata : " + bpdata);
      let tempdata = bpdata.split(",");

      let entryNodeHash = {};
      entryNodeHash[tempdata[0]] = [];
      entryNodeHash[tempdata[0]].push("start");
      for (let i = 1; i < tempdata.length; i++) {
        console.log("tempdata[" + i + "] : " + tempdata[i]);
        entryNodeHash[tempdata[i]] = [];
        entryNodeHash[tempdata[i]].push(tempdata[i - 1]);
      }
      console.log("entryNodeHash ", entryNodeHash);
      this.automation = true;
      this.lastid = "start";

      nameToId["start"] = "start";
      let curid, nodename;
      for (let j = 1; j < tempdata.length; j++) {
        nodename = this.getName(tempdata[j]);
        curid = null;
        if (tempdata[j] == "finish") {
          this.instance.connect({
            uuids: [this.lastid + "RightMiddle", "finishLeftMiddle"],
            editable: true
          });
          break;
        }
        //lastid = nameToId[entryNodeHash[nodename]];
        // doing like this since  making single connections , BRANCHES DISABLED
        //lastid = entryNodeHash[nodename][0];
        this.currenttop = this.positiontop[this.indexOf(this.getName(tempdata[j]), this.windows)];
        this.currentleft = this.positionleft[this.indexOf(this.getName(tempdata[j]), this.windows)];
        this.gname = this.getName(tempdata[j]);
        this.gtype = this.getType(tempdata[j]);
        //console.log("currentleft " , currentleft , " currenttop " , currenttop , " gname " , this.gname , " gtype " , this.gtype);
        console.log(" gname ", this.gname, " gtype ", this.gtype);
        console.log("idss", this.lastid)
        this.doadd(this.lastid, this.currentleft, this.currenttop);
        //now set the updated id.
        nameToId[this.gname] = this.lastid;
        curid = this.lastid;
      }

      if (tempdata[tempdata.length] != "finish" && tempdata.length > 1) {
        this.instance.connect({
          uuids: [this.lastid + "RightMiddle", "finishLeftMiddle"],
          editable: true
        });
      }
      this.automation = false;
    }
    this.onloadnodeFlag = false;
    this.deleteAnchor();
  }

  cleanUp() {
    this.currentData.bpposition = '';
    this.currentData.bpdata = '';
    if (this.currentData.bppagelist != null || this.currentData.bppagelist != undefined || this.currentData.bppagelist != '') {
      console.log("crrr", this.currentData.bppagelist.length)
      if (this.currentData.bppagelist.length < 1) {
        let startConn = this.instance.getConnections({ source: "start" });
        if (startConn.length > -1) {
          console.log("atrt", startConn.length)
          this.AddEndPoits();
          document.getElementById('addbtn').style.display = 'block';
        }
      }
    }
    try {
      let conn1 = this.instance.getAllConnections();
      console.log("clean up connection length : " + conn1.length);
      for (let i = 0; i < conn1.length; i++) {
        this.instance.deleteConnection(conn1[i]);
      }


      //this.instance.detachAllConnections();
      this.instance.removeAllEndpoints();
    } catch (e) {

      console.log("Error  in clean up : " + e);
      let allDivs = document.querySelectorAll('[id^="dynamic_"]');
      for (let i = 0; i < allDivs.length; i++) {
        allDivs[i].parentElement.removeChild(allDivs[i]);
      }
      allDivs = document.querySelectorAll('svg');
      for (let i = 0; i < allDivs.length; i++) {
        allDivs[i].parentElement.removeChild(allDivs[i]);
      }
      allDivs = document.querySelectorAll('[class^="jtk"]');
      for (let i = 0; i < allDivs.length; i++) {
        allDivs[i].parentElement.removeChild(allDivs[i]);
      }
    }
    /*if (this.currentData.bppagelist.length < 1)  {
            let startConn = this.instance.getConnections({source: "start"});
             console.log("www",startConn.length);
            if(startConn.length)  {
              console.log("atrt",startConn.length)
              this.AddEndPoits();
              document.getElementById('addbtn').style.display = 'block';
            }
        }*/


  }


  /* cleanUp()
   {
    console.log("counter length : " +  this.counter);
    for (var i = 0; i < this.counter; i++) {
      try {
        var target = "dynamic_" + i;
        if(document.getElementById(target) != null)
        {
          this.instance.detachAllConnections(document.getElementById(target));
          this.instance.removeAllEndpoints(document.getElementById(target));
          this.JQry('#' + target).remove();
        }else{
           console.log("target not found : "+ target);
        } 
  
      } catch(err) {
        console.log("err at :" + i  +  " -- " + err);
      };
    }
  
   }*/

  getName(string) {
    if (string.startsWith("[")) {
      return string.slice(1, string.length - 1);
    }
    if (string.endsWith(":E")) {
      return string.slice(0, string.length - 2);
    }
    if (string.endsWith(":F")) {
      return string.slice(0, string.length - 2);
    }
    return string;
  }

  getType(string) {
    console.log("string---", string)
    if (string.startsWith("[")) {
      return "optional";
    }
    if (string.endsWith(":E")) {
      return "entry";
    }
    return "mandatory";
  }

  getdata() {
    this.httpService.getBusinessProcessData().subscribe((response: any) => {
      if (response != null && response.length > 0) {
        console.log("ree", response)
      }
      else {
      }
    });
  }

  //attach handler to delete connectons. 
  deleteAnchor() {
    console.log("anchors");
    let conn1 = this.instance.getAllConnections();
    console.log("startConn1 : " + conn1.length);
    let root = this;
    for (let i = 0; i < conn1.length; i++) {
      conn1[i].bind('click', function () {
        console.log("conn1[" + i + "] : " + conn1[i].sourceId);
        if (conn1[i].sourceId == "start") {
          console.log("startconnection enters", conn1[i])
          root.instance.addEndpoint(
            root.JQry('#start'), root.sourceEndpoint, {
            anchor: "RightMiddle",
            uuid: "startRightMiddle",
            maxConnections: 1
          });
          root.instance.addEndpoint(
            root.JQry('#' + conn1[i].targetId), root.targetEndpoint, {
            anchor: "LeftMiddle",
            uuid: conn1[i].targetId + "LeftMiddle",
            maxConnections: 1
          });


        }

        if (conn1[i].targetId == "finish") {
          console.log("iddcndn")
          root.instance.addEndpoint(
            root.JQry('#finish'), root.targetEndpoint, {
            anchor: "LeftMiddle",
            uuid: conn1[i].targetId + "LeftMiddle",
            maxConnections: 1
          });
        }
        var r = confirm("Delete this Connection");
        console.log("deleting conn", conn1[i])
        if (r == true) {
          root.instance.deleteConnection(conn1[i]);
        }
        //jsPlumb['detach'](conn1[i]);
        /* if(conn1[i].sourceId == "start")
         {
           console.log("startconnection enters",conn1[i]) 
           root.instance.addEndpoint(
              root.JQry('#start'), root.sourceEndpoint, {
                  anchor: "RightMiddle",
                  uuid: "startRightMiddle",
                  maxConnections : 1
              });
           root.instance.addEndpoint(
           root.JQry('#'+conn1[i].targetId),root.targetEndpoint,{
              anchor: "LeftMiddle",
              uuid : conn1[i].targetId +"LeftMiddle",
              maxConnections : 1
              });
  
  
         }*/
        console.log("conn1[" + i + "] :tar " + conn1[i].targetId);

        /*if(conn1[i].targetId == "finish")
        {
       console.log("iddcndn")    
        root.instance.addEndpoint(
             root.JQry('#finish'), root.targetEndpoint, {
                 anchor: "LeftMiddle",
                 uuid: conn1[i].targetId + "LeftMiddle",
                 maxConnections : 1
             });
       } */
        root.instance["repaintEverything"]();
      });
    }
    var endpoints = this.instance.getEndpoints("bpDig");
    console.log("endpoints : " + endpoints.length);

    var bpd = document.querySelector("#bpDig");
    var endpoints1 = this.instance.getEndpoints("bpd");
    console.log("endpoints1 : " + endpoints1.length);

  }

  AddEndPoits() {
    let conn1 = this.instance.getAllConnections();
    let root = this;

    for (let i = 0; i < conn1.length; i++) {
      console.log("addacnhor", conn1[i].sourceId);
      if (conn1[i].sourceId == "start") {
        console.log("startconnection enters", conn1[i])
        root.instance.addEndpoint(
          root.JQry('#start'), root.sourceEndpoint, {
          anchor: "RightMiddle",
          uuid: "startRightMiddle",
          maxConnections: 1
        });
        root.instance.addEndpoint(
          root.JQry('#start'), root.sourceEndpoint, {
          anchor: "RightMiddle",
          uuid: "startRightMiddle",
          maxConnections: 1
        });
        root.instance.addEndpoint(
          root.JQry('#' + conn1[i].targetId), root.targetEndpoint, {
          anchor: "LeftMiddle",
          uuid: conn1[i].targetId + "LeftMiddle",
          maxConnections: 1
        });


      }

      if (conn1[i].targetId == "finish") {
        root.instance.addEndpoint(
          root.JQry('#finish'), root.targetEndpoint, {
          anchor: "LeftMiddle",
          uuid: conn1[i].targetId + "LeftMiddle",
          maxConnections: 1
        });
      }


    }
  }
}









