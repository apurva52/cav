import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogsVisualizationComponent } from './logs-visualization.component';

describe('LogsVisualizationComponent', () => {
  let component: LogsVisualizationComponent;
  let fixture: ComponentFixture<LogsVisualizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogsVisualizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogsVisualizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
