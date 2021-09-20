import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowpathGroupByComponent } from './flowpath-group-by.component';

describe('FlowpathGroupByComponent', () => {
  let component: FlowpathGroupByComponent;
  let fixture: ComponentFixture<FlowpathGroupByComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowpathGroupByComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowpathGroupByComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
