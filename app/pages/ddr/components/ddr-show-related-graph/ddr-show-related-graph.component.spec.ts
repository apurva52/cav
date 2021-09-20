import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DdrShowRelatedGraphComponent } from './ddr-show-related-graph.component';

describe('DdrShowRelatedGraphComponent', () => {
  let component: DdrShowRelatedGraphComponent;
  let fixture: ComponentFixture<DdrShowRelatedGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DdrShowRelatedGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DdrShowRelatedGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
