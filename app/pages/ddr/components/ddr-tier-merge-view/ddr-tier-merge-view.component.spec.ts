import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DdrTierMergeViewComponent } from './ddr-tier-merge-view.component';

describe('DdrTierMergeViewComponent', () => {
  let component: DdrTierMergeViewComponent;
  let fixture: ComponentFixture<DdrTierMergeViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DdrTierMergeViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DdrTierMergeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
