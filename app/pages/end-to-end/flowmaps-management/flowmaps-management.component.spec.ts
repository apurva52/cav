import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowmapsManagementComponent } from './flowmaps-management.component';

describe('FlowmapsManagementComponent', () => {
  let component: FlowmapsManagementComponent;
  let fixture: ComponentFixture<FlowmapsManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowmapsManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowmapsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
