export class Suggestion {
  filterName: string;
  value: string;
  separator: string;
  id: string; // for metadata type suggestions
  type: number;
  customType: number;
  displayValue: string; 
  /* suggestion type 
   * 1 : metadata
   * 0 : data
   * >4 : customMetrics
   */
  constructor(filterName, value, suggestionType, id)
  {
    this.filterName = filterName;
    this.value = value;
    this.separator = (suggestionType === 0 || suggestionType > 4) ? ' as ' : ' in ';
    if(this.filterName == "") // case of failed transactions.
      this.separator = "";
    this.id = id;
    this.type = suggestionType;
    this.customType = suggestionType - 4;
    if(value.length > 20)
      this.displayValue = value.substring(0,17) + "...";
    else
      this.displayValue = value;    
  }
}
