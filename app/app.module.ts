import { NgModule } from '@angular/core';
import { PagesModule } from './pages/pages.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoggerModule } from 'ngx-logger';
import { TimeoutInterceptor, DEFAULT_TIMEOUT } from './core/interceptors/timeout.interceptor';
import { VideoPlayerComponent } from './shared/video-player/video-player.component';
import { MonacoEditorModule } from 'ngx-monaco-editor';

@NgModule({
  declarations: [AppComponent],
  imports: [
    PagesModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MonacoEditorModule.forRoot(),
    LoggerModule.forRoot(null),
  ],
  bootstrap: [AppComponent],
  providers: [
    // [{ provide: HTTP_INTERCEPTORS, useClass: TimeoutInterceptor, multi: true }],
    // [{ provide: DEFAULT_TIMEOUT, useValue: 59000 }]
  ]
})
export class AppModule { }
