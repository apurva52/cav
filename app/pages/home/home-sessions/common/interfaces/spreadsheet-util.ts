export interface ReportRange {
  sheetId?: number;
  startRowIndex: number;
  startColIndex: number;
  endRowIndex: number;
  endColIndex: number;
  headerRange: string;
  range: string;
}

export default class SpreadsheetUtils {
  static getReportRange(startIndex: string, row: number, column: number): ReportRange {
    const _column = startIndex.replace(/[0-9]+$/, '');
    const _row = parseInt(startIndex.match(/[0-9]+$/)[0], 10);
    const _lastcolumn = SpreadsheetUtils.NumberToColumn(SpreadsheetUtils.ColumnToNumber(_column) + column - 1);

    return {
      startRowIndex: _row,
      startColIndex: SpreadsheetUtils.ColumnToNumber(_column),
      endRowIndex: _row + row,
      endColIndex: SpreadsheetUtils.ColumnToNumber(_column) + column,
      headerRange: startIndex + ':' + _lastcolumn + (_row),
      range: startIndex + ':' + _lastcolumn + (_row + row)
    };
  }

  static cellInRange(range: ReportRange, rowidx: number, colidx: number) {
    return (rowidx >= range.startRowIndex && rowidx <= range.endRowIndex &&
      colidx >= range.startColIndex && colidx < range.endColIndex);
  }


  static ColumnToNumber(col: string): number {
    let num = 0;
    let i = 0;
    while (i < col.length) {
      num = col.charCodeAt(i) - 64 + num * 26;
      i++;
    }
    return num;
  }


  static NumberToColumn(col: number): string {
    let str = '', q, r;
    while (col > 0) {
      q = (col - 1) / 26;
      r = (col - 1) % 26;
      col = Math.floor(q);
      str = String.fromCharCode(65 + r) + str;
    }
    return str;
  }
}



export class Report {
  constructor(
    public name: string,
    public crqname: string,
    public type: string,
    public headers: string[],
    public row: number,
    public column: number
  ) { }


}

export class ObjectUtils {
  static removeAccents(str) {
    if (str && str.search(/[\xC0-\xFF]/g) > -1) {
      str = str
        .replace(/[\xC0-\xC5]/g, 'A')
        .replace(/[\xC6]/g, 'AE')
        .replace(/[\xC7]/g, 'C')
        .replace(/[\xC8-\xCB]/g, 'E')
        .replace(/[\xCC-\xCF]/g, 'I')
        .replace(/[\xD0]/g, 'D')
        .replace(/[\xD1]/g, 'N')
        .replace(/[\xD2-\xD6\xD8]/g, 'O')
        .replace(/[\xD9-\xDC]/g, 'U')
        .replace(/[\xDD]/g, 'Y')
        .replace(/[\xDE]/g, 'P')
        .replace(/[\xE0-\xE5]/g, 'a')
        .replace(/[\xE6]/g, 'ae')
        .replace(/[\xE7]/g, 'c')
        .replace(/[\xE8-\xEB]/g, 'e')
        .replace(/[\xEC-\xEF]/g, 'i')
        .replace(/[\xF1]/g, 'n')
        .replace(/[\xF2-\xF6\xF8]/g, 'o')
        .replace(/[\xF9-\xFC]/g, 'u')
        .replace(/[\xFE]/g, 'p')
        .replace(/[\xFD\xFF]/g, 'y');
    }
    return str;
  }

  static resolveFieldData(data, field) {
    if (data && field) {
      if (this.isFunction(field)) {
        return field(data);
      } else if (field.indexOf('.') === -1) {
        return data[field];
      } else {
        const fields = field.split('.');
        let value = data;
        for (let i = 0, len = fields.length; i < len; ++i) {
          if (value == null) {
            return null;
          }
          value = value[fields[i]];
        }
        return value;
      }
    } else {
      return null;
    }
  }

  static isFunction(obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
  }
}
