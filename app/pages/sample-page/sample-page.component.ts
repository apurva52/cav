import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AppError } from 'src/app/core/error/error.model';
import { Store } from 'src/app/core/store/store';
import { SamplePage, SamplePageLoadPayload } from './service/sample-page.model';
import { SamplePageService } from './service/sample-page.service';
import { SamplePageLoadedState, SamplePageLoadingErrorState, SamplePageLoadingState } from './service/sample-page.state';

@Component({
  selector: 'app-sample-page',
  templateUrl: './sample-page.component.html',
  styleUrls: ['./sample-page.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SamplePageComponent implements OnInit {

  data: SamplePage;
  error: AppError;
  loading: boolean;
  empty: boolean;

  constructor(private samplePageService: SamplePageService) {

  }

  ngOnInit(): void {
    const me = this;
    me.load(null);
  }

  load(payload: SamplePageLoadPayload) {
    const me = this;
    me.samplePageService.load(payload).subscribe(
      (state: Store.State) => {

        if (state instanceof SamplePageLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof SamplePageLoadedState) {
          me.onLoaded(state);
          return;
        }

      },
      (state: SamplePageLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  private onLoading(state: SamplePageLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: SamplePageLoadingErrorState) {
    const me = this;
    me.data = null;
    me.error = state.error;
    me.loading = false;
  }

  private onLoaded(state: SamplePageLoadedState) {
    const me = this;
    me.data = state.data;
    me.error = null;
    me.loading = false;
  }

}
