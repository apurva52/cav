import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareFlowpathsComponent } from './compare-flowpaths.component';

describe('CompareFlowpathsComponent', () => {
  let component: CompareFlowpathsComponent;
  let fixture: ComponentFixture<CompareFlowpathsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompareFlowpathsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareFlowpathsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
