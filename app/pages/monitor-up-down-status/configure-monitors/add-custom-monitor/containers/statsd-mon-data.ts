
import { AdvSettings } from "./adv-settings.data";
import { GdfInfo } from "./configure-cmd-mon-data";
//import { AdvSettings } from "./adv-settings.data";
//import { AdvSettings } from "./db-adv-settings-data";

export class StatsDMonData {
      monN: string = ""; // Custom Mon Name
      opt: string = ""; // Options
      oN: string = "";
      idnt:string = "";     //identifier
      adv: AdvSettings = new AdvSettings;
      gdfInfo: GdfInfo = new GdfInfo;
      cat: string = "system"; //category name by default it will be Command Monitor
      mS: string = "";         //metric syntax
      tier: boolean = true; // tier
      server: boolean = true; // server
      cusCat: string = "";
}