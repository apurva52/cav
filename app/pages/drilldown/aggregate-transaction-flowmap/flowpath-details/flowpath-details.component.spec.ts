import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowpathDetailsComponent } from './flowpath-details.component';

describe('FlowpathDetailsComponent', () => {
  let component: FlowpathDetailsComponent;
  let fixture: ComponentFixture<FlowpathDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowpathDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowpathDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
