import { PatternVal } from "../../../../generic-gdf/containers/adv-metric-configuration-data";

export class AdvSettings {
  delVecCount: number = 5; // delete vector count -Time (in minute) to hold non-exist vector
  interval: number; //sample interval is by default 10000ms
  delay: number = 60000; //delay 
  rCount: number = 60;   //Count of maximum retry to make connection
  jFile: string = ""; // service account json file path
  tFile: string = ""; // service account token file path
  dbCon: boolean = false; // DB connection
  oP: PatternVal[] = []; // other parameters
}


