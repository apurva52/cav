import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowpathHttpDataComponent } from './flowpath-http-data.component';

describe('FlowpathHttpDataComponent', () => {
  let component: FlowpathHttpDataComponent;
  let fixture: ComponentFixture<FlowpathHttpDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowpathHttpDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowpathHttpDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
