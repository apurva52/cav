import { CellDef, jsPDFDocument, Styles } from "jspdf-autotable";
import { Table } from "src/app/shared/table/table.model";

export interface JSPDFDocument {
  head : CellDef[][],
  body : CellDef[][],
  foot ?: CellDef[][],
  columnStyles?: {
		[key: string]: Partial<Styles>;
	};
};

export interface XLSJsonData {
  headers: string[];
  data: { [key: string]: string }[];
}

export class ExportUtil {

  public static getPageFormat(el:HTMLElement) : number[]{
    const a4FormatInPx = [798.66, 1122.52];
    let format = [...a4FormatInPx];
    // get table width. 
    try {
      // Note: Added 100px for padding in pdf document. 
      let width = (<HTMLElement>el.querySelector('.ui-table-scrollable-body')).scrollWidth +  100;
      if (width > a4FormatInPx[0]) 
        format[0] = width;
    } catch(ex) {
      console.error('Invalid table element. exception - ', ex);
    }

    return format;
  }

  /**
   * It will return json data for auto-table plugin for jspdf to export pdf. 
   * @param el 
   * @param skilColumn 
   * @param schema 
   */
  public static generatePDFData(el: HTMLElement, skipColumn: number, schema ?: Table): JSPDFDocument {
    // extract headers. 
    const headerTable = el.querySelector('.ui-table-scrollable-header-table');

    if (!headerTable) throw(new Error('Invalid data format'));

    let head: CellDef[] = [];

    Array.from(headerTable.querySelectorAll('thead>tr>th')).slice(skipColumn).forEach((e: Element) => {
      head.push({
        content: e.textContent 
      });
    });

    // extract body.
    const bodyTable = el.querySelector('.ui-table-scrollable-body');
    if (!bodyTable) throw new Error('Invalid data format');

    let firstRow = true;

    let body: CellDef[][] = [];

    let columnStyles : { [key: string]: Partial<Styles>} = {};
    
    bodyTable.querySelectorAll('tbody>tr').forEach((tr: Element) => {
      let colData: CellDef[] = [];
      Array.from(tr.children).filter(td => td.tagName == 'TD').slice(skipColumn).forEach((col: HTMLElement, index: number) => {
        // fill style from first row. 
        if (firstRow) {
          columnStyles[index] = {
            cellWidth: col.offsetWidth,
            // TODO: Check if in any case it may require center. 
            halign: col.className.indexOf('text-right') != -1 ? 'right': 'left'
          }
        }

        colData.push({content: col.textContent});
      });

      body.push(colData);

      firstRow = false;
    });
    
    // TODO: handling for footer. 
    return {
      head: [head],
      body,
      columnStyles
    }; 
  }

  /**
   * It will provide json data which can be passed to export xls. 
   * @param el 
   * @param skipColumn 
   */
  public static getXLSData(el: HTMLElement, skipColumn: number): XLSJsonData {

    let headerArr: string[] = [];
    let data: { [key: string]: string }[] = [];

    // extract headers. 
    const headerTable = el.querySelector('.ui-table-scrollable-header-table');

    if (!headerTable) throw (new Error('Invalid data format'));

    data[0] = {};

    Array.from(headerTable.querySelectorAll('thead>tr>th')).slice(skipColumn).forEach((e: Element, index) => {
      //const key = e.getAttribute('ng-reflect-field');
      // ng-reflect-* are available in case of debug mode only. Not available in prod mode. using index as key. 
      const key = index + '';
      headerArr.push(key);

      data[0][key] = e.textContent;  
    });

    let numRow = 1;

    // extract body.
    const bodyTable = el.querySelector('.ui-table-scrollable-body');
    if (!bodyTable) throw new Error('Invalid data format');

    bodyTable.querySelectorAll('tbody>tr').forEach((tr: Element) => {
      data[numRow] = {};
      Array.from(tr.children).filter(td => td.tagName == 'TD').slice(skipColumn).forEach((col: HTMLElement, index: number) => {
        data[numRow][headerArr[index]] = col.textContent;
      });
      numRow++;
    });

    return {
      headers: headerArr,
      data
    };
  }


  public static exportToCSV(table: HTMLElement, skipColumn: number, filename?: string) {
    let data: any[][] = [];
    //first collect data. 

    data[0] = [];

    // extract headers. 
    const headerTable = table.querySelector('.ui-table-scrollable-header-table');

    if (!headerTable) throw (new Error('Invalid data format'));

    Array.from(headerTable.querySelectorAll('thead>tr>th')).slice(skipColumn).forEach((e: Element) => {
      data[0].push(e.textContent);
    });

    let numRow = 1;
    // extract body.
    const bodyTable = table.querySelector('.ui-table-scrollable-body');
    if (!bodyTable) throw new Error('Invalid data format');

    bodyTable.querySelectorAll('tbody>tr').forEach((tr: Element) => {
      data[numRow] = [];
      Array.from(tr.children).filter(td => td.tagName == 'TD').slice(skipColumn).forEach((col: HTMLElement, index: number) => {
        data[numRow].push(col.textContent);
      });
      numRow++;
    });


    // convert 2d array into string. 
    let dataStr = '';
    let v;
    // TODO : optimise it. 
    data.forEach(row => {
      row.forEach((col, index) => {
        // escape \n. 
        v = col + '';

        v = v.replace(/\n/g, ' ');
        if (v.indexOf(',') != -1) {
          v = '"' + v  + '"';
        }
        if (index)
          dataStr += (',' +  v);
        else
          dataStr += v;
      })
      dataStr += '\r\n';
    });

    // create a download link. 
    var link = document.createElement('a');
    link.download = (filename || 'download.csv');
    link.href = 'data:text/csv;charset=utf-8,' + escape(dataStr);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}