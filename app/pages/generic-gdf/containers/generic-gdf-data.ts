import { GenericGDFMetricInfo } from "./generic-gdf-metric-data";

 export class GenericGDFData
 {
    grpN:string = ""; // Group Name
    gI:number = -1; // Group ID(In case of 'add' it will be -1 and in 'edit' it would be number of the gdf group id.
    gT:string = ""; // Group Type- Sample,Rate,Cumulative,times,timesstd
    nM:number = -1; // Num of metrics (graph)
    nV:number = -1; // Num of vectors
    mV:string = ""; //metric Type- System,Application, Custom
    mD:string = ""; // Metric hierarchy (metaData - dependent component)
    gD:string = ""; // Group Description
    cT:string =""; // custom Tier
    cS:string= ""; // custom Server
    metricInfo :GenericGDFMetricInfo[] = []; //Metric information
 }