import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'f_ddr'  // formatter for ddr
})

export class DdrPipe implements PipeTransform {

  transform(value: any, format?: string, maxLength?: any): any {

        if(format ==='dec_1'){
            if (isNaN(value)) {
                return 0;
              }
              const num: any = parseFloat(value).toFixed(1);
              return num;
       }
       if(format ==='dec_2'){
        if (isNaN(value)) {
            return 0;
          }
          const num: any = parseFloat(value).toFixed(2);
          return num;
   }
       if(format ==='dec_3'){
        if (isNaN(value)) {
            return 0;
          }
          const num: any = parseFloat(value).toFixed(3);
          return num;
        }

  if (format === 'locale') { //to separate with comma numbers
    if (Number(value) && Number(value) > 0) {
      return Number(value).toLocaleString();
    }
    if (Number(value) == 0) {
      return '< 1';
    } else {
      return value;
    }
  }

  if (format === 'loc_dec0') { 
    if (isNaN(value) || value =="") {
      return 0;
    } 
    const num: any = parseFloat(parseFloat(value).toFixed(0)).toLocaleString();
    return num; 
  }
  
  if (format === 'loc_dec1') { 
    if (isNaN(value) || value=="") {
      return 0;
    } 
    const num: any = parseFloat(parseFloat(value).toFixed(1)).toLocaleString();
    return num; 
  }

  if (format === 'ms') { 
    if (isNaN(value) || value==" ") {
      return 0;
    } 
    const sec: any = ((value)/(1000));
    const num: any = parseFloat(sec).toFixed(3);
    if(num === 0.000){
      return 0;
    }
    return num; 
  }

  if (format === 'ns') { 
    if (isNaN(value) || value==" ") {
      return 0;
    } 
    const sec: any = ((value)/(1000000000));
    const num: any = parseFloat(sec).toFixed(3);
    if(num === 0.000){
      return 0;
    }
    return num; 
  }
  if (format === 'nms') { 
    if (isNaN(value) || value==" ") {
      return 0;
    } 
    const sec: any = ((value)/(1000000));
    const num: any = parseFloat(sec).toFixed(3);
    if(num === 0.000){
      return 0;
    }
    return num; 
  }

    if (format === 'ellipsis') {
      if (maxLength === undefined) {
        return value;
      }
      if (value && value.length > maxLength) {
        return value.substring(0, maxLength) + '...';
      } else {
        return value;
      }
    }

    if(format==='spec_char'){
      if(value.indexOf('%40') != -1){
        return value.substring(0,value.indexOf('%50'));
      }
      else {
        return value.substring(value.indexOf('%70')+3,value.length);
      }
    }
    if(format === "localeDec_3"){
      if(isNaN(value) || value ==""){
        return 0;
        }
      if (Number(value) && Number(value) > 0) {
      //const num: any = parseFloat(value).toFixed(3);
      const num: any = value + 'e+' + 3;
      return Number(Math.round(num) + 'e-' + 3).toLocaleString();
      }
      if(Number(value) == 0){
      const num: any = parseFloat(value).toFixed(3);
      return num;
      }
      }

      if (format === 'decode') {
        return decodeURIComponent(value).replace(/\+/g, ' ');
      }
      if (format === 'htmlEncode') {
        return decodeURIComponent(value).replace(/&#044;/g, ",").replace(/&#010;/g, "\n").replace(/&#039;/g, "\'").replace(/&#034;/g, "\"").replace(/&#092;/g, "\\").replace(/&#124;/g, "\|").replace(/&#46;/g, ".").replace(/&#58/g, ":").replace(/&#011;/g, "\r\n");
      }
      
        return value;
    }

  }
