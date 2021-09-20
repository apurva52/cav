import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DdrIntegratedFlowpathComponent } from './ddr-integrated-flowpath.component';

describe('DdrIntegratedFlowpathComponent', () => {
  let component: DdrIntegratedFlowpathComponent;
  let fixture: ComponentFixture<DdrIntegratedFlowpathComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DdrIntegratedFlowpathComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DdrIntegratedFlowpathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
