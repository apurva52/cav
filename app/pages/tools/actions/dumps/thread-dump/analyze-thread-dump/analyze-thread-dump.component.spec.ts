import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyzeThreadDumpComponent } from './analyze-thread-dump.component';

describe('AnalyzeThreadDumpComponent', () => {
  let component: AnalyzeThreadDumpComponent;
  let fixture: ComponentFixture<AnalyzeThreadDumpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyzeThreadDumpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyzeThreadDumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
