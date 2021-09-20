import { Component, OnInit, ElementRef, NgZone, Input, ViewEncapsulation} from '@angular/core';
import { D3Service,D3,Selection} from 'd3-ng2-service';
import * as d3Sankey from 'd3-sankey';
import { PathAnalyticsDataService } from '../../common/interfaces/pathanalyticsservice';
import { ActivatedRoute, Router } from '@angular/router';
import { Metadata } from '../../common/interfaces/metadata';
import {NavigationPath} from './navigationpath';
import * as d3Tip from 'd3-tip';
import { NvhttpService } from '../../common/service/nvhttp.service';

@Component({
  selector: 'app-navigationpathanalysis',
  templateUrl: './navigationpathanalysis.component.html',
  styleUrls: ['./navigationpathanalysis.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class NavigationpathanalysisComponent implements OnInit {

  @Input() dimensions = ["Browser","Location","OS","Device","User Segment"];
  
  pathDataService: PathAnalyticsDataService;
  private d3: D3;
  private parentNativeElement: any;
  private d3Svg: Selection<SVGSVGElement, any, null, undefined>;
  metadata: Metadata = null;
  height: any;
  @Input() maxnodelength : any; 
  @Input() refinedData : any ;
  @Input() response: any;
  @Input() filter: any;
 
  constructor(element: ElementRef, private ngZone: NgZone, d3Service: D3Service,private httpService: NvhttpService, private route: ActivatedRoute,private router: Router) 
  {
    this.d3 = d3Service.getD3();
    this.parentNativeElement = element.nativeElement;
  }

  ngOnInit() {
   //Check if it is coming from breadcrumb then set the previous breadcrumb else set a new one.
   //Note: no need to check this.breadInfo == null.
     if(this.maxnodelength < 300)
      this.height = this.maxnodelength +250;
     else
      this.height = this.maxnodelength;
     this.pathDataService = this.refinedData;
     this.drawSankeyChart(this.pathDataService.refinedData);
  }

  drawSankeyChart(refineSankeyData) 
  {
    var NODE_WIDTH = 200;
    var NODE_PADDING = 40;
    var DEPTH_WIDTH = 350;


    var margin = {top: 70, right: 0, bottom: 0, left: 0};
    var width = 550 + ((this.pathDataService.sankeyStep - 1) * DEPTH_WIDTH) + 150;
    var sankeyWidth = width - 150;  //for next/previous button
    var height = this.pathDataService.getMaxNodeLength() * 100 + margin.top + 150;
    /** sankeyChart-area size */

    var formatNumber = this.d3.format(",.0f"),
    format = function (d: any) { return formatNumber(d) + " Sessions"; },
    color = this.d3.scaleOrdinal(this.d3.schemeCategory10);


    var svg = this.d3.select("#sankey").append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
           .append("g")
           .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



     var sankey = d3Sankey.sankey()
                  .nodeWidth(NODE_WIDTH)
                  .nodePadding(NODE_PADDING)
                  .size([sankeyWidth, height-150]); //rkm-height-150


    /** init sankeyDataSet */
     let sankeyDataSet = refineSankeyData;
     if (sankeyDataSet) {
        var link = svg.append("g")
                      .attr("class", "links")
                      .attr("fill", "none")
                      .attr("stroke", "#000")
                      .attr("stroke-opacity", 0.2)
                      //.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                      .selectAll("path");

        var node = svg.append("g")
                      .attr("class", "nodes")
                      .attr("font-family", "sans-serif")
                      .attr("font-size", 14)
                      .attr("font-weight", 600)
                      .attr('margin-top',"10")
                      //.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
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
                             .attr("offset", "40%")
                             .attr("stop-color", "#186ba0");
                             gradX.append("stop")
                             .attr("offset", "41%")
                             .attr("stop-color", "white");
                             gradX.append("stop")
                             .attr("offset", "100%")
                             .attr("stop-color", "white");



         
        let depthInfo = svg.append("g").selectAll(".depthInfo")
                        .data(this.pathDataService.globalDepthInOutStatus)
                        .enter().append("g")
                        .attr("class", "depthInfo");
                         depthInfo.append("rect")
                        //.attr("height", 50)
                        .attr("height", function (d) {
                            //if(d["depth"] == 0) return "";
                            //if(d["depth"] == 1) return 60;
                            return 75;
                        })
                        .attr("width", NODE_WIDTH)
                        .attr("x", function (d) {
                            //if(d["depth"] == 0) return "";
                            return d["depth"] * DEPTH_WIDTH;
                        })
                        .attr("y", -80)
                        .style("stroke","#186ba0")
                        .style("fill","url(#linear)")
                        .attr('dx',100 )
                        .append("title")
                        .text(function (d) {
                           if(d["depth"] == 0) return "PREVIOUS ";
                           if(d["depth"] == 1) return " CURRENT ";
                           return ' NEXT ';
                        });


                    depthInfo.append("text")
                        .attr("y", -60)
                        .append('svg:tspan')
                        .attr("x", function (d) {
                            return (d["depth"] * DEPTH_WIDTH) + 60;//plus padding
                        })
                        .attr('dy', 5)
                        .attr("fill", "white")
                        .style("font-size","16px")
                        .style("font-family","calibri")
                        .text(function (d) {
                            if(d["depth"] == 0) return "PREVIOUS ";
                            if(d["depth"] == 1) return " CURRENT ";
                            return ' NEXT ';
                        })
                        .append('svg:tspan')
                        .attr("x", function (d) {
                           return (d["depth"] * DEPTH_WIDTH) + 5;//plus padding
                        })
                        .attr('dy', 15)
                        .style("font-size","12px")
                        .text(function (d) {

                            if(d["depth"] == 0) return "";
                            return d["in"] + ' Sessions';
                        })
                        .attr("fill", "black")
                        .append('svg:tspan')
                        .attr("x", function (d) {
                            return (d["depth"] * DEPTH_WIDTH) + 5;//plus padding
                        })
                        .attr('dy', 15)
                        .text(function (d) {

                            if(d["depth"] == 0) return  d["out"] + ' Sessions ';
                            if(d["depth"] == 1)  return d["out"] + ' Through';
                            if(d["depth"] == 2)  return '';
                        })
                        .attr("fill", "black")
                         .append('svg:tspan')
                        .attr("x", function (d) {
                            return (d["depth"] * DEPTH_WIDTH) + 5;//plus padding
                        })
                        .attr('dy', 15)
                        .text(function (d) {

                            if (d["depth"] == 1) 
                                return (d["in"] - d["out"]) + ' Drop-Offs';
                            else
                                return "";
                        })
                        .attr("fill", "black")

                        ;
               sankey(sankeyDataSet);
               link = link
                       .data(sankeyDataSet.links)
                       .enter().append("path")
                       .attr("d", d3Sankey.sankeyLinkHorizontal())
                       .attr("stroke-width", function (d: any) {  return Math.max(1, d.width); })
                       .attr("id", function (d:any, i) {
                   d.id = i;
                   return "link-" + i;
               }).style("stroke", function (d) {
                 if (d["target"].name == 'OUT') {
                        return "red";
                    }
                    return '#000'; //google link color
                }).sort(function (a, b) {
                    return a["width"] - b["width"];
                });


               let tip = d3Tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html((d:any) => {

                    if (d.depth == 0 || d.name == 'OUT') {
                        return "<strong>Page :</strong> <span style='color:red'>" + d.name + "</span>";
                    }

                    var inVal = this.pathDataService.globalNodeInOutStatus[d.node].in;
                    var outVal = this.pathDataService.globalNodeInOutStatus[d.node].out;
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
                       .attr("y", function (d: any) {  return d.y0; })
                       //.attr("height", function (d: any) {  return ((d.y1 - d.y0 < 40 ) ? 50 : d.y1 - d.y0)   })
                       .attr("height", function (d: any) {  return d.y1 - d.y0 })
                       .attr("width", function (d: any) {   return d.x1 - d.x0; })
                       .attr("fill", "#D7DBDD")//function (d: any) { return color(d.name.replace(/ .*/, "")); })
                       .attr("stroke", "#D7DBDD")
                       .attr("opacity",0.5)
                       .style("cursor","pointer")
                       .attr("text-anchor", "start").on("click",(event) => { this.highlight_node_links(event,0) });
                   node.append("text")
                       .append('svg:tspan')
                       .attr("x", function (d: any) {   return d.x0 + 50 })
                       .attr("y", function (d: any) {   return (d.y1 + d.y0) / 2; })
                       .style("font-size","14px").style("font-family","calibri")
                       .text(function (d) {
                             return  d["name"];
                        })
                       .append('svg:tspan')
                       .attr("x", function (d: any) { return d.x0 + 50 })
                       .attr("y", function (d: any) { return (d.y1 + d.y0 + 20) / 2; })
                       .style("font-size","13px").style("font-family","calibri")
                       .text(function (d) {
                            return d["value"];
                        })
                       .append('svg:tspan')
                       .attr("x", function (d: any) { return d.x0 +50 })
                       .attr("y", function (d: any) { return (d.y1 + d.y0 ) / 2; })
                       .style("font-size","13px").style("font-family","calibri")
                       .text(function (d) {
                           if (d["depth"] == 1)
                            return "";
                        })
                       .filter(function (d: any) { return d.x0 < width / 2; })
                       .attr("text-anchor", "start").on("click",(event) => { this.highlight_node_links(event,0) });
                    node.call(tip)
                   .on("mouseover", tip.show)
                   .on("mouseout", tip.hide);
      }
  }


           highlight_node_links(node, i)
               {

                let remainingNodes = [];
                let nextNodes = [];

               let stroke_opacity = 0;
               if (node["data-clicked"] == 1) {
                   node["data-clicked"] = 0
                   stroke_opacity = 0.4;
               } else {
                   node["data-clicked"] = 1;
                   stroke_opacity = 1.0;
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
                      this.d3.select("#link-" + link.index).style("stroke-opacity", stroke_opacity);;
                   });



                   while (remainingNodes.length) {
                       nextNodes = [];
                       remainingNodes.forEach((node)=> {
                           node[step.linkType].forEach((link)=> {
                               nextNodes.push(link[step.nodeType]);

                          this.d3.select("#link-" + link.index).style("stroke-opacity", stroke_opacity);;
                           });
                       });
                       remainingNodes = nextNodes;
                   }
               });
             }

}
