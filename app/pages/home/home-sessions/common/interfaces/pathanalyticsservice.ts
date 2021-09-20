export class PathAnalyticsDataService
{
  rawdata = null;
  maxSankeyChartDepth = 0;
  sankeyStep = 1; 
  maxNodeLength = 0;
  globalNodeInOutStatus = null;
  globalDepthInOutStatus = null;
  refinedData = null;
  globalDepthViewStatus = null;
  globalNodeViewInOutStatus  = null;

  constructor(rawdata:any)
  {
    this.rawdata = rawdata;
    this.extractCurDepthSankeyData(this.refineSankeyChartData(this.rawdata),this.sankeyStep);
  }

  // methods for preparing data for sankey chart from raw data.
  
  refineSankeyChartData(data)
  {
    let maxDepth = 0;
    let nodes = [];
    for(let i = 0; i < data.length; i++)
    {
     let node = data[i];
     if(!nodes[node.depth -1])
       nodes[node.depth - 1] = [];

     if(!nodes[node.depth])
       nodes[node.depth] = [];

     nodes[node.depth - 1].push(node.source);
     nodes[node.depth].push(node.target);

     //to find max depth
     if ((node.depth * 1) > maxDepth)
            maxDepth = node.depth * 1;
    }


    this.setMaxSankeyChartDepth(maxDepth);
    this.sankeyStep = maxDepth;
    /** make nodes set step2 - remove duplicated nodes */
    for(let i = 0; i < nodes.length; i++)
    {
      let depthList = nodes[i];
      let uniqueArray = [];
      for(let j = 0; j < depthList.length; j++)
      {
        let match = false;
        for(let b = 0; b < uniqueArray.length; b++)
         {
          if(depthList[j] == uniqueArray[b])
          {
            match = true;
            break;
          }
         }
        if(!match)
          uniqueArray.push(depthList[j]);
      }
        nodes[i] = uniqueArray;
    }

    let maxNodeLength = 0;
    let nodeIndex = 0;
    let nodeList = [];

    for(let i = 0; i < nodes.length; i++)
     {
      if(nodes[i].length > maxNodeLength)
       maxNodeLength = nodes[i].length;

       let curDepth = i;
       for(let j = 0; j < nodes[i].length; j++)
        {
         nodeList.push({node: nodeIndex, name:nodes[i][j] , depth: curDepth});
         nodeIndex++;
        }
     }

    this.setMaxNodeLength(maxNodeLength); 
    let linkList = [];
    for(var i = 0; i < data.length;i++)
     {
       let node = data[i];
       let source = node.source;
       let target = node.target;
       let depth = node.depth;
       let tr = '';      
 
       for(let k =0; k < nodeList.length; k++)
                        {
                if(source == nodeList[k].name && (depth - 1) == nodeList[k].depth)
                {
                    source = nodeList[k].node;
                    break;
                }
            }
            for(let k =0;k < nodeList.length;k++){
                if(target == nodeList[k].name && depth == nodeList[k].depth) {
                    target = nodeList[k].node;
                    tr = node.target;
                    break;
                }
            }
            linkList.push({source: source, target: target, value: node.value, depth: depth,target1:tr})
        }

        return {nodes: nodeList, links: linkList};
  }

  extractCurDepthSankeyData(sankeyData, depth)
  {
     let oldNodes = sankeyData.nodes;
     let oldLinks = sankeyData.links;
     let newNodes = [];
     let newLinks = [];
     let endNodeIndex = 0;
     let nodeInOutStatus = [];
     let depthInOutStatus = [];
     let nodedpstatus = [];
     let depthst = [];

     /** extract nodes */
     for(let i = 0; i < oldNodes.length; i++)
     {
       let element = oldNodes[i];
       if (element.depth <= depth)
       {
          newNodes.push(element);
          endNodeIndex = element.node + 1;
          nodeInOutStatus.push({node: element.node, in: 0, out: 0});

          if (!depthInOutStatus[element.depth])
            depthInOutStatus.push({depth: element.depth, in: 0, out: 0});
         
          // This is done for exit case we dont need to add the counts
          if (!depthst[element.depth])
            depthst.push({depth: element.depth, in: 0, out: 0});

          nodedpstatus.push({node: element.node, in: 0, out: 0});

       }
     }
     /** extract links */
     for(let i = 0; i < oldLinks.length; i++)
     {
        let element = oldLinks[i];
        //exist link
        if (element.depth <= depth)
          newLinks.push(element);

        //out of page calculate to make  OUT of page link
        if (element.depth <= depth + 1)
        {
           let s = element.source;
           let t= element.target;
           let v = element.value * 1;  //string to number

           if(nodeInOutStatus[t])
             nodeInOutStatus[t].in = nodeInOutStatus[t].in + v;

           if(nodeInOutStatus[s])
             nodeInOutStatus[s].out = nodeInOutStatus[s].out + v;

           if(nodedpstatus[t] && oldLinks[i].target1 !== "EXIT")
             nodedpstatus[t].in = nodedpstatus[t].in + v;
           else if(nodedpstatus[t])
             nodedpstatus[t].in = nodedpstatus[t].in ;

           if(nodedpstatus[s] && oldLinks[i].target1 !== "EXIT")
             nodedpstatus[s].out = nodedpstatus[s].out + v
           else if(nodedpstatus[s]) 
             nodedpstatus[s].out = nodedpstatus[s].out ;

           //changes for exit node
           if(depthst[element.depth])
           {
             if(oldLinks[i].target1 !== 'EXIT')
              {
                depthst[element.depth - 1].out = depthst[element.depth - 1].out + v;
                depthst[element.depth].in = depthst[element.depth].in + v;
              }
             else
              {
                depthst[element.depth - 1].out = depthst[element.depth - 1].out;
                depthst[element.depth].in = depthst[element.depth].in;
              }
           }  

           //make depthInOutStatus
           if(depthInOutStatus[element.depth])
           {
             depthInOutStatus[element.depth].in = depthInOutStatus[element.depth].in + v;
             depthInOutStatus[element.depth - 1].out = depthInOutStatus[element.depth - 1].out + v;
           }
        }
       }
        /** append calculated page link */
      if (depth > 1)
       {
          //add out of page node for pretty sankey chart when depth is bigger than depth 1.
          newNodes.push({node: endNodeIndex, name: "OUT", depth: depth});

          //add out of page link for pretty sankey chart
          for(let i = 0; i < nodeInOutStatus.length; i++)
          {
             let element = nodeInOutStatus[i];
             let diffInOut = element.in - element.out;
             let calDepth = (newNodes[element.node].depth < depth);

             if (diffInOut > 0 && calDepth) {
                   newLinks.push({
                       source: element.node,
                       target: endNodeIndex,
                       //target:element.node,
                       value: element.in - element.out,
                       depth: depth
                   });
                
             }
         }
       }

       this.globalNodeInOutStatus = nodeInOutStatus;
       this.globalDepthInOutStatus = depthInOutStatus;
       this.refinedData = {nodes: newNodes, links: newLinks};
       this.globalDepthViewStatus = depthst;
       this.globalNodeViewInOutStatus = nodedpstatus;
       
   }

   setMaxSankeyChartDepth(maxDepth) {
     this.maxSankeyChartDepth = maxDepth;
   }

   getMaxSankeyChartDepth() {
       return this.maxSankeyChartDepth;
   }

   setMaxNodeLength(maxLength) {
       this.maxNodeLength = maxLength;
   }

   getMaxNodeLength() {
       return this.maxNodeLength;
   }
  
} 
