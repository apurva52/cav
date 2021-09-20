import { SessionService } from 'src/app/core/session/session.service';
import { DrilldownService } from './drilldown.service';
import { TableBoxTable } from 'src/app/pages/dashboard-service-req/ip-summary/table-box/service/table-box.model';
import { MethodCallDetailsMultiselct } from '../../dashboard-service-req/method-call-details/service/method-call-details.model';

export class DrilldownServiceInterceptor {
    enableViewSourceCode: any;
    constructor(
        private drillDownService: DrilldownService,
        private sessionService: SessionService
      ) { }

      createStackJson(stackTrace: string) {
        let splittedStack: any[];
        let stackArr: any[]=[];
        var method;
        var fileName = "";
        var clsWithMethod = "-";
        var cls;
    
        if (stackTrace.indexOf("%7C") != -1)
          splittedStack = stackTrace.split("%7C");
        else
          splittedStack = Array(stackTrace);
    
        for (let m = 0; m < splittedStack.length; m++) {
          if (splittedStack[m] == "-") {
            stackArr.push({ "stack": "%70No Stack Trace Found" });
          }
          else {
            if (splittedStack[m].indexOf("(") != -1) {
    
              var temp = splittedStack[m].substring(0, splittedStack[m].indexOf("("));
              fileName = splittedStack[m].substring(splittedStack[m].indexOf("("), splittedStack[m].indexOf(")") + 1);
    
              method = temp.substring(temp.lastIndexOf(".") + 1, temp.length) + fileName;
              var pc = temp.substring(0, temp.lastIndexOf("."));
              var pkg = pc.substring(0, pc.lastIndexOf("."));
              cls = pc.substring(pc.lastIndexOf(".") + 1, pc.length);
            }
    
            if (splittedStack[m].indexOf('%40') == -1) {
    
              if (cls != undefined && method != undefined)
                clsWithMethod = pkg + "%70" + cls + "." + method;
            }
            else {
    
              clsWithMethod = cls + "." + method + "%50" + splittedStack[m];
            }
    
            stackArr.push({ "stackTrace": clsWithMethod });
    
          }
        }
        return stackArr;
      } 

      mappopupdata(row, indBtPopupDat){
        
        let aggipinfo:TableBoxTable ;
        for(let i=0; i<indBtPopupDat.length;i++ ){
          if(indBtPopupDat[i].backendId == row.backendID){
            aggipinfo = indBtPopupDat[i];
          }         
        }
        return aggipinfo;
      }
      updatedSourceCode(data){
        let preStart = '<pre class="prettyprint lang-java">';
        let preEnd = '</pre>';
        let methodBody, newMethodBody;
        methodBody = preStart + data + preEnd;
        newMethodBody = this.replaceAll(data, "<mark>", "");
        newMethodBody = this.replaceAll(newMethodBody, "</mark>", "");
        newMethodBody = this.replaceAll(newMethodBody, "&lt;", "<");
        newMethodBody = this.replaceAll(newMethodBody, "&gt;", ">");

        return methodBody;

      }
      replaceAll(str, find, replace) {
        return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
      }

      getPackageClassMethod(uniqueMethodSignature:string[]):MethodCallDetailsMultiselct{
        let multiselectobj:MethodCallDetailsMultiselct = {
          packages:[],
          classes:[],
          methods:[]
        };

        for (let k = 0; k < uniqueMethodSignature.length; k++) {
          let tempArr = uniqueMethodSignature[k].split(".");
          let methodN = this.concatArrayToString(tempArr.splice(tempArr.length - 1, 1));
          let classN = this.concatArrayToString(tempArr.splice(tempArr.length - 1, 1));
          let packageN = this.concatArrayToString(tempArr);
          if (packageN != "" && packageN != "-" && multiselectobj.packages.findIndex(x => x.label == packageN) == -1)
            multiselectobj.packages.push({ "label": packageN, "value": packageN });
          if (classN != "" && classN != "-" && multiselectobj.classes.findIndex(x => x.label == classN) == -1)
            multiselectobj.classes.push({ "label": classN, "value": packageN + "_" + classN });
          if (methodN != "" && methodN != "-" && multiselectobj.classes.findIndex(x => x.label == methodN) == -1)
            multiselectobj.methods.push({ "label": methodN, "value": packageN + "_" + classN + "_" + methodN });
    
        }

        
        return multiselectobj;
      }

      concatArrayToString(arr) {
        var str = "";
        for (var i = 0; i < arr.length; i++) {
          str = str + arr[i];
          if (arr.length - 1 != i)
            str = str + ".";
        }
        return str;
      }
    
      MctFilterFormatter(value) {
        if (value != '' && !isNaN(value)) {
          return Number(Number(value)).toLocaleString();
        }
        else if(value === ''){
        return '-';
        }
        else
          return value;
      }

}
