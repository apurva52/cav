import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutionPlanDiagramComponent } from './execution-plan-diagram.component';

describe('ExecutionPlanDiagramComponent', () => {
  let component: ExecutionPlanDiagramComponent;
  let fixture: ComponentFixture<ExecutionPlanDiagramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExecutionPlanDiagramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutionPlanDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
