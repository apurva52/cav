export class CheckPointDataSource
{
activech : any;
pages : any;
cpname : any;
rules:any;
match:any;
startstring : any;
endstring : any;
eventname : any;
searchtext : any;
fail : any;
Radioval : any;
oparg : any;
scope : any;
searchregexp : any;
searchic : any;
startstringregexp : any;
startstringic : any;
endstringregexp : any;
endstringic : any;
id : any;
selector : any;
constructor(activech,pages,cpname,rules,match,startstring,endstring,eventname,searchtext,fail,Radioval,oparg,scope,searchregexp,searchic,startstringregexp,startstringic,endstringregexp,endstringic,id,selector)
{
this.activech = activech;
this.pages = pages.join(",");
this.cpname = cpname;
this.rules = rules;
this.match = match;
this.startstring = startstring;
this.endstring = endstring;
this.eventname = eventname;
this.searchtext = searchtext;
this.fail = fail;
this.Radioval = Radioval;
this.oparg = oparg;
this.scope = scope;
this.searchregexp = searchregexp;
this.searchic = searchic;
this.startstringregexp = startstringregexp;
this.startstringic = startstringic;
this.endstringregexp = endstringregexp;
this.endstringic = endstringic;
this.id = id;
this.selector = selector;
}
}

