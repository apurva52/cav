import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutionPlanDetailComponent } from './execution-plan-detail.component';

describe('ExecutionPlanDetailComponent', () => {
  let component: ExecutionPlanDetailComponent;
  let fixture: ComponentFixture<ExecutionPlanDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExecutionPlanDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutionPlanDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
