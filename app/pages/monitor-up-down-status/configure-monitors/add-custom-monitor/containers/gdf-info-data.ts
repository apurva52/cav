

import { MetricHierarchyData } from "src/app/pages/generic-gdf/containers/metric-hierarchy-data";
import { MetricInfoData } from "./configure-cmd-mon-data";


 export class GdfInfo
 {
    grpN:string = ""; // Group Name
    gI:number = -1; // Group ID(In case of 'add' it will be -1 and in 'edit' it would be number of the gdf group id.
    gT:string = "vector"; // Group Type Sample,Rate,Cumulative,times,timesstd
    nM:number = -1; // Num of metrics (graph)
    nV:number = -1; // Num of vectors
    mV:string = "Application Metrics"; //to be changed 
    mD:string = ""; // Metric hirecharchy (metaData)
    gD:string = ""; // Group Description
    metricInfo : MetricInfoData[] = []; //Metric information
    depMHComp:MetricHierarchyData[] = [];
 }
