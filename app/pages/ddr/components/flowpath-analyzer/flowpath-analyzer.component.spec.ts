import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowpathAnalyzerComponent } from './flowpath-analyzer.component';

describe('FlowpathAnalyzerComponent', () => {
  let component: FlowpathAnalyzerComponent;
  let fixture: ComponentFixture<FlowpathAnalyzerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowpathAnalyzerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowpathAnalyzerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
