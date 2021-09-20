import { SelectItem } from 'primeng';
import { Subject } from 'rxjs';

export class ExecDashboardUtil {



  /**
   * This method is responsible to generating select item lists
   */
  static createSelectItem(list: any[]): SelectItem[] {

    let selectItemList: SelectItem[];
    selectItemList = [];

    for (let index in list) {
      selectItemList.push({ label: list[index], value: list[index] });
    }
    return selectItemList;
  }

  /**
 * returns total of PVS
 * @param val1 
 * @param val2 
 */
  static getPVSTotal(val1, val2) {
    try {
      if (val1 === "-" || val1 < 0) {
        val1 = 0;
      }
      if (val2 === "-" || val2 < 0) {
        val2 = 0;
      }
      let sum = parseInt(val1.toFixed(0)) + parseInt(val2.toFixed(0));
      return this.numberFormatWithDecimal(sum, 0);
    } catch (error) {
      console.error(error);
      return '0';
    }
  }

  /**
   * THis method is responsible for displaying decimal points
   * @param value1
   * @param uptoDecimal 
   */
  static numberFormatWithDecimal(value, uptoDecimal, cell?: string) {
    try {
	
      if (!cell) {
        if (!value || value === '-' || value < 0)
          return "-";
      } else if (cell === "custom"){
	if (!value || value === '-' || value < 0)
          return "0";
      }

      let aDigits = value.toFixed(uptoDecimal).split(".");
      aDigits[0] = aDigits[0].split("").reverse().join("").replace(/(\d{3})(?=\d)/g, "$1,").split("").reverse().join("");
      return aDigits.join(".");
    }
    catch (e) {
      return "-";
    }
  }

  /**
    * Calculates Response Time
    * @param value 
    */
  static calculateRes(value) {
    try {
      if (value === '-')
        return '-';
      return parseFloat(value.toString().replace(",", "")) / 1000;
    } catch (error) {
      console.error(error);
      return '-';
    }
  }


  static calculateResForTooltip(value) {
    try {
      if (value === '-')
        return '-';
      return parseFloat(value.toString().replace(",", ""));
    } catch (error) {
      console.error(error);
      return '-';
    }
  }

  static isEmpty = function (val) {
    return (val === undefined || val == null || val.length <= 0) ? true : false;
  }

  static isValidHH = function (val) {
    return (val <= 23) ? true : false
  }

  static isValidMMSS = function (val) {
    return (val <= 60) ? true : false
  }

  /*validation for hh:mm:ss format for Time */
  static validateTimeWithSecond(time) {
    let validate = false;
    if (/^(?:2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]$/.test(time)) {
      validate = true;
    }
    return validate;
  }

  /* to get time in hh:mm:ss format */
  static getTimeInHHMMSS(time) {
      let fTime = '';
    try {
      let tempTime = '';
      tempTime = time.split(':');
      for (let i = 0; i < tempTime.length; i++ ) {
        let x  = tempTime[i];
        if (x.length < 2) {
          x = '0' + x;
        }
        if (i === 0) {
          fTime = fTime + x;
        } else {
          fTime = fTime + ':' + x;
        }
      }
    } catch (error) {
      console.log('error in getTimeInHHMMSS ', error);
    }
    return fTime;
  }

   /*
   * number format with comma seperate values 
   */
  static numberToCommaSeperate(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  /*
  * Removes whitespace from string
  */
 static removeWhiteSpaceFromSpace(string) {
  return string.replace(/\s+/g, '');
}

    
  /*Observable for update progress bar sources.*/
  private _progressBarObser = new Subject();
  
  /*Service message commands.*/
  progressBarEmit(flag) {
    this._progressBarObser.next(flag);
  }
  /*Service Observable for getting update message.*/
  progressBarProvider$ = this._progressBarObser.asObservable();






  constructor() { }

}
