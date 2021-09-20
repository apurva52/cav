import { Component, OnInit, ElementRef, NgZone, Input, SimpleChanges, OnChanges, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { D3Service,D3,Selection} from 'd3-ng2-service';
import * as d3Sankey from "d3-sankey";
import { PathAnalyticsDataService } from '../../common/interfaces/pathanalyticsservice';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadCrumbInfo } from '../../common/interfaces/breadcrumbinfo';
//import { NVBreadCrumbService } from './../../../services/nvbreadcrumb.service';
import * as d3Tip from 'd3-tip';

import * as moment from 'moment';

import 'moment-timezone';
import { NvhttpService } from '../../common/service/nvhttp.service';

@Component({
  selector: 'app-viewflowpathanalysis',
  templateUrl: './viewflowpathanalysis.component.html',
  styleUrls: ['./viewflowpathanalysis.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ViewflowpathanalysisComponent implements OnChanges {

  @Input() dimensions : any;
  
  pathDataService: PathAnalyticsDataService;
  private d3: D3;
  private parentNativeElement: any;
  private d3Svg: Selection<SVGSVGElement, any, null, undefined>;
  breadInfo: BreadCrumbInfo;
  @Input() filter: any; 
  @Input() maxnodelength : any;
  @Input() refinedData : any ;
  height: any;
  @Input() maxSankeyChartDepth: any;
  dimType: any;
  @Output() onChange: EventEmitter<any>;
  @Input() response: any;
  changemode = false;
  @Output() onFilterData: EventEmitter<any>;
  @Input() totalCount : number;
  

  constructor(element: ElementRef, private ngZone: NgZone, d3Service: D3Service,private httpService: NvhttpService, private route: ActivatedRoute,private router: Router) 
  {
    this.d3 = d3Service.getD3();
    this.parentNativeElement = element.nativeElement;
    
    this.dimensions = [
            {label:'Select Dimension', value:null},
            {label:'Browser', value:'Browser'},
            {label:'Location', value:'Location'},
            {label:'OS', value:'OS'},
            {label:'Device', value:'Device'},
            {label:'Referrer', value:'Referrer'},
   ];
   
 

   this.onChange = new EventEmitter();
   this.maxSankeyChartDepth = (this.maxSankeyChartDepth < 1000 ? 2000 : this.maxSankeyChartDepth);
   this.onFilterData = new EventEmitter();
  }

  ngOnInit(): void {};
  
  ngOnChanges() {
      //Check if it is coming from breadcrumb then set the previous breadcrumb else set a new one.
      //Note: no need to check this.breadInfo == null.
    if(this.filter !== undefined && this.filter !== null)
     this.dimType = this.filter.filter.dimName;
    if(this.refinedData !== null){
     if(this.maxnodelength > 200 )
      this.height = this.maxnodelength + 200;
     else
      this.height = this.maxnodelength + 300;
     this.maxSankeyChartDepth = (this.maxSankeyChartDepth < 1000 ? 2000 : this.maxSankeyChartDepth);
     this.pathDataService = this.refinedData;
     this.clearSankeyChart();
     this.drawSankeyChart(this.pathDataService.refinedData);
    }
  }



  drawSankeyChart(refineSankeyData) 
  {
    var NODE_WIDTH = 200;
    var NODE_PADDING = 40;
    var DEPTH_WIDTH = 350;
    var DEPTH_INTERACTION = 310;

    var margin = {top: 70, right: 20, bottom: 0, left: 20};
    var width = 550 + ((this.pathDataService.sankeyStep - 1) * DEPTH_WIDTH) + 150;
    var sankeyWidth = width - 150;  //for next/previous button
    var height = this.pathDataService.getMaxNodeLength() * 100 + margin.top + 100;
    var count = this.totalCount;


    var formatNumber = this.d3.format(",.0f"),
    format = function (d: any) { return formatNumber(d) + " Sessions"; },
    color = this.d3.scaleOrdinal(this.d3.schemeCategory10);

    var svg = this.d3.select("#sankey").append("svg")
           .attr("width", width + margin.left + margin.right)
           .attr("height", height + margin.top + margin.bottom)
           .append("g")
           .attr("transform", "translate(" + margin.left + "," + 100 + ")");

     var ht = (height - 150) < 100 ? (height + 250) : (height - 150);
     var sankey = d3Sankey.sankey()
                  .nodeWidth(NODE_WIDTH)
                  .nodePadding(NODE_PADDING)
                  .size([sankeyWidth, ht]);


    /** init sankeyDataSet */
     let sankeyDataSet = refineSankeyData;
     if (sankeyDataSet) {
        var link = svg.append("g")
                      .attr("class", "links")
                      .attr("fill", "none")
                      .attr("stroke", "#000")
                      .attr("stroke-opacity", 0.2)
                      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                      .selectAll("path");

        var node = svg.append("g")
                      .attr("class", "nodes")
                      .attr("font-family", "sans-serif")
                      .attr("font-size", 14)
                      .attr("font-weight", 600)
                      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                      .selectAll("g");

         let gradX = svg.append("defs")
                               .append("linearGradient")
                               .attr("id", "linear")
                               .attr("x1", "0%")
                               .attr("x2", "0%")
                               .attr("y1", "0%")
                               .attr("y2", "100%");
                              gradX.append("stop")
                             .attr("offset", "0%")
                             .attr("stop-color", "#186ba0");
                             gradX.append("stop")
                             .attr("offset", "41%")
                             .attr("stop-color", "#186ba0");
                             gradX.append("stop")
                             .attr("offset", "42%")
                             .attr("stop-color", "white");
                             gradX.append("stop")
                             .attr("offset", "100%")
                             .attr("stop-color", "white");


         
        let depthInfo = svg.append("g").attr("transform", "translate(" + margin.left + "," + 20 + ")").selectAll(".depthInfo")
                        .data(this.pathDataService.globalDepthViewStatus)
                        .enter().append("g")
                        .attr("class", "depthInfo");
                         depthInfo.append("rect")
                        //.attr("height", 50)
                        .attr("height", function (d) {
                            //if(d["depth"] == 0) return 0;
                            //if(d["depth"] == 1) return 60;
                            return 100;
                        })
                        .attr("width", NODE_WIDTH)
                        .attr("x", function (d) {
                            if(d["depth"] == 0) return 0;
                            return d["depth"] * DEPTH_WIDTH;
                        })
                        .attr("y", -80)
                        .style("stroke","#186ba0")
                        .style("fill","url(#linear)")
                        .attr('dx',100 )
                        .append("title")
                        .text(function (d) {
                            if(d["depth"] == 0) return "Total Sessions";
                            if(d["depth"] == 1) return "Entry Page";
                            return (d["depth"]-1) + ' Interaction';
                        });


                    depthInfo.append("text")
                        .attr("y", -60)
                        .append('svg:tspan')
                        .attr("x", function (d) {
                            return (d["depth"] * DEPTH_WIDTH) + 40;//plus padding
                        })
                        .attr('dy', 4)
                        .attr("fill", "white")
                        .style("font-size","16px")
                        .text(function (d) {
                            if(d["depth"] == 0) return "TOTAL SESSIONS";
                             if(d["depth"] == 1) return "ENTRY PAGE";
                            return (d["depth"]-1) ;
                        })
                        .attr("fill", "white")
                        .append('svg:tspan')
                        .attr('baseline-shift','super')
                        .style("font-size","12px")
                        .text(function (d) {
                            if(d["depth"] == 0 || d["depth"] == 1) return "";
                            if(d["depth"] == 2) return  "st";
                            if(d["depth"] == 3) return  "nd";
                            if(d["depth"] == 4) return  "rd";
                            if(d["depth"] > 3) return  "th";
                        })
                        .append('svg:tspan')
                        .style("font-size","14px")
                        .attr("fill", "white")
                        .text(function (d) {
                           
                           if(d["depth"] !== 0 && d["depth"] !== 1) return 'INTERACTION'; return '';
                        })
                        .append('svg:tspan')
                        .attr("x", function (d) {
                            return (d["depth"] * DEPTH_WIDTH) + 5;//plus padding
                        })
                        .attr('dy', 29)
                        .style("font-size","13px")
                        .style("font-family","calibri")
                        .text(function (d) {

                            if(d["depth"] == 0) return "";
                            return d["in"] + ' Sessions' +"(" + (d["in"]/count*100).toFixed(2) + "%)" ;
                        })
                        .attr("fill", "black")
                        .append('svg:tspan')
                        .attr("x", function (d) {
                           return (d["depth"] * DEPTH_WIDTH) + 5;//plus padding
                        })
                        .attr('dy', 30)
                        .style("font-family","calibri")
                        .text(function (d) {

                            if(d["depth"] == 0) return "";
                            var dcount = d["out"] === 0 ? '' : "(" + (d["out"]/d["in"]*100).toFixed(2) + "%)" ;
                            return d["out"] + ' Through'  + dcount ;
                        })
                        .attr("fill", "black")
                         .append('svg:tspan')
                        .attr("x", function (d) {
                            return (d["depth"] * DEPTH_WIDTH) + 5;//plus padding
                        })
                        .attr('dy', function (d) {
                            if(d["depth"] == 0) return 30;
                            return 15;
                        })
                        .style("font-family","calibri")
                        .text(function (d) {
                                
                                if(d["depth"] == 0){  return   d["out"] + " Sessions" };
                                var dcount = (d["in"] - d["out"] === 0) ? '' : "(" +  ((d["in"] - d["out"])/d["in"]*100).toFixed(2) + "%)" ;
                                return (d["in"] - d["out"]) + ' Drop-Offs' + dcount;
                        })
                        .attr("fill", "black")
                        var countval = 0;
                        depthInfo.append("rect")
                        .attr("y", -20)
                        .attr("x", function (d) {
                            
                            return (d["depth"] * DEPTH_WIDTH) + 5; //plus padding
                        })
                        .attr("fill",function(d){
                        var dcount = d["out"] === 0 ? 0.00 : (d["out"]/d["in"]*100);
                        var thcount = Math.ceil(dcount);
                        var drcount =  Math.ceil(dcount) + 1;
                        var gradX1 = svg.append("defs")
                               .append("linearGradient")
                               .attr("id", function (d) { countval++; return "gradX1" + countval;})
                               .attr("x1", "0%")
                               .attr("x2", "100%")
                               .attr("y1", "0%")
                               .attr("y2", "0%");
                              gradX1.append("stop")
                             .attr("offset", "0%")
                             .attr("stop-color", "lightgreen");
                             gradX1.append("stop")
                             .attr("offset", function(d){ return thcount+"%"})
                             .attr("stop-color", "lightgreen");
                             gradX1.append("stop")
                             .attr("offset", function(d){ return drcount+"%"})
                             .attr("stop-color", "red");
                             gradX1.append("stop")
                             .attr("offset", "100%")
                             .attr("stop-color", "red");
                         return "url(#gradX1" + countval + ")"; })
                        .attr("height",function(d){ if(d["depth"] == 0) return 0 ; return 10; })
                        .attr("width",110)

               sankey(sankeyDataSet);
               link = link
                       .data(sankeyDataSet.links)
                       .enter().append("path")
                       .attr("d", d3Sankey.sankeyLinkHorizontal())
                       .attr("stroke-width", function (d: any) { return Math.max(4, d.width); })
                       .style("stroke", function (d) {
                        if (d["target"].name == 'OUT') {
                        return "none";
                       }
                        return '#000'; //google link color
                    })
                       .attr("id", function (d:any, i) {
                   d.id = i;
                   return "link-" + i;
               });

               link.append("title")
                       .text(function (d: any) { return d.source.name + " ? " + d.target.name + "\n" + format(d.value); });


               let linktext = svg.append("g").selectAll(".links")
               .data(sankeyDataSet.links)
               .enter()
               .append("text").attr('class','linkText')
               .attr("x", function(d) {  return (d["source"].x0 + (d["target"].x1 - d["source"].x1) / 2)+ 35; })
               .attr("y", function(d) { return  ((d["source"].y1 + d["target"].y1)/ 2) - 80; })
               .attr("dy", ".35em")
               .attr("font-size","15px")
               .attr("text-anchor", "end")
               .attr("id", function (d:any, i) {
                   d.id = i;
                   return "linkt-" + i;
                })
               .attr("style","display:none")
               .text(function(d) { return d["source"].name  + " -> " + d["target"].name; })
               .attr("text-anchor", "start")
               .style('fill','white')
               .append('svg:tspan')
               .attr('x', function(d) {  return (d["source"].x0 + (d["target"].x1 - d["source"].x1) / 2 )+ 35; })
               .attr('dy', ".35em")
               .attr("y", function(d) { return ((d["source"].y1 + d["target"].y1)/ 2) - 65; })
               .text(function(d) { return format(d["value"]); })


                let tip = d3Tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html((d:any) => {

                    if (d.depth == 0 ||  d.name == 'OUT') {
                        return "<strong>Page :</strong> <span style='color:red'>" + d.name + "</span>";
                    }

                    if(d.name === 'EXIT')
                        return 'EXIT';
                     
                    var inVal = this.pathDataService.globalNodeViewInOutStatus[d.node].in;
                    var outVal = this.pathDataService.globalNodeViewInOutStatus[d.node].out;
                    var outPage = inVal - outVal;
                    
                    return "<strong>* Page :</strong> <span style='color:lightskyblue'>" + d.name + "</span>"
                        + "<br/><br/><strong>* Through traffic :</strong> <span style='color:yellow'>" + outVal + " (" + Math.round((outVal / inVal * 100) * 100) / 100 + "%)" + "</span>"
                        + "<br/><br/><strong>* Drop-offs :</strong> <span style='color:pink'>" + outPage + " (" + Math.round((outPage / inVal * 100) * 100) / 100 + "%)" + "</span>"
                        + "<br/><br/><strong>* Visits : </strong><span style='color:white'>" + d.value + "</span>";
                });

               node = node
                       .data(sankeyDataSet.nodes)
                       .enter().append("g");

                   node.append("rect")
                       .attr("x", function (d: any) { return d.x0; })
                       .attr("y", function (d: any) { return d.y0; })
                       .attr("height", function (d: any) {if(d["name"] === "OUT" || (isNaN(d.y1))) return 0; return Math.max(5,(d.y1 - d.y0)); })
                       .attr("width", function (d: any) { return d.x1 - d.x0; })
                       .attr("fill",function (d: any) { if(d["name"] === "EXIT" ) return "red" ; return "#D7DBDD"; })
                       .attr("stroke", "#D7DBDD")
                       .attr("opacity",0.5)
                       .style("cursor","pointer")
                       .attr("text-anchor", "start").on("click",(event) => { this.highlight_node_links(event,0) });
                   node.append("text")
                       .append('svg:tspan')
                       .attr("x", function (d: any) { if(d["name"] === "OUT") return 0;   return d.x0 + 50 })
                       .attr("y", function (d: any) { var ycounts=(isNaN(d.y1)? 0 : ((d.y1+d.y0)/2));  return ycounts; })
                       .style("font-size","14px").style("font-family","calibri")
                       .text(function (d) {
                              if(d["name"] === "OUT" || (isNaN(d["y1"]))) return"";
                             return  d["name"];
                        })
                       .append('svg:tspan')
                       .attr("x", function (d: any) { return d.x0 + 50 })
                       .attr("y", function (d: any) { return (d.y1 + d.y0 + 20) / 2; })
                       .style("font-size","12px").style("font-family","calibri")
                       .text(function (d) {
                            if(d["name"] === "OUT") return"";
                            if(d["depth"] === 0) return  d["value"] + " ( " +  (d["value"]/count * 100).toFixed(2) + " % ) ";
                            if(isNaN(d["y1"])) return ''; if(d["name"] === "EXIT") return  d["value"] + " ( " +  (d["value"]/count * 100).toFixed(2) + " % ) ";
                            return d["value"] ;
                        })
                       .attr("fill",function (d: any) { if(d["name"] === "EXIT" ) return "black" ; return "#34495E"; }) 
                       .filter(function (d: any) { return d.x0 < width / 2; })
                       .attr("text-anchor", "start").on("click",(event) => { this.highlight_node_links(event,0) });
                       try{
                    node.call(tip)
                    .on("mouseover", tip.show)
                   .on("mouseout", tip.hide);
                       }catch(e){console.log(e);}
}

  }


  setBackNavigation()
  {
    this.changemode = false;
    let f = JSON.parse(this.filter).filter;
    let eventdata = {};
    eventdata["name"] = null;
    if(f.dimName != 'EntryPage')

     eventdata["startPage"] = false;
    else
      eventdata["startPage"] = true;
    this.onFilterData.emit(eventdata);
  }


           highlight_node_links(node, i)
               {

                if(node.depth == 0)
                 this.showFilterAppliedData(node); 
                else
                {
                let remainingNodes = [];
                let nextNodes = [];

               let stroke_opacity = 0;
               let bl = 'none';
               if (node["data-clicked"] == 1) {
                   node["data-clicked"] = 0
                   stroke_opacity = 0.4;
                   bl = 'none';
               } else {
                   node["data-clicked"] = 1;
                   stroke_opacity = 1.0;
                   bl = 'block';
               }
               let traverse = [{
                   linkType: "sourceLinks",
                   nodeType: "target"
               }, {
                   linkType: "targetLinks",
                   nodeType: "source"
               }];

           traverse.forEach((step)=> {
                   node[step.linkType].forEach((link) =>{
                       remainingNodes.push(link[step.nodeType]);
                       this.d3.select("#link-" + link.index).style("stroke-opacity", stroke_opacity);
                       this.d3.select("#linkt-" + link.index).attr("style","display:none;fill:yellow;font-size:13px");
                   });



                   while (remainingNodes.length) {
                       nextNodes = [];
                       remainingNodes.forEach((node)=> {
                           node[step.linkType].forEach((link)=> {
                               nextNodes.push(link[step.nodeType]);

                          this.d3.select("#link-" + link.index).style("stroke-opacity", stroke_opacity);
                          this.d3.select("#linkt-" + link.index).attr("style","display:none");
                           });
                       });
                       remainingNodes = nextNodes;
                   }
               });
              }
  }

setValue()
{
 if(this.filter != undefined)
 {
  let f = this.filter;
   
  let val = this.getDimType(this.dimType);
  f.filter.dimType = val;
  f.filter.dimName = this.dimType;
  if(this.dimType === 'EntryPage')
   f.filter.startpage = true;
  else
   f.filter.startpage = false;
  if(f.filter.browsers !== undefined && f.filter.browsers !== null)
   f.filter.browsers = null;
  if(f.filter.os !== undefined && f.filter.os !== null)
   f.filter.os = null;
  if(f.filter.locations !== undefined && f.filter.location !== null)
   f.filter.location = null;
  if(f.filter.devices !== undefined && f.filter.devices !== null)
   f.filter.devices = null;
  
 
  this.onFilterData.emit(f); 
 }
else
 {
   let filter = {};
   let time = ((new Date().getTime()) -  24*60*60*1000);
   let date = moment.tz(time,sessionStorage.getItem("_nvtimezone")).format('MM/DD/YYYY HH:mm:ss');
   let d = new Date(moment.tz(time,sessionStorage.getItem("_nvtimezone")).format('MM/DD/YYYY HH:mm:ss'));
   let date1 = window["toDateString"](d);
   if(navigator.userAgent.indexOf("MSIE") > -1 || navigator.userAgent.indexOf("rv:11.0") > -1 || navigator.userAgent.indexOf("Edge") > -1)
    {
      let tmpDate = (d.getMonth() + 1) + "/" + d.getDate()  + "/" + d.getFullYear();
     date1 = tmpDate;
    }
   let startT = date1 + " 00:00:00";
   let endT = date1 + " 23:59:00";
   filter["timeFilter"].startTime =  startT;
   filter["timeFilter"].endTime =  endT;
   filter["dimType"] =  this.getDimType(this.dimType);
   this.onFilterData.emit(filter);
 }
}

getDimType(dimval)
 {
  if(dimval === 'Browser')
    return 0;
  else if(dimval === 'OS')
    return 3
  else if(dimval === 'Location')
    return 1
  else if(dimval === 'Device')
   return 2;
  else if(dimval === 'Referrer')
   return 4;
  else if(dimval === 'EntryPage')
   return 1;
 }

setFilterCriteria(filterc,timefilter)
 {
   let filterp = filterc;
   //PathanalysisfilterComponent.filterhtml = "";
   let filterCriteria = filterp.filterCriteriaList;
   let tfilter = timefilter;
   if(tfilter.last !== null && tfilter.last !== '') // defined
   {
     // PathanalysisfilterComponent.filterhtml += "Last " + tfilter.last;
   }
   else
   {
      let d = new Date(tfilter.startTime);
      let e = new Date(tfilter.endTime);
    }
     for(let i = 0; i < filterCriteria.length;i++)
     {
      if((i < filterCriteria.length - 1))
       {
        // PathanalysisfilterComponent.filterhtml += " , ";
       }
      if(filterCriteria[i].name === 'Page')
      {}
      else
         "";//PathanalysisfilterComponent.filterhtml += " " + filterCriteria[i].name + " : " + filterCriteria[i].value;
    }
 }

showFilterAppliedData(event)
{
 this.changemode = true;
 let f = JSON.parse(this.filter).filter;
 let eventdata = {};
 eventdata["name"] = event.name;
 if(f.dimName != 'EntryPage')
  eventdata["startPage"] = false;
 else
  eventdata["startPage"] = true;
 this.onFilterData.emit(eventdata);
}


clearSankeyChart() {
    if (this.d3.select('#sankey').selectAll('svg')) {
            this.d3.select('#sankey').selectAll('svg').remove();
            this.d3.selectAll(".d3-tip").remove();
        }
    }
    

}
