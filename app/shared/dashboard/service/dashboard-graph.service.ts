import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { environment } from 'src/environments/environment';
import { stream } from 'xlsx/types';
import { ColorSearchInTreeLoadedState, ColorSearchInTreeLoadingErrorState, ColorSearchInTreeLoadingState } from '../sidebars/show-graph-in-tree/service/graph-in-tree.state';
import { DashboardService } from './dashboard.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardGraphService extends Store.AbstractService { 
  // colorArray = [
  //   ['#D3027A', '#DC3595', '#E567AF', '#ED9ACA', '#F6CCE4'],
  //   ['#D1C605', '#DAD137', '#E3DD69', '#EDE89B', '#F6F4CD'],
  //   ['#CE3F06', '#D86538', '#E28C6A', '#EBB29B', '#F5D9CD'],
  //   ['#067DCE', '#3897D8', '#6AB1E2', '#9BCBEB', '#CDE5F5'],
  //   ['#067DCE', '#9D38D8', '#B56AE2', '#CE9BEB', '#E6CDF5'],
  //   ['#06CE23', '#38D84F', '#6AE27B', '#9BEBA7', '#CDF5D3'],
  //   ['#0536D1', '#375EDA', '#6986E3', '#9BAFED', '#CDD7F6'],
  //   ['#4506CE', '#6A38D8', '#8F6AE2', '#B59BEB', '#DACDF5'],
  //   ['#00A1CC', '#33B4D6', '#66C7E0', '#99D9EB', '#CCECF5'],
  //   ['#CCA609', '#D6B83A', '#E0CA6B', '#EBDB9D', '#F5EDCE'],
  //   ['#BACC09', '#C8D63A', '#D6E06B', '#E3EB9D', '#F1F5CE'],
  //   ['#CC0DC7', '#D63DD2', '#E06EDD', '#EB9EE9', '#F5CFF4'],
  //   ['#86D105', '#9EDA37', '#B6E369', '#CFED9B', '#E7F6CD'],
  //   ['#09CC99', '#3AD6AD', '#6BE0C2', '#9DEBD6', '#CEF5EB'],
  //   ['#3000C4', '#5933D0', '#8366DC', '#AC99E7', '#D6CCF3'],
  //   ['#047A64', '#369583', '#68AFA2', '#9BCAC1', '#CDE4E0'],
  //   ['#540A89', '#763BA1', '#986CB8', '#BB9DD0', '#DDCEE7'],
  //   ['#960570', '#AB378D', '#C069A9', '#D59BC6', '#EACDE2'],
  //   ['#043672', '#365E8E', '#6886AA', '#9BAFC7', '#CDD7E3'],
  //   ['#7F7600', '#999133', '#B2AD66', '#CCC899', '#E5E4CC'],
  //   ['#206620', '#4D854D', '#79A379', '#A6C2A6', '#D2E0D2'],
  //   ['#6B4503', '#896A35', '#A68F68', '#C069A9', '#D59BC6'], // TODO: replace #ffffff
  //   ['#65457C', '#846A96', '#A38FB0', '#C1B5CB', '#E0DAE5'],
  //   ['#0D9155', '#3DA777', '#6EBD99', '#9ED3BB', '#CFE9DD'],
  //   ['#DB239A', '#E24FAE', '#E97BC2', '#F1A7D7', '#F8D3EB'],
  //   ['#EFDC2E', '#F2E358', '#F5EA82', '#F9F1AB', '#FCF8D5'],
  //   ['#65E593', '#84EAA9', '#A3EFBE', '#C1F5D4', '#E0FAE9'],
  //   ['#F73777', '#F95F92', '#FA87AD', '#FCAFC9', '#FDD7E4'],
  //   ['#9958B7', '#AD79C5', '#C29BD4', '#D6BCE2', '#EBDEF1'],
  //   ['#51A85C', '#74B97D', '#97CB9D', '#B9DCBE', '#DCEEDE'],
  //   ['#5C5BA4', '#7D7CB6', '#9D9DC8', '#BEBDDB', '#DEDEED'],
  //   ['#EE5853', '#F17975', '#F59B98', '#F8BCBA', '#FCDEDD'],
  //   ['#B70F77', '#C53F92', '#D46FAD', '#E29FC9', '#F8E7F1'],
  //   ['#4F5E66', '#727E85', '#959EA3', '#B9BFC2', '#DCDFE0'],
  //   ['#895A8B', '#A17BA2', '#B89CB9', '#D0BDD1', '#E7DEE8'],
  //   ['#26662C', '#518556', '#7DA380', '#A8C2AB', '#D4E0D5'],
  //   ['#0566D1', '#3785DA', '#69A3E3', '#9BC2ED', '#CDE0F6'],
  //   ['#AE5977', '#BE7A92', '#CE9BAD', '#DFBDC9', '#EFDEE4'],
  //   ['#72354E', '#8E5D71', '#AA8695', '#C7AEB8', '#E3D7DC'],
  //   ['#034F75', '#357291', '#6895AC', '#9AB9C8', '#CDDCE3'],
  //   ['#715B98', '#8D7CAD', '#AA9DC1', '#C6BDD6', '#E3DEEA'],
  //   ['#5BA564', '#7CB783', '#9DC9A2', '#BDDBC1', '#DEEDE0'],
  //   ['#396177', '#618192', '#88A0AD', '#B0C0C9', '#D7DFE4'],
  //   ['#721803', '#8E4635', '#AA7468', '#C7A39A', '#E3D1CD'],
  //   ['#8C5846', '#A3796B', '#BA9B90', '#D1BCB5', '#E8DEDA'],
  //   ['#2A405B', '#55667C', '#7F8C9D', '#AAB3BD', '#393737'],
  //   ['#542537', '#76515F', '#987C87', '#BBA8AF', '#DDD3D7'],
  //   ['#626835', '#81865D', '#A1A486', '#C0C3AE', '#E0E1D7'],
  //   ['#B26695', '#C185AA', '#D1A3BF', '#E0C2D5', '#F0E0EA'],
  //   ['#898446', '#A19D6B', '#B8B590', '#D0CEB5', '#E7E6DA'],
  //   ['#895846', '#A1796B', '#B89B90', '#D0BCB5', '#E7DEDA'],
  //   ['#4C758C', '#7091A3', '#94ACBA', '#B7C8D1', '#DBE3E8'],
  //   ['#73508C', '#8F73A3', '#AB96BA', '#C7B9D1', '#E3DCE8'],
  //   ['#5F9965', '#7FAD84', '#9FC2A3', '#BFD6C1', '#DFEBE0'],
  //   ['#997591', '#A5859D', '#FFFFFF', '#FFFFFF', '#FFFFFF'],
  //   ['#A89F7D', '#B1AA8C', '#C5BFA9', '#D8D5C5', '#ECEAE2'],
  //   ['#B28F86', '#BB9C94', '#CCB5AF', '#DDCDC9', '#EEE6E4'],
  //   ['#7999A9', '#88A5B3', '#A6BBC6', '#C3D2D9', '#E1E8EC'],
  //   ['#9D85B1', '#A893B9', '#BEAECB', '#D3C9DC', '#E9E4EE'],
  //   ['#7BA37E', '#8AAD8D', '#A7C2A9', '#C5D6C6', '#E2EBE2'],
  //   ['#8E2465', '#A55084', '#BB7CA3', '#D2A7C1', '#E8D3E0'],
  //   ['#91881C', '#A7A049', '#BDB877', '#D3CFA4', '#E9E7D2'],
  //   ['#9B3D1C', '#AF6449', '#C38B77', '#D7B1A4', '#EBD8D2'],
  //   ['#256C93', '#5189A9', '#7CA7BE', '#A8C4D4', '#D3E2E9'],
  //   ['#652691', '#8451A7', '#A37DBD', '#C1A8D3', '#E0D4E9'],
  //   ['#1F7F2A', '#4C9955', '#79B27F', '#A5CCAA', '#D2E5D4'],
  //   ['#F95DBD', '#FA7DCA', '#FB9ED7', '#FDBEE5', '#FEDFF2'],
  //   ['#F2E646', '#F5EB6B', '#F7F090', '#FAF5B5', '#FCFADA'],
  //   ['#F97C50', '#FA9673', '#FBB096', '#FDCBB9', '#FEE5DC'],
  //   ['#62CBF9', '#81D5FA', '#A1E0FB', '#C0EAFD', '#E0F5FE'],
  //   ['#B464F9', '#C383FA', '#D2A2FB', '#E1C1FD', '#F0E0FE'],
  //   ['#62F973', '#81FA8F', '#A1FBAB', '#C0FDC7', '#E0FEE3'],
  //   ['#CE6FAA', '#D88CBB', '#E2A9CC', '#EBC5DD', '#F5E2EE'],
  //   ['#AFA680', '#BFB899', '#CFCAB3', '#DFDBCC', '#EFEDE6'],
  //   ['#9B6A6A', '#AF8888', '#C3A6A6', '#D7C3C3', '#EBE1E1'],
  //   ['#5F8599', '#7F9DAD', '#9FB6C2', '#BFCED6', '#DFE7EB'],
  //   ['#6E4F84', '#8B729D', '#A895B5', '#C5B9CE', '#E2DCE6'],
  //   ['#5A8C60', '#7BA380', '#9CBAA0', '#BDD1BF', '#DEE8DF'],
  //   ['#6B1F4E', '#894C71', '#A67995', '#C4A5B8', '#E1D2DC'],
  //   ['#5B5618', '#7C7846', '#9D9A74', '#BDBBA3', '#DEDDD1'],
  //   ['#60301F', '#80594C', '#A08379', '#BFACA5', '#DFD6D2'],
  //   ['#254F66', '#517285', '#7C95A3', '#A8B9C2', '#D3DCE0'],
  //   ['#4D216D', '#714D8A', '#947AA7', '#B8A6C5', '#DBD3E2'],
  //   ['#1A6022', '#48804E', '#76A07A', '#A3BFA7', '#D1DFD3'],
  //   ['#DD0351', '#E43574', '#EB6897', '#F19AB9', '#F8CDDC'],
  //   ['#F9F921', '#FAFA4D', '#FBFB7A', '#FDFDA6', '#FEFED3'],
  //   ['#FCC927', '#FDD452', '#FDDF7D', '#FEE9A9', '#FEF4D4'],
  //   ['#485EFF', '#6D7EFF', '#919EFF', '#B6BFFF', '#DADFFF'],
  //   ['#9538F9', '#AA60FA', '#BF88FB', '#D5AFFD', '#EAD7FE'],
  //   ['#3AFC91', '#61FDA7', '#89FDBD', '#B0FED3', '#D8FEE9'],
  //   ['#F25F9B', '#F57FAF', '#F79FC3', '#FABFD7', '#FCDFEB'],
  //   ['#C4BF58', '#D0CC79', '#DCD99B', '#E7E5BC', '#F3F2DE'],
  //   ['#BC9F4D', '#C9B271', '#D7C594', '#E4D9B8', '#F2ECDB'],
  //   ['#6A7BCC', '#8895D6', '#A6B0E0', '#C3CAEB', '#E1E5F5'],
  //   ['#6D4B99', '#8A6FAD', '#A793C2', '#C5B7D6', '#E2DBEB'],
  //   ['#43A86E', '#69B98B', '#8ECBA8', '#B4DCC5', '#D9EEE2'],
  //   ['#77103A', '#924061', '#AD7089', '#C99FB0', '#E4CFD8'],
  //   ['#6B6812', '#898641', '#A6A471', '#C4C3A0', '#E1E1D0'],
  //   ['#7C5903', '#967A35', '#B09B68', '#CBBD9A', '#E5DECD'],
  //   ['#152368', '#444F86', '#737BA4', '#A1A7C3', '#D0D3E1'],
  //   ['#4D297C', '#715496', '#947FB0', '#B8A9CB', '#DBD4E5'],
  //   ['#1C6B3E', '#498965', '#77A68B', '#A4C4B2', '#D2E1D8'],
  // ];

  colorArray = [];
  firstCount: number = 0;
  secondCount: number = 0;

  constructor(public sessionService: SessionService , public dashboarService : DashboardService) {
    super();
      const payload = {
        groupLevel: 0,
        graphLevel: 0
      }
      this.dashboarService.isReloadFavorite().subscribe(isBack =>{
        if(isBack){
       if(this.colorArray.length === 0){
        this.loadTreeColor(payload);
        this.firstCount = 0;
       }   
       else{
         this.firstCount = 0;
       }
        }
      });
      if(this.colorArray.length === 0){
      this.loadTreeColor(payload);
      }
  }

  loadTreeColor(payloadForColor): any {

    const me = this;
    const path = environment.api.dashboard.treeColor.endpoint;

    me.controller.post(path, payloadForColor).subscribe((result: any[]) => {
      // console.log("color result :", result);
      this.colorArray = result['data'];
      this.sessionService.cacheTreeColor =  this.colorArray;
    }, (e: any) => {

      me.logger.error('loading failed', e);
    });
  }

  getColor(graphId: string): Highcharts.ColorString {
    const me = this;
    let graphColor: string;
    if (graphId) {
      for (const c in me.colorArray) {
        if (c) {
          const gc = me.colorArray[me.firstCount];
          graphColor = gc;
          // for (const color in gc) {
          //   if (color) {
          //     graphColor = gc[me.secondCount];
          //     me.secondCount++;
          //     if (gc.length === me.secondCount) {
          //       me.secondCount = 0;
          //     }
          //     break;
          //   }
          // }
          break;
        }
      }
      me.firstCount++;
      if (me.colorArray.length === me.firstCount) {
        me.firstCount = 0;
      }
    }
    return graphColor;
  }
}


