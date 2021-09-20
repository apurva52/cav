import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DynamicFormService {
  metadata: any;


  setMetadata(metadataMap: any) {
    this.metadata = metadataMap;
  }

  getMetadata(name: string): Observable<any[]> {

    const tmpArr = [];
    if (this.metadata[name] !== undefined) {
      return of(this.metadata[name]);
    } else {
      return of(tmpArr);
    }
  }

  constructor() { }

  getColSpan(val: number): Observable<string> {

    switch (val) {
      case 1: return of('p-col-1');
      case 2: return of('p-col-2');
      case 3: return of('p-col-3');
      case 4: return of('p-col-4');
      case 5: return of('p-col-5');
      case 6: return of('p-col-6');
      case 7: return of('p-col-7');
      case 8: return of('p-col-8');
      case 9: return of('p-col-9');
      case 10: return of('p-col-10');
      case 11: return of('p-col-11');
      case 12: return of('p-col-12');
      default: return of('p-col-12');

    }
  }

  getColOffset(val): Observable<string> {
    switch (val) {
      case 1: return of(' p-offset-1');
      case 2: return of(' p-offset-2');
      case 3: return of(' p-offset-3');
      case 4: return of(' p-offset-4');
      case 5: return of(' p-offset-5');
      case 6: return of(' p-offset-6');
      case 7: return of(' p-offset-7');
      case 8: return of(' p-offset-8');
      case 9: return of(' p-offset-9');
      case 10: return of(' p-offset-10');
      case 11: return of(' p-offset-11');
      case 12: return of(' p-offset-12');
      default: return of(' ');
    }
  }

  getErrorMessage() {
    const errorMessage = {
      min: 'The value you entered cannot be less than ',
      max: 'The value you entered  cannot be more than ',
      required: 'This field is required',
      email: 'Email is incorrect',
      pattern: 'The value you entered is not valid'
    };

    return of(errorMessage);
  }
}
