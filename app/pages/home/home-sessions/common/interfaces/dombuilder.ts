  import { Inject, Injectable } from '@angular/core';
  import { DOCUMENT } from '@angular/common';
  import { nvEncoder } from './nvencode';
  //import { AppComponent } from '../../app.component';
  import { ReplayHandler } from './../../play-sessions/replay-handler';
 
  declare var resourceVersioningRules;

  const APPLY_CHANGES = 1;
  const REMOVE_CHANGES = 2;

  let  mapping = {
    "i" : "id" ,
    "t": "nodeType",
    "n" : "tagName",
    "a" :  "attributes" ,
    "c" : "childNodes" ,
    "T" :  "textContent" ,
    "p" : "parentNode" ,
    "s" : "previousSibling"
    }

  class  NodeMap
  {
    nodes : any[] = [];
    values : any[] = [];
    ID_PROP = "__ana__";
    nextId_ = 1;

    isIndex(str: any){
      return+str === str >>> 0;
    }
    nodeId(object: {}) {
      let next = object[this.ID_PROP];
      return next || (next = object[this.ID_PROP] = this.nextId_++), next;
    }
    set(elems: any, dataAndEvents:any) {
      let i = this.nodeId(elems);
      /** @type {Object} */ 
      this.nodes[i] = elems; 
      /** @type {Object} */
      this.values[i] = dataAndEvents;
    }
    get(elems: any) {
      let dom = this.nodeId(elems);
      return this.values[dom];
    }
    getNode(id :any) {
      return this.nodes[id];
    }
    has(elems: any) {
      return this.nodeId(elems) in this.nodes;
    }
    deletera(elems: any) { 
      let i = this.nodeId(elems);
      delete this.nodes[i];
      this.values[i] = void 0;
    }
    keys() {
      /** @type {Array} */
      let nodes = [];
      let nodeId: string | number;
      for (nodeId in this.nodes) {
        if (this.isIndex(nodeId)) {
          nodes.push(this.nodes[nodeId]);
        }
      }
      return nodes;
    }
    
  }

  export class DOMBuilder extends NodeMap {
    root : any; // this can be html element or document 
    nodeIdMap : Object;
    loading: boolean;
    loadIframe: boolean;
    userType: string;
    loadingIframe: number;
    loadingIframeElement: {};
    crossOriginIframe: any;
    pendingStylesheets: number;
    fetchURLFromRemoteServer: any;
    pageloadTimeoutTimer: number;
    blackList: any;
    rsaEncryptNode: boolean;
    pendingEncElements: any;
    rsaValueHash: any;
    rsaEncoder: any;
    url: string;
    URL: any;
    pendingElements: any;
    rh : ReplayHandler;
    // reference of other component
    ref : any;
    
    constructor(doc: Document, userType:string , rh:ReplayHandler , ref)
    {
      super();
      this.root = doc;
      console.log("root doc : ", document.location.href , " -fetchURLFromRemoteServer- ", ref.nvconfigurations.fetchURLFromRemoteServer);
      // document
      this.nodeIdMap = {}; 
      this.loading = true;
      //TODO: should be taken from kw.
      this.loadIframe = true; 
      this.userType = userType;
      this.loadingIframe = 0;
      this.loadingIframeElement = {};
      this.crossOriginIframe = "";
      this.pendingStylesheets = 0;
      this.fetchURLFromRemoteServer = ref.nvconfigurations.fetchURLFromRemoteServer;
      this.pageloadTimeoutTimer = -1;
      
      //This node map will be having list of encrypted and encoded elemnts.
      //Note: this will have 1- encrypted and 2 - encoded.
      this.blackList = new NodeMap;
      this.rsaEncryptNode = false;
      //Note: if value can not be encrypted because rsValueHash is not present then we will set that element in this NodeMap. 
      this.pendingEncElements = new NodeMap;
      this.rsaValueHash = null;
      this.rsaEncoder = null;
      //note: privateKey will be global.
      this.rh = rh;
      this.ref = ref;
      let canvas_style  = {'position': 'absolute','z-index': 1, 'opacity':'0'};
      let obj = {"key" : "setCanvasStyle", "data" : canvas_style};
      this.rh.broadcast('msg', obj);
    }
    initialize(nodes: any[], url : string)
    {
      console.log("dombuilder, this.fetchURLFromRemoteServer : ", this.fetchURLFromRemoteServer, " this.root : ", this.root);
      nodes = this.maxify(nodes);
      //window.DOMBuilderUrl = url; // simply keeping url in global letiable
      this.url = url;
      this.URL = this.getURL(this.url);
      // setting the doc again
      //console.log("AAA Assigned the replayIframe document to root");
      let iframeEle  = document.querySelector("#replayIframe");
      let win = iframeEle["contentWindow"];
      let iframe_document: Document = <Document> win.document;
      this.root = iframe_document;
      //console.log("AAA0  this.root : ", this.root, " this.rh.replayDocument  :", this.rh.replayDocument, " matched -- ", this.root === this.rh.replayDocument);
      // removing element from doc, if still persist    
      for (; this.root.firstChild; )
        this.root.removeChild(this.root.firstChild);
      //Quick mode.
      for (let r = 0; r < nodes.length; r++)
      this.addNode(nodes[r], this.root)
      //console.log("AAA Assigning root to iframe document and replay Document");
      let iframeEle1  = document.querySelector("#replayIframe");
      let win1 = iframeEle["contentWindow"];
      let iframe_document1: Document = <Document> win.document;
      iframe_document1 = this.root;
      this.rh.replayDocument = iframe_document1;
      //console.log("AAA1  this.root : ", this.root, " this.rh.replayDocument  :", this.rh.replayDocument, " matched -- ", this.root === this.rh.replayDocument);
      
      if(this.rsaEncryptNode)
      {
        this.rsaValueHash = {};
        //this.loadRsaEncryptedData();
        console.log("loadRsaEncryptedData");
      }
      //process all the pending elements.
      let pendingElements = this.pendingEncElements.keys();
      let ele: any, node: any;
      for(let z = 0; z < pendingElements.length; z++)
      {
        ele = pendingElements[z];
        node = this.pendingEncElements.get(ele);
        if(node) this.encValue(ele, node);
      }
      //set pageloadTimeoutTimer.
      let me = this;
      this.pageloadTimeoutTimer = <any>setTimeout(()=> {
        console.log('Page Load Timeout');
        me.loaded();
      }, 60000);
      //console.log("this.root : ", this.root);
      this.root.addEventListener('DOMContentLoaded', ()=> {
        //Check if there is no pending css then call loaded.
        console.log("pendingStylesheets left : " + me.pendingStylesheets);
        if(me.pendingStylesheets <= 0)
          me.loaded();
      });

      //delete this pendingElements.
      delete this.pendingElements;
    }

    maxify(input:any)
    {
      let out = null;
      if(input == undefined || input == null) return input;
      //Array 
      if(typeof input == "object")
      {
        if(typeof input.length != "undefined")
        { 
          out = new Array(input.length);
          for(let i = 0; i < input.length; i++)
          {
            out[i] = this.maxify(input[i]);
          }
          return out;
        }
        else
        {
          out = {};
          //Not needed to maxify already maxified. 
          if(typeof input["id"] != "undefined") return input;

          for(let key in input)
          {
          if(mapping[key])
          {
            //in case of attributes -  a no need to change the object because that can have letiable data. 
            if(key != "a")
              out[mapping[key]] = this.maxify(input[key]);
            else
              out[mapping[key]] = input[key];
          }
          else
            out[key] = this.maxify(input[key]);
          } 
          return out;
        }
      }
      else {
        return input;
      }
    }
    getURL(url: string)
    {
      let a = document.createElement('a');
      a.href = url;
      return a;
    }
    addNode(elementNode: any, parentNode:HTMLElement) {
      if (null === elementNode) return null;
      //TODO: check what happens in case of SCRIPT tag
      let context = this;
      // ele is that element, if found in id map , great, return element else find that element from id Map or create it
      // id map is a kind of hash that keeps unique value corresponding to each element.
      let ele = this.nodeIdMap[elementNode.id];
      if (ele ) return ele;
      //check if this is an old node then reutrn null.
      if (!elementNode.nodeType) return null;

      let ownerDocument: Document = <Document>this.root.ownerDocument;
      if (null === ownerDocument) 
        ownerDocument = this.root;
      switch (elementNode.nodeType) {
      case Node.COMMENT_NODE:
        ele =  ownerDocument.createComment(elementNode.textContent);
        break;
      case Node.TEXT_NODE:
        ele = ownerDocument.createTextNode(elementNode.textContent);
        break;
      case Node.DOCUMENT_TYPE_NODE:
        try {
          ele = ownerDocument.implementation.createDocumentType(elementNode.name, elementNode.publicId, elementNode.systemId)
        } catch(a) {
          console.log("ERROR: while creating document tag");
          return;
        }
        break;
        case Node.ELEMENT_NODE:
        try 
        {
          if( elementNode.tagName == "BASE")
          return;
          if(this.loadIframe == false && elementNode.tagName == 'IFRAME')
            return;

          // In case of object tag with type image/svg+xml, resource is loaded continuously, 
          // so , replacing it with img tag, keeping its data in src 
          // bug : 55815
          //Check if svg embedded as object then change that as image. 
          //reference - https://vecta.io/blog/best-way-to-embed-svg/
          if(elementNode.tagName == 'OBJECT' && elementNode.attributes && elementNode.attributes.type == 'image/svg+xml')
          {
            let content = "";
            let ele = ownerDocument.createElement('img');
            this.addBasePath.call(context, elementNode, ele, 'src', elementNode.attributes.data);
                // object has  childnodes that can be text content, in this case set that as image alt 
                if (elementNode.childNodes){
                for (let s = 0; s < elementNode.childNodes.length; s++)
                {
                  let cn = elementNode.childNodes[s];
                  if(cn.nodeType == Node.TEXT_NODE)
                  {
                    content += cn.textContent;
                  }
                }
            }
            if(content != "")
              ele.setAttribute("alt",content);
            if(parentNode) parentNode.appendChild(ele);
            return;
            }

            if (this.createElement && this.createElement)
              ele = this.createElement(elementNode);
            if (!ele)
              ele = ownerDocument.createElement(elementNode.tagName);
    
          } catch(a) {
            try {
              //TODO: check when this case will occure.
              console.log("WARNING: creating elementNode", elementNode),
              ele = ownerDocument.createElement(elementNode.tagName.replace(/</gi, "").replace(/>/gi, "").replace(/&/gi, "").replace(/"/gi, "").replace(/'/gi, "").replace(/=/gi, "").replace(/;/gi, ""))
            } catch(a) {
              console.log("ERROR: while creating elementNode", elementNode)
            }
          }
    
          if (!ele) return console.warn("ELEMENT NOT FOUND");
          let base = null;
          Object.keys(elementNode.attributes || {}).forEach(function(attribute) {
            if ("LINK" == ele.tagName && "href" == attribute.toLowerCase() && elementNode.attributes.rel && "stylesheet" == elementNode.attributes.rel.toLowerCase()) 
            {
              //Add check for failed.
              if (ele.tagName && elementNode.attributes.failed != true)
                context.addBasePath.call(context, elementNode, ele, attribute);
              context.waitForStylesheet(ele);
              //TODO: check what href need to be set in case of failure..
            } 
            else
            //we already added base tag in context.delegate method but there we don't have setAttribute
            if ("BASE" == ele.tagName && "href" == attribute.toLowerCase()) 
            {
              base = ele.tagName;
              //If relative path is given then we will add path of current url and will make that absoulte.
              if (base) 
                context.addBasePath.call(context, elementNode, ele, attribute);
            } else
            // handling for img src
            if (("IFRAME" == ele.tagName || "IMG" == ele.tagName) && "src" == attribute.toLowerCase() ) 
            {
              //Note: If failed attribute is true then don't set the href. 
              if(elementNode.attributes.failed != true)
              {
                base = ele.tagName;
                //If relative path is given then we will add path of current url and will make that absoulte.
                if (base) 
                  context.addBasePath.call(context, elementNode, ele, attribute);
              }
              //TODO: check what if we do not specify image. 
            }
            else if(ele.tagName.toUpperCase() == "OBJECT" && attribute.toLowerCase() == "data") {
              context.addBasePath.call(context, elementNode, ele, attribute);
            }
            else {
              context.pAttributeSetter(ele, attribute, elementNode.attributes[attribute]);
            }

        })
      }

      //decrypt this element.
      this.encValue(ele, elementNode);

      //Check for encryption or encoded flag. 
      if(ele.nodeType == Node.ELEMENT_NODE) {
        if(typeof ele.className != "object" && ele.className.indexOf('nvEncrypted') != -1)
          this.blackList.set(ele, 1);
          if(typeof ele.className != "object" && ele.className.indexOf('nvSensitive') != -1)
          this.blackList.set(ele, 2);
      }

      this.nodeIdMap[elementNode.id] = ele
      //set it's id on node level.
      ele.__nvid = elementNode.id;

      if (parentNode)
      {
          if(parentNode.tagName && parentNode.tagName == "IFRAME")
          {
            let iframeDocument : Document;
            try{
                iframeDocument = parentNode["contentDocument"];
            }
            catch(e){
              console.log("Failed to access iframe document, it can be different origin issue.");
              return ele;
            }
            if(iframeDocument == null) {
              //If iframe document is not found then we can not append other childs.
              console.error("ANA: Iframe document missing.");
              return ele;
            }

          try {
              iframeDocument.appendChild(ele);
              console.log("ANA: Elements added in Iframe - " +  ele.tagName);
            }
            catch(e) {
              console.log("ANA: Iframe Exception in adding elements in Iframe");
              let prevChildElement = iframeDocument.getElementsByTagName(ele.tagName)[0];
              if(prevChildElement)
              iframeDocument.replaceChild(ele, prevChildElement);
          }
        }
        /*else if(parentNode.tagName && parentNode.tagName == "STYLE")
        {
            ele.textContent = modifyCSSUrls(ele.textContent);
            parentNode.appendChild(ele);
        }*/
        else
        {
          try{
          if(!parentNode.tagName || (parentNode.tagName &&  parentNode.tagName != 'OBJECT'))
            parentNode.appendChild(ele);
          }catch(e){
            console.log("Exception handling " , parentNode);
          }
        }
    }

          if(ele.tagName && ele.tagName == "IFRAME" && !ele.src)
          { //Append the iframe in existing document.
            //Schedule Iframe to load it's content.
            //ele.src = "/netvision/reports/x.html"
            //this.addNodesInIframe(ele, elementNode);
            return ele;
          }

    if (elementNode.tagName != "OBJECT" && elementNode.childNodes){
    if (elementNode.childNodes){ 
      for (let s = 0; s < elementNode.childNodes.length; s++)
        this.addNode(elementNode.childNodes[s], ele);
    }
    //now check if SELECT then set it's selectedIndex. 
    if(elementNode.tagName == 'SELECT' && elementNode.attributes.hasOwnProperty('index'))
      ele.selectedIndex = elementNode.attributes['index'];
      return ele;
    }
                                                                                            
    }
    loadRsaEncryptedData() {
      //throw new Error("Method not implemented.");
    }
    encValue(ele,node)
    {
      let me = this;
      let addPending = () =>
      {
        //TODO: check if we need to update already existing.
        this.pendingEncElements.set(ele, node);
      }
      let encValue = (value) =>
      {
        let ev, entry;
         let me = this;
        if(value.indexOf("%NVENCRYPTED") == 0)
        {
          me.rsaEncryptNode = true;
          if(me.rsaValueHash == null)
          {
            addPending();
            return null;
          }
          //check this key in hash.
          if(me.rsaValueHash[value] && me.rsaEncoder)
          {
            entry = me.rsaValueHash[value];
            ev = me.rsaEncoder.decrypt(entry.encryptvalue);
            if(ev)
              return ev;
          }
        }
        else {
          //decrpt using default method.
          return nvEncoder.decodeText(value, nvEncoder.decode);
        }
        return null;
      }
      //check it's type.
      let ev;
      if(this.userType != "Admin") return;

    if(ele.nodeType == ele.TEXT_NODE)
    {
      //check if encTextContent given then decrypt it. 
      if(node.encTextContent)
      {
         ev = encValue(node.encTextContent);
         if(ev != null)  ele.textContent = ev;
      }
    }
    else if(ele.nodeType == ele.ELEMENT_NODE && ele.tagName == "INPUT")
    {
      //TODO: check for all kind of input nodes.
      if(node.attributes.encValue) {
        ev = encValue(node.attributes.encValue);
        if(ev != null) ele.value = ev;
      }
      //TODO: check what is this this nvvalue for ?
      if(node.attributes.encNvvalue) {
        ev = encValue(node.attributes.encNvvalue);
        if(ev != null) ele.value = ev;
      }
      if(node.attributes.encPlaceholder) {
        ev = encValue(node.attributes.encPlaceholder);
        if(ev != null) ele.placeholder = ev;
      }
      if(node.attributes.encDefaultValue && (ele.value == null || ele.value == ""))
      {
        ev = encValue(node.attributes.encDefaultValue);
        if(ev != null) ele.defaultValue = ev;
      }
    }
    return;
    }

    loaded() 
      {
        //if already loaded then do not call again. 
        if(this.loading == false)
          return;
    
        this.loading = false;
        if(this.pageloadTimeoutTimer != -1)
        {
          clearTimeout(this.pageloadTimeoutTimer);
          this.pageloadTimeoutTimer = -1;
        }
        // pagedump loaded, once processiongpagedump callback has been called, this flag will agian be reset to false
        this.rh.pagedumpload = true;
        
        
        if(this.ref && typeof this.ref.afterPageDump != "undefined")
          this.ref.afterPageDump();
        else{
           console.log("calling processingPageDumpCallback from dombuilder class");
           this.rh.processingPageDumpCallback(null,false);
        }
        
           
    }
    
    addBasePath(elementNode, ele, attribute, attrValue1:String)
    {
      let attrValue = attrValue1 || elementNode.attributes.href || elementNode.attributes.src || elementNode.attributes.data; // for OBJECT
      //check if complete path not given (not starting from /, http, https). 
      if(!attrValue)
        return;
      if(attrValue.indexOf("data") == 0  || attrValue.indexOf("javascript:") == 0  || attrValue.indexOf("chrome-extension:") == 0)
      {
        this.pAttributeSetter(ele, attribute, attrValue);
        return;
      }
      if(this.crossOriginIframe == false && elementNode.tagName.toUpperCase() == "IFRAME")
         return;
      let basePath = attrValue;
      //TODO: create two mode. 
      //1. When we want to get all the request from external server. Quick mode. - true
      //2. We want to get all the resource from nv machine. - false
      if(this.fetchURLFromRemoteServer != true)
      {
        // in this case, it is picking resources from nv server with help of nvcache server
        //Check if path is relative
        /*if(!(attrValue.indexOf('http://') == 0|| attrValue.indexOf('https://') == 0) && attrValue[0] != '/')
          attrValue = this.URL.pathname.substr(0, this.URL.pathname.lastIndexOf('/') + 1)  + attrValue;
        pAttributeSetter(ele, attribute, attrValue); // called to attribute to element*/
        //If complete domain given then. 
        if(attrValue.indexOf('http://' +  this.URL.hostname) == 0)
        {
          attrValue = attrValue.substr(('http://' +  this.URL.hostname).length);
        }
        else if(attrValue.indexOf('https://' +  this.URL.hostname) == 0)
        {
          attrValue =  attrValue.substr(('https://' +  this.URL.hostname).length);
        }
        else if(attrValue.indexOf('//' +  this.URL.hostname) == 0)
        {
          attrValue =  attrValue.substr(('//' +  this.URL.hostname).length);
        }
        else if(attrValue[0] != '/' && ((attrValue.indexOf("http://") != 0) && (attrValue.indexOf("https://") != 0) && (attrValue.indexOf("//") != 0) && (attrValue.indexOf("C:/") != 0) && (attrValue.indexOf("//C:/") != 0) && (attrValue.indexOf('file://') != 0)))
        {
           attrValue = this.URL.pathname.substr(0, this.URL.pathname.lastIndexOf('/') + 1)  + attrValue;
        }
        //There is no need to handle for / as that will automatically reach to nv server. 
        attrValue = this.modifyPath(attrValue);
        this.pAttributeSetter(ele, attribute, attrValue);
      }
      else {
         // in this cse it is picking from remote server
         //check if host is missing.
         //console.log('attrValue - ' + attrValue);
         if(attrValue[0] == '/' && attrValue[1] != '/')
         {
           basePath = this.URL.origin + attrValue;
         }
         else if(!(attrValue.indexOf('http://') == 0|| attrValue.indexOf('https://') == 0 || attrValue.indexOf('//') == 0 || attrValue.indexOf('C:/') == 0 ||
         attrValue.indexOf('//C:/') == 0|| attrValue.indexOf('file://') == 0))
         {
           basePath = this.URL.origin + this.URL.pathname.substr(0, this.URL.pathname.lastIndexOf('/') + 1) + attrValue;
         }
         //console.log('basePath - ' + basePath);
         basePath = this.modifyPath(basePath);
         this.pAttributeSetter(ele, attribute, basePath);
      }
    }
    modifyPath(path)
    {
      var basepath = path;
      var rules =[];
      if(typeof resourceVersioningRules != "undefined")
        rules = resourceVersioningRules;
      for(var i=0; i< rules.length; i++)
      {             
         var rule = rules[i];
         if(typeof rule.check.url == 'object')
         {   
             rule.check.url = RegExp(rule.check.url);
             if(path.match(rule.check.url) != null)
             {
                 if(rule.check.match == true)
                    basepath = basepath.replace(rule.old,rule.new);
             }
             else
             {
                 if(rule.check.match == false)
                    basepath = basepath.replace(rule.old,rule.new);
             }
         }   
         else
         {       
             if(path.indexOf(rule.check.url) != -1)
             {
                 if(rule.check.match == true)
                    basepath = basepath.replace(rule.old,rule.new);
             }
             else
             {
                 if(rule.check.match == false)
                    basepath = basepath.replace(rule.old,rule.new);
             }
            }
          }
          return basepath;
    }
    pAttributeSetter(en, ta, nvalue)
    {
      if (-1 == ["onclick", "onchange", "onkeyup", "onload", "onkeypress", "onmouseover", "onerror", "integrity"].indexOf(ta.toLowerCase())) {

        //check if nvvalue then just set this as value.
        if(ta == "nvvalue")
          en.value = nvalue;
  
        //Note: src have been handlered already .
        //TODO: handle case of insensitive and encrytped tags. 
        //{
        // simply setting the attribute
        try {
          en.setAttribute(ta, nvalue)
        }
        catch(r) { // again finding the attribute
          //If attributes are space seperated then combine them.
          //TODO: check when this will happen.
          let i = [].concat(ta.match(/[-a-zA-Z0-9_:.]/gi)).join("");
          console.log("ERROR: troubling while getting attribute", en, ta, nvalue);
          if ("" != i) {
            try {
              en.setAttribute(i, nvalue);
            }
            catch(r) {
              console.log("ERROR: troubling while getting attribute ", en, i, nvalue)
            }
          }
        }
        //}
      }
    }
    createElement(obj) {
      let c = this;
      let doc = c.root;
      let tag = obj.tagName;
      let el ;
      if ("SCRIPT" == tag) {
        /** @type {Element} */
         el = doc.createElement("NO-SCRIPT");
        return el.style.display = "none";     
      }
      if("BASE" == tag) {
        return null;
      }
      if ("HEAD" == tag) {
        /** @type {Element} */
        el = doc.createElement("HEAD");
        /*let base = document.querySelector('BASE');
        if (typeof base == "undefiend") {
          el.appendChild(doc.createElement("BASE"));
          el.firstChild.href = path;
        }*/
        return el;
      }
      if (0 == tag.indexOf("svg:")) {
        /** @type {Element} */
        el = doc.createElementNS("http://www.w3.org/2000/svg", tag.slice(4));
        return el;
      }  
    }
    waitForStylesheet(ele) {
      let me = this;
      let loadcb = (e) => {
        e.target.onload = e.target.onerror = null;
        me.pendingStylesheets--;
  
        //Check if all the stylesheets are done. 
        if(me.pendingStylesheets <= 0 && document.readyState !=  'loading')
          me.loaded();
      }
  
      ele.onload = loadcb;
      ele.onerror = loadcb;
      me.pendingStylesheets++;
    }
     
     //this method will return array of previous state [removed, added, attrChangeNode, prevCDataChangeNode].
    d (e:[], n:[], r:[], i:[], action) {
    e = this.maxify(e);
    n = this.maxify(n);
    r = this.maxify(r);
    i = this.maxify(i);
    let o = this;
    let prevDeleteNode = [], prevAddedNode = [], prevAttrChangeNode = [], prevCDChangeNode = [];
    action = action || APPLY_CHANGES;
    /* sample record afor added node.
        [{"nodeType":1,"id":14103,"tagName":"SCRIPT","attributes":{"type":"text/javascript","src":"http://cts.channelintelligence.com/13014088_landing.js"},"previousSibling":{"id":48},"parentNode":{"id":4}}
    */
    //TODO: remove this forEach. 
    let textNodes = [];
    let inputElement = [];
    n.forEach(function(e:any) {
      
      //Check if parent is in list of pendingIframe then add this record as pending records. 
      if(e.parentNode && o.loadingIframeElement[e.parentNode.id]) 
      {
        o.loadingIframeElement[e.parentNode.id].nodes.push({childNodes: [e]});
        return;
      }

      //Just create this node. Note: as we are not passing parentNode, so it will not be linked.
      let t = o.addNode(e,null);
      if(!t) return;

      if(t.nodeType == Node.TEXT_NODE)
        textNodes.push(t);

      if(t.tagName  && (t.tagName == 'INPUT' || t.tagName == 'TEXTAREA'))
        inputElement.push(t);
      
      let p = null;
      if(e.parentNode)
        p = o.addNode(e.parentNode,null);
      //check if we have new previousSibling
      if (e.previousSibling && e.previousSibling.nodeType) {
        console.log("Adding new previous Node. - type - " + e.previousSibling.tagName);
      }
      if(e.previousSibling && (p || t.parentNode))
        o.addNode(e.previousSibling, p || t.parentNode);
      if (t) if (t.parentNode) t.parentNode.removeChild(t)
      if(action == APPLY_CHANGES)
      {
        //add in removedNode list. 
        prevDeleteNode.push({id: e.id});
      }
    }),
    e.forEach(function(e) {
      let t = o.addNode(e,null);
      if(!t) return;
      if(action == APPLY_CHANGES)
      {
        prevAddedNode.push(o.getNVNode(t, true));
      }

      if (t && t.parentNode) 
      {
        try{
              t.parentNode.removeChild(t);
           }catch(e)
           {
             console.log("execption while removing child : " + e);
           }
      }
    }),
    n.forEach(function(e:any) {
      if(e.parentNode && o.loadingIframeElement[e.parentNode.id])
      { 
        return;
      }
      let t = o.addNode(e,null);
      let n = null;
      if(e.parentNode)
        n = o.addNode(e.parentNode,null);
      let r = null;
      if(e.previousSibling)
        r = o.addNode(e.previousSibling,null);
      if(!t) return;
      // if(t && r)
      //In some cases we were having no parent node and previous sibling.
      if(!n)
       return;
      if(n.tagName && n.tagName.toLowerCase() == "iframe")
      {
        try{
             if(n.contentDocument)
               n = n.contentDocument;
          }
          catch(e){
             n = n;
          }
          if(n == null) {
            //If iframe document is not found then we can not append other childs.
            console.error("ANA: Iframe document missing.");
            return ;
          }
        // when n is document
         try {
            n.appendChild(t);
            console.log("ANA: Elements added in Iframe - " +  n.tagName);
          }
          catch(e) {
            console.log("ANA: Iframe Exception in adding elements in Iframe");
            let prevChildElement = n.getElementsByTagName(t.tagName)[0];
            if(prevChildElement)
              n.replaceChild(t, prevChildElement);
          }
        }
        else if(n || r){
         try{
           n.insertBefore(t, r ? r.nextSibling : n.firstChild);
         }catch(e){
           console.log("Error occured while inserting : " + e);
         }
       }
    }),
    r.forEach(function(e:any) {
      let n = o.addNode(e,null);
      if(!n) return;
      let oldAttrValues = {id: e.id, attributes: {}};
      Object.keys(e.attributes || {}).forEach(function(r) {
        let i = e.attributes[r];
        // null  === i ? n.removeAttribute(r) : o.delegate && o.delegate.setAttribute && o.delegate.setAttribute(n, r, i) || pAttributeSetter(n, r, i)
        // not for text type
        if(n.getAttribute != undefined)
          oldAttrValues.attributes[r] = n.getAttribute(r);
        if (null === i) {
          n.removeAttribute(r)
        }
        else if(n && n.tagName && n.tagName.toLowerCase() == "iframe" && r == "src" ) 
        {
           o.addBasePath.call(o, {"attributes" : {}},n,r,i);
        }
        else{
          if(n.tagName == 'INPUT' && n.type == 'password')
          {
            //Note: we were getting password field's value attribtue. ignore the value of password attribute .
            i = Array(i.length).fill('*').join(''); 
          }
          o.pAttributeSetter(n, r, i);
        }
      })
      if(action == APPLY_CHANGES) 
      {
        prevAttrChangeNode.push(oldAttrValues);    
      }
    }),
    i.forEach(function(e:any) {
      let t = o.addNode(e,null);
      if(!t) return;
      
      if(t.nodeType == Node.TEXT_NODE)
        textNodes.push(t);

      //save it's previous value.
      if(action == APPLY_CHANGES) 
      {
        prevCDChangeNode.push({id: e.id, textContent: t.textContent});
      }
      t.textContent = e.textContent
    }),
    e.forEach(function(e) {
      //this method will recurcivily remove all the nodes. 
      o.forgetNode(e);
    })

    let me = this;
    textNodes.forEach(function(e) {
      let p = e.parentNode;
      let ef = 0;
      if(p) {
        ef = me.getEEFlag(p);        
        //Note: in case of encoded, content can not be modified.
        if(ef == 1)
        {
          if(me.userType == 'Admin')
          {
            e.textContent = nvEncoder.decodeText(e.textContent, nvEncoder.decode);
          } else {
            e.textContent = nvEncoder.decodeText(e.textContent,null);
          }
        }
      } 
    });

    inputElement.forEach(function(e) {
      let ef = 0;
      ef = me.getEEFlag(e);
      if(ef == 1)
      {
        if(me.userType == 'Admin')
        {
          nvEncoder.transformElement(e, nvEncoder.decode);
        } else {
          nvEncoder.transformElement(e,null);
        }
      }
    });


    //now reverse all the previous array and combine them. 
    //Note: we are reversing the arrays because in backward mode we should revert the changes to get each previous change
    // now when doing backward replay, add previously deleted nodes, remove previously added nodes.
    let reverseData = [prevDeleteNode.reverse(), prevAddedNode.reverse(), prevAttrChangeNode.reverse(), prevCDChangeNode.reverse()];
    return reverseData;
  }
  forgetNode = function(node) 
  {
    if(!node || !node.id) return;

    let ele = this.nodeIdMap[node.id];

    //In case if element either not added or already removed. 
    if(!ele)
      return;
      
    //This method will traverce recursivly. 
    for(let z = 0; z < ele.childNodes.length; z++) 
    {
      //Check if node is added. 
      this.forgetNode({id: ele.childNodes[z].__nvid});
    }
      
    delete this.nodeIdMap[node.id];
  } 

  checkEEFlag = function(node) {
    let className = ' ' +  node.className + ' '.replace(/[\n\t]/g, " ").toUpperCase();
    if(className.indexOf(' NVSENSITIVE ') > -1)
      return 2;
    if(className.indexOf(' NVENCRYPTED ') > -1)
      return 1;
    return 0; 
  }

  getEEFlag = function(node) 
  {
    //This will check the complete parent chain.
    //Note: we need to check in both in nodemap and need to check in that element.
    let d = this.blackList.get(node); 
    if(d === undefined)
    {
      d = this.checkEEFlag(node);  
      //Check for parent.
      if(d == 0)
      { 
        if(node.parentNode)
          d = this.getEEFlag(node.parentNode);
      }
      //set this flag and return.
      this.blackList.set(node, d);
    }
    return d;
  }

//This will just collect record of existing element to use in previous replay.
  getNVNode = function(node, followChild) {
  if (null === node) {
    return null;
  }

  let elem :any = {
    nodeType : node.nodeType,
    id: node.__nvid,
    parentNode: null,
    previousSibling: null
  };
  if(node.parentNode && node.parentNode.__nvid)
    elem.parentNode = {id: node.parentNode.__nvid};

  if(node.previousSibling && node.previousSibling.__nvid)
    elem.previousSibling = {id: node.previousSibling.__nvid};

  //update for parentNode.
  switch(elem.nodeType) {
    case Node.DOCUMENT_TYPE_NODE:  //10
      /** @type {Object} */
      let data = node;
      elem.name = data.name;
      elem.publicId = data.publicId;
      elem.systemId = data.systemId;
      break;
    case Node.COMMENT_NODE:  //8
    ;
    case Node.TEXT_NODE: //3
      elem.textContent = node.textContent;
      break;
    case Node.ELEMENT_NODE: //1
      /** @type {Object} */
      let element = node;
      elem.tagName = "http://www.w3.org/2000/svg" == element.namespaceURI ? "svg:" + element.tagName : element.tagName;
      elem.attributes = {};
      /** @type {number} */
      let i = 0;
      for (;i < element.attributes.length;i++) {
        let attr = element.attributes[i];
        if(this.crossOriginIframe == false && elem.tagName.toLowerCase() == "iframe" && attr.name.toLowerCase() == "src")
           continue;
        else
           elem.attributes[attr.name] = attr.value;
      }
      if("SCRIPT" == elem.tagName)
      {
        if( "undefined" != typeof elem.attributes.style)
           delete elem.attributes.style;
      }
      if("INPUT" == elem.tagName && "text" == elem.type || "TEXTAREA" == elem.tagName)
      {
        let text :String = null;
        if ("INPUT" == elem.tagName) {
          let text = element.getAttribute("value")
        } else {
          if ("TEXTAREA" == elem.tagName) {
            if (element.childNodes.length > 0) {
              text = element.childNodes[0].nodeValue;
            } else {
              /** @type {string} */
              text = "";
            }
          }
        }
        if (null != element.value) {
          if ("" != element.value) {
            if (element.value != text) {
              elem.attributes.nvvalue = element.value;
            }
          }
        }
      }
      //get parent node.
      if(element.parentNode && element.parentNode.__nvid)
      {
        elem.parentNode = {id: element.parentNode.__nvid}; 
      }
      else 
        elem.parentNode = null;

      if(element.previousSibling && element.previousSibling.__nvid)
      {
        elem.previousSibling = { id: element.previousSibling.__nvid};   
      }
      else 
        elem.previousSibling = null;
       

      if(followChild && element.childNodes.length)
      {
        elem.childNodes = [];
        let child = element.firstChild;
        for(;child;child=child.nextSibling)
        {
          elem.childNodes.push(this.getNVNode(child, true));
        }
      }
  }
  return elem;
}

  }
