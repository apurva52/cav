import { Router, ActivatedRoute, NavigationEnd, Params, PRIMARY_OUTLET } from "@angular/router";

export class BreadCrumbInfo {
  label: string;    //   it is usedd for showing value in label e.g for Session case it will show Session.
  params: any;      //   parameter to be passed (filtercriteria).
  url: string;     //    its the router link  such as '/sessions'.
  curl:string;     //    it is the complete url.
  seq: number;     //    for storing the sequence no in which breadcrumb is added.
  data: any;      //     data to be stored at every breadcrumb level.
  parentBD: any;

  constructor(label: any, curl: any, data: any) {
    this.label = label;
    this.curl = curl;
    this.data = data || {};

    this.setParams();
    this.parentBD = null;
  }

  /*constructor(label: any, curl: any, data: any, url: any, seq: any) {
    this.label = label;
    this.curl = curl;
    this.data = data || {};

    this.setParams();
    this.parentBD = null;
  }

  constructor(obj: any)
  {
    this.label = obj.label;
    this.params = obj.params;
    this.url = obj.url;
    this.curl = obj.curl;
    this.data = obj.data;
    this.seq = obj.seq;
    this.parentBD = null;
  }
  */

  getObj()
  {
    console.log("label ==");
     console.log("label == "+this.label);
     return {
       label: this.label,
       params: this.params,
       url: this.url,
       curl: this.curl, 
       data: this.data,
       parent: this.parentBD != null? this.parentBD.seq: -1,
       seq: this.seq
     }
  }
   
  setObj(obj: any)
  { 
    this.label = obj.label;
    this.params = obj.params;
    this.url = obj.url;
    this.curl = obj.curl;
    this.data = obj.data;
    this.seq = obj.seq;
    this.parentBD = null;
  }  

  setUrl(url: any, params: any)
  {
    this.curl = url;

    //check if params given then no need to process curl.
    if(params != null)
      this.params = params;
    else {
      this.params = this.setParams();
    }
  }

  setParams()
  {
    //now process the curl and split into url and params.
    let us = this.curl.split('#');
    let uss = us[1].split('?')
    this.url = uss[0];
    this.params = {};

    if(uss[1]) 
    {
      let tokens = uss[1].split('&'); 
      let token;
      for (let z = 0; z < tokens.length; z++) 
      {
        //split by =
        token = tokens[z].split('='); 
        this.params[token[0]] = decodeURIComponent(token[1]);
      }
    }
  }
}

