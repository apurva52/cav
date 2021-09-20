import { MetricConfData } from "./metric-configuration-data";

export class GenericGDFMetricInfo
{
      graph:string = "Graph";
      graphNm :string = ""; // Graph Name
      gId:number;// Graph ID
      gT:string = "scalar"; // Graph Type
      dT:string = "sample"; // Data Type
      gI:number; // Graph Data Index
      fL:string = "NA"; // Formula
      nV:string = "0"; // Num Vectors
      gS:string = "NA"; // Graph State
      pI:string = "-1"; // PDf ID
      pDI:string = "-1"; // Percentile Data Index
      f2:string = "NA"; // Future 2
      f3:string = "NA"; // Derived Formula in GDF
      gD:string = ""; // Graph Description
      dC:string = ""; // Dependent Component
      depMConf:MetricConfData[] = [];
}
