import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadAgentLogsComponent } from './download-agent-logs.component';

describe('DownloadAgentLogsComponent', () => {
  let component: DownloadAgentLogsComponent;
  let fixture: ComponentFixture<DownloadAgentLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadAgentLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadAgentLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
